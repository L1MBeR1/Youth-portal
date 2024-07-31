package org.example.db;

import org.junit.jupiter.api.*;

import java.sql.*;

import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class RolesTableTest {

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
    public void testRolesTableExists() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT EXISTS (" +
                            "   SELECT FROM information_schema.tables " +
                            "   WHERE table_schema = 'public' AND table_name = 'roles'" +
                            ");"
            );
            rs.next();
            boolean tableExists = rs.getBoolean(1);
            assertTrue(tableExists, "Table 'roles' does not exist");
        }
    }

    @Test
    public void testRolesColumns() throws SQLException {
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
                            "WHERE table_schema = 'public' AND table_name = 'roles';"
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
    public void testRolesConstraints() throws SQLException {
        // Проверка первичного ключа
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.roles'::regclass AND contype = 'p';"
            );
            rs.next();
            String primaryKey = rs.getString("conname");
            assertEquals("roles_pkey", primaryKey, "Primary key constraint is missing or incorrect");
        }

        // Проверка уникального ограничения на (name, guard_name)
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.roles'::regclass AND contype = 'u';"
            );

            boolean uniqueConstraintFound = false;
            while (rs.next()) {
                String uniqueConstraint = rs.getString("conname");

                if (uniqueConstraint.equals("roles_name_guard_name_unique")) {
                    uniqueConstraintFound = true;
                    break;
                }
            }

            assertTrue(uniqueConstraintFound, "Unique constraint on (name, guard_name) is missing or incorrect");
        }
    }

    @Test
    public void testRolesDataOperations() throws SQLException {
        long roleId;

        // Вставка данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "INSERT INTO public.roles (name, guard_name) " +
                        "VALUES (?, ?) " +
                        "RETURNING id;"
        )) {
            pstmt.setString(1, "admin");
            pstmt.setString(2, "web");
            ResultSet rs = pstmt.executeQuery();

            rs.next();
            roleId = rs.getLong("id");
            assertTrue(roleId > 0, "Failed to insert data into roles");
        }

        // Обновление данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "UPDATE public.roles SET name = ? WHERE id = ? RETURNING name;"
        )) {
            pstmt.setString(1, "superadmin");
            pstmt.setLong(2, roleId);
            ResultSet rs = pstmt.executeQuery();

            rs.next();
            String updatedName = rs.getString("name");
            assertEquals("superadmin", updatedName, "Failed to update data in roles");
        }

        // Удаление данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "DELETE FROM public.roles WHERE id = ?;"
        )) {
            pstmt.setLong(1, roleId);
            int rowsDeleted = pstmt.executeUpdate();
            assertEquals(1, rowsDeleted, "Failed to delete data from roles");
        }
    }
}
