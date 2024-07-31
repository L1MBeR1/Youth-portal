package org.example.db;

import org.junit.jupiter.api.*;

import java.sql.*;

import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class PodcastsTableTest {

    private Connection connection;

    @BeforeAll
    public void setUp() throws SQLException {
        connection = DriverManager.getConnection(DatabaseConfig.URL, DatabaseConfig.USER, DatabaseConfig.PASSWORD);
    }

    @AfterAll
    public void tearDown() throws SQLException {
        if (connection != null) {
            connection.close();
        }
    }

    @BeforeEach
    public void insertData() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            // Вставка необходимых данных в таблицу user_login_data
            stmt.executeUpdate("INSERT INTO public.user_login_data (id, password) VALUES (1, 'test_password') ON CONFLICT (id) DO NOTHING;");
        }
    }

    @AfterEach
    public void deleteData() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            // Удаление данных из таблицы podcasts и user_login_data
            stmt.executeUpdate("DELETE FROM public.podcasts WHERE author_id = 1;");
            stmt.executeUpdate("DELETE FROM public.user_login_data WHERE id = 1;");
        }
    }

    @Test
    public void testPodcastsTableExists() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT EXISTS (" +
                            "   SELECT FROM information_schema.tables " +
                            "   WHERE table_schema = 'public' AND table_name = 'podcasts'" +
                            ");"
            );
            rs.next();
            boolean tableExists = rs.getBoolean(1);
            assertTrue(tableExists, "Table 'podcasts' does not exist");
        }
    }

    @Test
    public void testPodcastsColumns() throws SQLException {
        String[][] expectedColumns = {
                {"id", "integer"},
                {"title", "text"},
                {"description", "jsonb"},
                {"content", "text"},
                {"cover_uri", "text"},
                {"status", "character varying"},
                {"views", "integer"},
                {"likes", "integer"},
                {"reposts", "integer"},
                {"created_at", "timestamp without time zone"},
                {"updated_at", "timestamp without time zone"},
                {"author_id", "integer"}
        };

        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT column_name, data_type " +
                            "FROM information_schema.columns " +
                            "WHERE table_schema = 'public' AND table_name = 'podcasts';"
            );

            while (rs.next()) {
                String columnName = rs.getString("column_name");
                String dataType = rs.getString("data_type");
                boolean columnFound = false;

                for (String[] expectedColumn : expectedColumns) {
                    if (expectedColumn[0].equals(columnName)) {
                        columnFound = true;
                        assertEquals(expectedColumn[1], dataType, "Column " + columnName + " has wrong type");
                        break;
                    }
                }

                assertTrue(columnFound, "Unexpected column " + columnName + " found");
            }
        }
    }

    @Test
    public void testPodcastsConstraints() throws SQLException {
        // Проверка первичного ключа
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.podcasts'::regclass AND contype = 'p';"
            );
            rs.next();
            String primaryKey = rs.getString("conname");
            assertEquals("podcasts_pkey", primaryKey, "Primary key constraint is missing or incorrect");
        }

        // Проверка ограничения CHECK на столбце 'status'
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.podcasts'::regclass AND contype = 'c';"
            );

            boolean checkConstraintFound = false;
            while (rs.next()) {
                String checkConstraint = rs.getString("conname");

                if (checkConstraint.equals("podcasts_status_check")) {
                    checkConstraintFound = true;
                    break;
                }
            }

            assertTrue(checkConstraintFound, "CHECK constraint on 'status' is missing or incorrect");
        }

        // Проверка внешнего ключа 'author_id'
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.podcasts'::regclass AND contype = 'f';"
            );

            boolean foreignKeyFound = false;
            while (rs.next()) {
                String foreignKey = rs.getString("conname");

                if (foreignKey.equals("podcasts_author_id_foreign")) {
                    foreignKeyFound = true;
                    break;
                }
            }

            assertTrue(foreignKeyFound, "Foreign key constraint is missing or incorrect");
        }
    }

    @Test
    public void testPodcastsDataOperations() throws SQLException {
        // Вставка данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "INSERT INTO public.podcasts (title, description, content, cover_uri, status, views, likes, reposts, created_at, updated_at, author_id) " +
                        "VALUES (?, ?::jsonb, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?);"
        )) {
            pstmt.setString(1, "Test Podcast");
            pstmt.setString(2, "{\"key\": \"value\"}");
            pstmt.setString(3, "Test Content");
            pstmt.setString(4, "http://example.com/cover.jpg");
            pstmt.setString(5, "moderating");
            pstmt.setInt(6, 0);
            pstmt.setInt(7, 0);
            pstmt.setInt(8, 0);
            pstmt.setInt(9, 1);
            int rowsInserted = pstmt.executeUpdate();
            assertEquals(1, rowsInserted, "Failed to insert data into podcasts");
        }

        // Обновление данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "UPDATE public.podcasts SET title = ? WHERE author_id = ?;"
        )) {
            pstmt.setString(1, "Updated Podcast");
            pstmt.setInt(2, 1);
            int rowsUpdated = pstmt.executeUpdate();
            assertEquals(1, rowsUpdated, "Failed to update data in podcasts");
        }

        // Проверка обновления данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "SELECT title FROM public.podcasts WHERE author_id = ?;"
        )) {
            pstmt.setInt(1, 1);
            ResultSet rs = pstmt.executeQuery();
            rs.next();
            String updatedTitle = rs.getString("title");
            assertEquals("Updated Podcast", updatedTitle, "Data update verification failed");
        }

        // Удаление данных и каскадное удаление
        try (Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("DELETE FROM public.user_login_data WHERE id = 1;");
            ResultSet rs = stmt.executeQuery(
                    "SELECT COUNT(*) FROM public.podcasts WHERE author_id = 1;"
            );

            rs.next();
            int count = rs.getInt(1);
            assertEquals(0, count, "Failed to cascade delete data from podcasts");
        }
    }
}
