package org.example.db;

import org.junit.jupiter.api.*;

import java.sql.*;

import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class ModelHasRolesTableTest {

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
    public void testModelHasRolesTableExists() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT EXISTS (" +
                            "   SELECT FROM information_schema.tables " +
                            "   WHERE table_schema = 'public' AND table_name = 'model_has_roles'" +
                            ");"
            );
            rs.next();
            boolean tableExists = rs.getBoolean(1);
            assertTrue(tableExists, "Table 'model_has_roles' does not exist");
        }
    }

    @Test
    public void testModelHasRolesColumns() throws SQLException {
        String[][] expectedColumns = {
                {"role_id", "bigint"},
                {"model_type", "character varying"},
                {"model_id", "bigint"}
        };

        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT column_name, data_type " +
                            "FROM information_schema.columns " +
                            "WHERE table_schema = 'public' AND table_name = 'model_has_roles';"
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
    public void testModelHasRolesConstraints() throws SQLException {
        // Проверка первичного ключа
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.model_has_roles'::regclass AND contype = 'p';"
            );
            rs.next();
            String primaryKey = rs.getString("conname");
            assertEquals("model_has_roles_pkey", primaryKey, "Primary key constraint is missing or incorrect");
        }

        // Проверка внешних ключей
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.model_has_roles'::regclass AND contype = 'f';"
            );

            boolean modelIdForeignKeyFound = false;
            boolean roleIdForeignKeyFound = false;
            while (rs.next()) {
                String foreignKey = rs.getString("conname");

                if (foreignKey.equals("model_has_roles_model_id_foreign")) {
                    modelIdForeignKeyFound = true;
                }
                if (foreignKey.equals("model_has_roles_role_id_foreign")) {
                    roleIdForeignKeyFound = true;
                }
            }

            assertTrue(modelIdForeignKeyFound, "Foreign key constraint on 'model_id' is missing or incorrect");
            assertTrue(roleIdForeignKeyFound, "Foreign key constraint on 'role_id' is missing or incorrect");
        }
    }

    @Test
    public void testModelHasRolesIndexes() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT indexname " +
                            "FROM pg_indexes " +
                            "WHERE tablename = 'model_has_roles';"
            );

            boolean modelIdModelTypeIndexFound = false;

            while (rs.next()) {
                String indexName = rs.getString("indexname");
                if (indexName.equals("model_has_roles_model_id_model_type_index")) {
                    modelIdModelTypeIndexFound = true;
                }
            }

            assertTrue(modelIdModelTypeIndexFound, "Index on 'model_id' and 'model_type' is missing or incorrect");
        }
    }

    @Test
    public void testModelHasRolesDataOperations() throws SQLException {
        int roleId = 1;
        int modelId = 1;
        String modelType = "User";

        // Вставка данных в таблицу user_login_data
        try (PreparedStatement pstmt = connection.prepareStatement(
                "INSERT INTO public.user_login_data (id, password, email) VALUES (?, ?, ?) ON CONFLICT (id) DO NOTHING;"
        )) {
            pstmt.setInt(1, modelId);
            pstmt.setString(2, "test_password");
            pstmt.setString(3, "test_user@example.com");
            pstmt.executeUpdate();
        }

        // Вставка данных в таблицу roles
        try (PreparedStatement pstmt = connection.prepareStatement(
                "INSERT INTO public.roles (id, name, guard_name) VALUES (?, ?, ?) ON CONFLICT (id) DO NOTHING;"
        )) {
            pstmt.setInt(1, roleId);
            pstmt.setString(2, "test_role");
            pstmt.setString(3, "web");
            pstmt.executeUpdate();
        }

        // Вставка данных в таблицу model_has_roles
        try (PreparedStatement pstmt = connection.prepareStatement(
                "INSERT INTO public.model_has_roles (role_id, model_type, model_id) " +
                        "VALUES (?, ?, ?);"
        )) {
            pstmt.setInt(1, roleId);
            pstmt.setString(2, modelType);
            pstmt.setInt(3, modelId);
            int rowsInserted = pstmt.executeUpdate();
            assertEquals(1, rowsInserted, "Failed to insert data into model_has_roles");
        }

        // Проверка вставки данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "SELECT * FROM public.model_has_roles WHERE role_id = ? AND model_type = ? AND model_id = ?;"
        )) {
            pstmt.setInt(1, roleId);
            pstmt.setString(2, modelType);
            pstmt.setInt(3, modelId);
            ResultSet rs = pstmt.executeQuery();
            assertTrue(rs.next(), "Data insertion verification failed");
        }

        // Удаление данных и каскадное удаление
        try (Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("DELETE FROM public.roles WHERE id = 1;");
            ResultSet rs = stmt.executeQuery(
                    "SELECT COUNT(*) FROM public.model_has_roles WHERE role_id = 1;"
            );

            rs.next();
            int count = rs.getInt(1);
            assertEquals(0, count, "Failed to cascade delete data from model_has_roles");
        }

        // Удаление записи из user_login_data для предотвращения конфликтов при повторном запуске тестов
        try (PreparedStatement pstmt = connection.prepareStatement(
                "DELETE FROM public.user_login_data WHERE id = ?;"
        )) {
            pstmt.setInt(1, modelId);
            pstmt.executeUpdate();
        }
    }
}
