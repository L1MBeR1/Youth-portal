package org.example.db;

import org.junit.jupiter.api.*;

import java.sql.*;

import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class PasswordResetTokensTableTest {

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
    public void testPasswordResetTokensTableExists() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT EXISTS (" +
                            "   SELECT FROM information_schema.tables " +
                            "   WHERE table_schema = 'public' AND table_name = 'password_reset_tokens'" +
                            ");"
            );
            rs.next();
            boolean tableExists = rs.getBoolean(1);
            assertTrue(tableExists, "Table 'password_reset_tokens' does not exist");
        }
    }

    @Test
    public void testPasswordResetTokensColumns() throws SQLException {
        String[][] expectedColumns = {
                {"user_id", "integer"},
                {"token", "text"},
                {"created_at", "timestamp without time zone"}
        };

        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT column_name, data_type " +
                            "FROM information_schema.columns " +
                            "WHERE table_schema = 'public' AND table_name = 'password_reset_tokens';"
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
    public void testPasswordResetTokensConstraints() throws SQLException {
        // Проверка первичного ключа
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.password_reset_tokens'::regclass AND contype = 'p';"
            );
            rs.next();
            String primaryKey = rs.getString("conname");
            assertEquals("password_reset_tokens_pkey", primaryKey, "Primary key constraint is missing or incorrect");
        }

        // Проверка внешнего ключа 'user_id'
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.password_reset_tokens'::regclass AND contype = 'f';"
            );

            boolean foreignKeyFound = false;
            while (rs.next()) {
                String foreignKey = rs.getString("conname");

                if (foreignKey.equals("password_reset_tokens_user_id_foreign")) {
                    foreignKeyFound = true;
                    break;
                }
            }

            assertTrue(foreignKeyFound, "Foreign key constraint is missing or incorrect");
        }
    }

    @Test
    public void testPasswordResetTokensDataOperations() throws SQLException {
        int userId = 1;
        String token = "token_12345";

        // Вставка данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "INSERT INTO public.user_login_data (id, password, email) VALUES (?, ?, ?) ON CONFLICT (id) DO NOTHING;"
        )) {
            pstmt.setInt(1, userId);
            pstmt.setString(2, "test_password");
            pstmt.setString(3, "test_user@example.com");
            pstmt.executeUpdate();
        }

        try (PreparedStatement pstmt = connection.prepareStatement(
                "INSERT INTO public.password_reset_tokens (user_id, token, created_at) " +
                        "VALUES (?, ?, CURRENT_TIMESTAMP);"
        )) {
            pstmt.setInt(1, userId);
            pstmt.setString(2, token);
            int rowsInserted = pstmt.executeUpdate();
            assertEquals(1, rowsInserted, "Failed to insert data into password_reset_tokens");
        }

        // Обновление данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "UPDATE public.password_reset_tokens SET token = ? WHERE user_id = ?;"
        )) {
            pstmt.setString(1, "updated_token");
            pstmt.setInt(2, userId);
            int rowsUpdated = pstmt.executeUpdate();
            assertEquals(1, rowsUpdated, "Failed to update data in password_reset_tokens");
        }

        // Проверка обновления данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "SELECT token FROM public.password_reset_tokens WHERE user_id = ?;"
        )) {
            pstmt.setInt(1, userId);
            ResultSet rs = pstmt.executeQuery();
            rs.next();
            String updatedToken = rs.getString("token");
            assertEquals("updated_token", updatedToken, "Data update verification failed");
        }

        // Удаление данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "DELETE FROM public.password_reset_tokens WHERE user_id = ?;"
        )) {
            pstmt.setInt(1, userId);
            int rowsDeleted = pstmt.executeUpdate();
            assertEquals(1, rowsDeleted, "Failed to delete data from password_reset_tokens");
        }

        // Проверка удаления данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "SELECT COUNT(*) FROM public.password_reset_tokens WHERE user_id = ?;"
        )) {
            pstmt.setInt(1, userId);
            ResultSet rs = pstmt.executeQuery();
            rs.next();
            int count = rs.getInt(1);
            assertEquals(0, count, "Data deletion verification failed");
        }

        // Удаление записи из user_login_data для предотвращения конфликтов при повторном запуске тестов
        try (PreparedStatement pstmt = connection.prepareStatement(
                "DELETE FROM public.user_login_data WHERE id = ?;"
        )) {
            pstmt.setInt(1, userId);
            pstmt.executeUpdate();
        }
    }
}
