package org.example.db;

import org.junit.jupiter.api.*;

import java.sql.*;

import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class ProjectsTableTest {

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
            // Удаление данных из таблицы projects и user_login_data
            stmt.executeUpdate("DELETE FROM public.projects WHERE author_id = 1;");
            stmt.executeUpdate("DELETE FROM public.user_login_data WHERE id = 1;");
        }
    }

    @Test
    public void testProjectsTableExists() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT EXISTS (" +
                            "   SELECT FROM information_schema.tables " +
                            "   WHERE table_schema = 'public' AND table_name = 'projects'" +
                            ");"
            );
            rs.next();
            boolean tableExists = rs.getBoolean(1);
            assertTrue(tableExists, "Table 'projects' does not exist");
        }
    }

    @Test
    public void testProjectsColumns() throws SQLException {
        String[][] expectedColumns = {
                {"id", "integer"},
                {"name", "text"},
                {"description", "jsonb"},
                {"location", "text"},
                {"author_id", "integer"},
                {"created_at", "timestamp without time zone"},
                {"updated_at", "timestamp without time zone"}
        };

        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT column_name, data_type " +
                            "FROM information_schema.columns " +
                            "WHERE table_schema = 'public' AND table_name = 'projects';"
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
    public void testProjectsConstraints() throws SQLException {
        // Проверка первичного ключа
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.projects'::regclass AND contype = 'p';"
            );
            rs.next();
            String primaryKey = rs.getString("conname");
            assertEquals("projects_pkey", primaryKey, "Primary key constraint is missing or incorrect");
        }

        // Проверка внешнего ключа 'author_id'
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.projects'::regclass AND contype = 'f';"
            );

            boolean foreignKeyFound = false;
            while (rs.next()) {
                String foreignKey = rs.getString("conname");

                if (foreignKey.equals("projects_author_id_foreign")) {
                    foreignKeyFound = true;
                    break;
                }
            }

            assertTrue(foreignKeyFound, "Foreign key constraint is missing or incorrect");
        }
    }

    @Test
    public void testProjectsDataOperations() throws SQLException {
        // Вставка данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "INSERT INTO public.projects (name, description, location, author_id, created_at, updated_at) " +
                        "VALUES (?, ?::jsonb, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);"
        )) {
            pstmt.setString(1, "Test Project");
            pstmt.setString(2, "{\"key\": \"value\"}");
            pstmt.setString(3, "Test Location");
            pstmt.setInt(4, 1);
            int rowsInserted = pstmt.executeUpdate();
            assertEquals(1, rowsInserted, "Failed to insert data into projects");
        }

        // Обновление данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "UPDATE public.projects SET name = ? WHERE author_id = ?;"
        )) {
            pstmt.setString(1, "Updated Project");
            pstmt.setInt(2, 1);
            int rowsUpdated = pstmt.executeUpdate();
            assertEquals(1, rowsUpdated, "Failed to update data in projects");
        }

        // Проверка обновления данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "SELECT name FROM public.projects WHERE author_id = ?;"
        )) {
            pstmt.setInt(1, 1);
            ResultSet rs = pstmt.executeQuery();
            rs.next();
            String updatedName = rs.getString("name");
            assertEquals("Updated Project", updatedName, "Data update verification failed");
        }

        // Удаление данных и каскадное удаление
        try (Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("DELETE FROM public.user_login_data WHERE id = 1;");
            ResultSet rs = stmt.executeQuery(
                    "SELECT COUNT(*) FROM public.projects WHERE author_id = 1;"
            );

            rs.next();
            int count = rs.getInt(1);
            assertEquals(0, count, "Failed to cascade delete data from projects");
        }
    }
}
