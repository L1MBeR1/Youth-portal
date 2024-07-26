package org.example.db;

import org.junit.jupiter.api.*;

import java.sql.*;

import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class UserLoginDataTest {

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
    public void testUserLoginDataTableExists() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT EXISTS (" +
                            "   SELECT FROM information_schema.tables " +
                            "   WHERE table_schema = 'public' AND table_name = 'user_login_data'" +
                            ");"
            );
            rs.next();
            boolean tableExists = rs.getBoolean(1);
            assertTrue(tableExists, "Table 'user_login_data' does not exist");
        }
    }

    @Test
    public void testUserLoginDataColumns() throws SQLException {
        String[][] expectedColumns = {
                {"id", "integer"},
                {"password", "text"},
                {"email", "text"},
                {"email_verified_at", "timestamp without time zone"},
                {"phone", "text"},
                {"phone_verified_at", "timestamp without time zone"},
                {"remember_token", "character varying"},
                {"created_at", "timestamp without time zone"},
                {"updated_at", "timestamp without time zone"},
                {"blocked_at", "timestamp without time zone"}
        };

        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT column_name, data_type " +
                            "FROM information_schema.columns " +
                            "WHERE table_schema = 'public' AND table_name = 'user_login_data';"
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
    public void testUserLoginDataConstraints() throws SQLException {
        // Проверка первичного ключа
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.user_login_data'::regclass AND contype = 'p';"
            );
            rs.next();
            String primaryKey = rs.getString("conname");
            assertEquals("user_login_data_pkey", primaryKey, "Primary key constraint is missing or incorrect");
        }

        // Проверка уникальных ограничений на email и phone
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.user_login_data'::regclass AND contype = 'u';"
            );

            boolean emailUniqueFound = false;
            boolean phoneUniqueFound = false;

            while (rs.next()) {
                String constraintName = rs.getString("conname");

                if (constraintName.equals("user_login_data_email_unique")) {
                    emailUniqueFound = true;
                } else if (constraintName.equals("user_login_data_phone_unique")) {
                    phoneUniqueFound = true;
                }
            }

            assertTrue(emailUniqueFound, "Unique constraint on email is missing or incorrect");
            assertTrue(phoneUniqueFound, "Unique constraint on phone is missing or incorrect");
        }
    }

    @Test
    public void testUserLoginDataDefaultValues() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            // Вставка пользователя
            ResultSet rs = stmt.executeQuery(
                    "INSERT INTO public.user_login_data (password) " +
                            "VALUES ('test_password') " +
                            "RETURNING email, phone, email_verified_at, phone_verified_at, remember_token, created_at, updated_at, blocked_at;"
            );

            rs.next();
            //почему не notnull
            assertNull(rs.getString("email"), "Default value for email is incorrect");
            assertNull(rs.getString("phone"), "Default value for phone is incorrect");
            assertNull(rs.getTimestamp("email_verified_at"), "Default value for email_verified_at is incorrect");
            assertNull(rs.getTimestamp("phone_verified_at"), "Default value for phone_verified_at is incorrect");
            assertNull(rs.getString("remember_token"), "Default value for remember_token is incorrect");
            //почему не notnull
            assertNull(rs.getTimestamp("created_at"), "Default value for created_at is missing");
            assertNull(rs.getTimestamp("updated_at"), "Default value for updated_at is missing");
            assertNull(rs.getTimestamp("blocked_at"), "Default value for blocked_at is incorrect");

            stmt.executeUpdate("DELETE FROM public.user_login_data WHERE password = 'test_password';");
        }
    }

    @Test
    public void testUserLoginDataDataOperations() throws SQLException {
        int userId;

        // Вставка данных
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "INSERT INTO public.user_login_data (password, email, phone) " +
                            "VALUES ('test_password', 'testuser@example.com', '555-1234') " +
                            "RETURNING id;"
            );

            rs.next();
            userId = rs.getInt("id");
            assertTrue(userId > 0, "Failed to insert data into user_login_data");
        }

        // Обновление данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "UPDATE public.user_login_data SET email = 'updateduser@example.com' WHERE id = ? RETURNING email;"
        )) {
            pstmt.setInt(1, userId);
            ResultSet rs = pstmt.executeQuery();

            rs.next();
            String updatedEmail = rs.getString("email");
            assertEquals("updateduser@example.com", updatedEmail, "Failed to update data in user_login_data");
        }

        // Удаление данных
        try (Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("DELETE FROM public.user_login_data WHERE id = " + userId + ";");


            // Проверка, что данные были удалены
            ResultSet rs = stmt.executeQuery(
                    "SELECT COUNT(*) FROM public.user_login_data WHERE id = " + userId + ";"
            );

            rs.next();
            int count = rs.getInt(1);
            assertEquals(0, count, "Failed to delete data from user_login_data");
        }
    }
}
