package org.example.db;

import org.junit.jupiter.api.*;

import java.sql.*;

import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class OrganizationsHasUsersTableTest {

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
    public void testOrganizationsHasUsersTableExists() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT EXISTS (" +
                            "   SELECT FROM information_schema.tables " +
                            "   WHERE table_schema = 'public' AND table_name = 'organizations_has_users'" +
                            ");"
            );
            rs.next();
            boolean tableExists = rs.getBoolean(1);
            assertTrue(tableExists, "Table 'organizations_has_users' does not exist");
        }
    }

    @Test
    public void testOrganizationsHasUsersColumns() throws SQLException {
        String[][] expectedColumns = {
                {"organization_id", "integer"},
                {"user_id", "integer"}
        };

        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT column_name, data_type " +
                            "FROM information_schema.columns " +
                            "WHERE table_schema = 'public' AND table_name = 'organizations_has_users';"
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
    public void testOrganizationsHasUsersConstraints() throws SQLException {
        // Проверка первичного ключа
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.organizations_has_users'::regclass AND contype = 'p';"
            );
            rs.next();
            String primaryKey = rs.getString("conname");
            assertEquals("organizations_has_users_pkey", primaryKey, "Primary key constraint is missing or incorrect");
        }

        // Проверка внешнего ключа 'organization_id'
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.organizations_has_users'::regclass AND contype = 'f' AND confkey[1] = '1'::regclass::oid;"
            );

            boolean foreignKeyFound = false;
            while (rs.next()) {
                String foreignKey = rs.getString("conname");

                if (foreignKey.equals("organizations_has_users_organization_id_foreign")) {
                    foreignKeyFound = true;
                    break;
                }
            }

            assertTrue(foreignKeyFound, "Foreign key constraint on 'organization_id' is missing or incorrect");
        }

        // Проверка внешнего ключа 'user_id'
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.organizations_has_users'::regclass AND contype = 'f' AND confkey[1] = '1'::regclass::oid;"
            );

            boolean foreignKeyFound = false;
            while (rs.next()) {
                String foreignKey = rs.getString("conname");

                if (foreignKey.equals("organizations_has_users_user_id_foreign")) {
                    foreignKeyFound = true;
                    break;
                }
            }

            assertTrue(foreignKeyFound, "Foreign key constraint on 'user_id' is missing or incorrect");
        }
    }

    @Test
    public void testOrganizationsHasUsersDataOperations() throws SQLException {
        int organizationId = 1;
        int userId = 1;

        // Вставка данных в таблицу user_login_data
        try (PreparedStatement pstmt = connection.prepareStatement(
                "INSERT INTO public.user_login_data (id, password, email) VALUES (?, ?, ?) ON CONFLICT (id) DO NOTHING;"
        )) {
            pstmt.setInt(1, userId);
            pstmt.setString(2, "test_password");
            pstmt.setString(3, "test_user@example.com");
            pstmt.executeUpdate();
        }

        // Вставка данных в таблицу organizations
        try (PreparedStatement pstmt = connection.prepareStatement(
                "INSERT INTO public.organizations (id, name) VALUES (?, ?) ON CONFLICT (id) DO NOTHING;"
        )) {
            pstmt.setInt(1, organizationId);
            pstmt.setString(2, "Test Organization");
            pstmt.executeUpdate();
        }

        // Вставка данных в таблицу organizations_has_users
        try (PreparedStatement pstmt = connection.prepareStatement(
                "INSERT INTO public.organizations_has_users (organization_id, user_id) " +
                        "VALUES (?, ?);"
        )) {
            pstmt.setInt(1, organizationId);
            pstmt.setInt(2, userId);
            int rowsInserted = pstmt.executeUpdate();
            assertEquals(1, rowsInserted, "Failed to insert data into organizations_has_users");
        }

        // Проверка вставки данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "SELECT * FROM public.organizations_has_users WHERE organization_id = ? AND user_id = ?;"
        )) {
            pstmt.setInt(1, organizationId);
            pstmt.setInt(2, userId);
            ResultSet rs = pstmt.executeQuery();
            assertTrue(rs.next(), "Data insertion verification failed");
        }

        // Удаление данных и каскадное удаление
        try (Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("DELETE FROM public.organizations WHERE id = 1;");
            ResultSet rs = stmt.executeQuery(
                    "SELECT COUNT(*) FROM public.organizations_has_users WHERE organization_id = 1;"
            );

            rs.next();
            int count = rs.getInt(1);
            assertEquals(0, count, "Failed to cascade delete data from organizations_has_users");
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
