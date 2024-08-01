package org.example.db;

import org.junit.jupiter.api.*;

import java.sql.*;

import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class PermissionsTableTest {

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
    public void testPermissionsTableExists() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT EXISTS (" +
                            "   SELECT FROM information_schema.tables " +
                            "   WHERE table_schema = 'public' AND table_name = 'permissions'" +
                            ");"
            );
            rs.next();
            boolean tableExists = rs.getBoolean(1);
            assertTrue(tableExists, "Table 'permissions' does not exist");
        }
    }

    @Test
    public void testPermissionsColumns() throws SQLException {
        String[][] expectedColumns = {
                {"id", "bigint"},
                {"name", "character varying"},
                {"guard_name", "character varying"},
                {"created_at", "timestamp without time zone"},
                {"updated_at", "timestamp without time zone"}
        };

        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT column_name, data_type " +
                            "FROM information_schema.columns " +
                            "WHERE table_schema = 'public' AND table_name = 'permissions';"
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
    public void testPermissionsConstraints() throws SQLException {
        // Проверка первичного ключа
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.permissions'::regclass AND contype = 'p';"
            );
            rs.next();
            String primaryKey = rs.getString("conname");
            assertEquals("permissions_pkey", primaryKey, "Primary key constraint is missing or incorrect");
        }

        // Проверка уникального ограничения на 'name' и 'guard_name'
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.permissions'::regclass AND contype = 'u';"
            );

            boolean uniqueConstraintFound = false;
            while (rs.next()) {
                String uniqueConstraint = rs.getString("conname");

                if (uniqueConstraint.equals("permissions_name_guard_name_unique")) {
                    uniqueConstraintFound = true;
                    break;
                }
            }

            assertTrue(uniqueConstraintFound, "Unique constraint on 'name' and 'guard_name' is missing or incorrect");
        }
    }

    @Test
    public void testPermissionsDataOperations() throws SQLException {
        String permissionName = "permission_test";
        String guardName = "guard_test";

        // Вставка данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "INSERT INTO public.permissions (name, guard_name, created_at, updated_at) " +
                        "VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);"
        )) {
            pstmt.setString(1, permissionName);
            pstmt.setString(2, guardName);
            int rowsInserted = pstmt.executeUpdate();
            assertEquals(1, rowsInserted, "Failed to insert data into permissions");
        }

        // Обновление данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "UPDATE public.permissions SET name = ? WHERE name = ?;"
        )) {
            pstmt.setString(1, "updated_permission_test");
            pstmt.setString(2, permissionName);
            int rowsUpdated = pstmt.executeUpdate();
            assertEquals(1, rowsUpdated, "Failed to update data in permissions");
        }

        // Проверка обновления данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "SELECT name FROM public.permissions WHERE guard_name = ?;"
        )) {
            pstmt.setString(1, guardName);
            ResultSet rs = pstmt.executeQuery();
            rs.next();
            String updatedName = rs.getString("name");
            assertEquals("updated_permission_test", updatedName, "Data update verification failed");
        }

        // Удаление данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "DELETE FROM public.permissions WHERE name = ?;"
        )) {
            pstmt.setString(1, "updated_permission_test");
            int rowsDeleted = pstmt.executeUpdate();
            assertEquals(1, rowsDeleted, "Failed to delete data from permissions");
        }

        // Проверка удаления данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "SELECT COUNT(*) FROM public.permissions WHERE name = ?;"
        )) {
            pstmt.setString(1, "updated_permission_test");
            ResultSet rs = pstmt.executeQuery();
            rs.next();
            int count = rs.getInt(1);
            assertEquals(0, count, "Data deletion verification failed");
        }
    }
}
