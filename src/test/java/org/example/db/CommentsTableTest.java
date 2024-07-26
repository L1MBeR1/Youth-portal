package org.example.db;

import org.junit.jupiter.api.*;

import java.sql.*;

import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class CommentsTableTest {

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

    @Test
    public void testCommentsTableExists() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT EXISTS (" +
                            "   SELECT FROM information_schema.tables " +
                            "   WHERE table_schema = 'public' AND table_name = 'comments'" +
                            ");"
            );
            rs.next();
            boolean tableExists = rs.getBoolean(1);
            assertTrue(tableExists, "Table 'comments' does not exist");
        }
    }

    @Test
    public void testCommentsColumns() throws SQLException {
        String[][] expectedColumns = {
                {"id", "bigint"},
                {"user_id", "integer"},
                {"content", "text"},
                {"likes", "integer"},
                {"created_at", "timestamp without time zone"},
                {"updated_at", "timestamp without time zone"}
        };

        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT column_name, data_type " +
                            "FROM information_schema.columns " +
                            "WHERE table_schema = 'public' AND table_name = 'comments';"
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
    public void testCommentsConstraints() throws SQLException {
        // Проверка первичного ключа
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.comments'::regclass AND contype = 'p';"
            );
            rs.next();
            String primaryKey = rs.getString("conname");
            assertEquals("comments_pkey", primaryKey, "Primary key constraint is missing or incorrect");
        }

        // Проверка внешнего ключа 'user_id'
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.comments'::regclass AND contype = 'f';"
            );

            boolean foreignKeyFound = false;
            while (rs.next()) {
                String foreignKey = rs.getString("conname");

                if (foreignKey.equals("comments_user_id_foreign")) {
                    foreignKeyFound = true;
                    break;
                }
            }

            assertTrue(foreignKeyFound, "Foreign key constraint is missing or incorrect");
        }
    }

    @Test
    public void testCommentsDefaultValues() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            // Вставка данных
            stmt.executeUpdate("INSERT INTO public.user_login_data (id, password) VALUES (1, 'test_password') ON CONFLICT (id) DO NOTHING;");
            ResultSet rs = stmt.executeQuery(
                    "INSERT INTO public.comments (user_id, content) " +
                            "VALUES (1, 'Test comment') " +
                            "RETURNING likes;"
            );

            rs.next();
            assertEquals(0, rs.getInt("likes"), "Default value for likes is incorrect");
        }
    }

    @Test
    public void testCommentsDataOperations() throws SQLException {
        int commentId;

        // Вставка данных
        try (Statement stmt = connection.createStatement()) {
            // Вставка данных в связанные таблицы
            stmt.executeUpdate("INSERT INTO public.user_login_data (id, password) VALUES (1, 'test_password') ON CONFLICT (id) DO NOTHING;");

            ResultSet rs = stmt.executeQuery(
                    "INSERT INTO public.comments (user_id, content) " +
                            "VALUES (1, 'Test comment for insert') " +
                            "RETURNING id;"
            );

            rs.next();
            commentId = rs.getInt("id");
            assertTrue(commentId > 0, "Failed to insert data into comments");
        }

        // Обновление данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "UPDATE public.comments SET content = 'Updated Test Comment' WHERE id = ? RETURNING content;"
        )) {
            pstmt.setInt(1, commentId);
            ResultSet rs = pstmt.executeQuery();

            rs.next();
            String updatedContent = rs.getString("content");
            assertEquals("Updated Test Comment", updatedContent, "Failed to update data in comments");
        }

        // Удаление данных и каскадное удаление
        try (Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("DELETE FROM public.user_login_data WHERE id = 1;");
            ResultSet rs = stmt.executeQuery(
                    "SELECT COUNT(*) FROM public.comments WHERE user_id = 1;"
            );

            rs.next();
            int count = rs.getInt(1);
            assertEquals(0, count, "Failed to cascade delete data from comments");
        }
    }
}
