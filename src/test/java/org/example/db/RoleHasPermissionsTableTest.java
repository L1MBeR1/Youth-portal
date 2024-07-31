package org.example.db;

import org.junit.jupiter.api.*;

import java.sql.*;

import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class RoleHasPermissionsTableTest {

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
            // Вставка необходимых данных в таблицы roles и permissions
            stmt.executeUpdate("INSERT INTO public.roles (id, name, guard_name) VALUES (1, 'role_name', 'guard_name') ON CONFLICT (id) DO NOTHING;");
            stmt.executeUpdate("INSERT INTO public.permissions (id, name, guard_name) VALUES (1, 'permission_name', 'guard_name') ON CONFLICT (id) DO NOTHING;");
        }
    }

    @AfterEach
    public void deleteData() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            // Удаление данных из таблиц roles и permissions
            stmt.executeUpdate("DELETE FROM public.role_has_permissions WHERE role_id = 1 AND permission_id = 1;");
            stmt.executeUpdate("DELETE FROM public.roles WHERE id = 1;");
            stmt.executeUpdate("DELETE FROM public.permissions WHERE id = 1;");
        }
    }

    @Test
    public void testRoleHasPermissionsTableExists() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT EXISTS (" +
                            "   SELECT FROM information_schema.tables " +
                            "   WHERE table_schema = 'public' AND table_name = 'role_has_permissions'" +
                            ");"
            );
            rs.next();
            boolean tableExists = rs.getBoolean(1);
            assertTrue(tableExists, "Table 'role_has_permissions' does not exist");
        }
    }

    @Test
    public void testRoleHasPermissionsColumns() throws SQLException {
        String[][] expectedColumns = {
                {"permission_id", "bigint"},
                {"role_id", "bigint"}
        };

        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT column_name, data_type " +
                            "FROM information_schema.columns " +
                            "WHERE table_schema = 'public' AND table_name = 'role_has_permissions';"
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
    public void testRoleHasPermissionsConstraints() throws SQLException {
        // Проверка первичного ключа
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.role_has_permissions'::regclass AND contype = 'p';"
            );
            rs.next();
            String primaryKey = rs.getString("conname");
            assertEquals("role_has_permissions_pkey", primaryKey, "Primary key constraint is missing or incorrect");
        }

        // Проверка внешнего ключа 'permission_id'
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.role_has_permissions'::regclass AND contype = 'f';"
            );

            boolean foreignKeyFound = false;
            while (rs.next()) {
                String foreignKey = rs.getString("conname");

                if (foreignKey.equals("role_has_permissions_permission_id_foreign")) {
                    foreignKeyFound = true;
                    break;
                }
            }

            assertTrue(foreignKeyFound, "Foreign key constraint 'permission_id' is missing or incorrect");
        }

        // Проверка внешнего ключа 'role_id'
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.role_has_permissions'::regclass AND contype = 'f';"
            );

            boolean foreignKeyFound = false;
            while (rs.next()) {
                String foreignKey = rs.getString("conname");

                if (foreignKey.equals("role_has_permissions_role_id_foreign")) {
                    foreignKeyFound = true;
                    break;
                }
            }

            assertTrue(foreignKeyFound, "Foreign key constraint 'role_id' is missing or incorrect");
        }
    }

    @Test
    public void testRoleHasPermissionsDataOperations() throws SQLException {
        // Вставка данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "INSERT INTO public.role_has_permissions (permission_id, role_id) VALUES (?, ?);"
        )) {
            pstmt.setLong(1, 1L);
            pstmt.setLong(2, 1L);
            int rowsInserted = pstmt.executeUpdate();
            assertEquals(1, rowsInserted, "Failed to insert data into role_has_permissions");
        }

        // Проверка вставки данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "SELECT COUNT(*) FROM public.role_has_permissions WHERE permission_id = ? AND role_id = ?;"
        )) {
            pstmt.setLong(1, 1L);
            pstmt.setLong(2, 1L);
            ResultSet rs = pstmt.executeQuery();
            rs.next();
            int count = rs.getInt(1);
            assertEquals(1, count, "Data insertion verification failed");
        }

        // Удаление данных и каскадное удаление
        try (Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("DELETE FROM public.permissions WHERE id = 1;");
            ResultSet rs = stmt.executeQuery(
                    "SELECT COUNT(*) FROM public.role_has_permissions WHERE permission_id = 1;"
            );

            rs.next();
            int count = rs.getInt(1);
            assertEquals(0, count, "Failed to cascade delete data from role_has_permissions");
        }
    }
}
