package org.example.db;

import org.junit.jupiter.api.*;

import java.sql.*;

import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class ModelHasPermissionsTableTest {

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
    public void testModelHasPermissionsTableExists() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT EXISTS (" +
                            "   SELECT FROM information_schema.tables " +
                            "   WHERE table_schema = 'public' AND table_name = 'model_has_permissions'" +
                            ");"
            );
            rs.next();
            boolean tableExists = rs.getBoolean(1);
            assertTrue(tableExists, "Table 'model_has_permissions' does not exist");
        }
    }

    @Test
    public void testModelHasPermissionsColumns() throws SQLException {
        String[][] expectedColumns = {
                {"permission_id", "bigint"},
                {"model_type", "character varying"},
                {"model_id", "bigint"}
        };

        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT column_name, data_type " +
                            "FROM information_schema.columns " +
                            "WHERE table_schema = 'public' AND table_name = 'model_has_permissions';"
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
    public void testModelHasPermissionsConstraints() throws SQLException {
        // Проверка первичного ключа
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.model_has_permissions'::regclass AND contype = 'p';"
            );
            rs.next();
            String primaryKey = rs.getString("conname");
            assertEquals("model_has_permissions_pkey", primaryKey, "Primary key constraint is missing or incorrect");
        }

        // Проверка внешних ключей
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.model_has_permissions'::regclass AND contype = 'f';"
            );

            boolean modelIdForeignKeyFound = false;
            boolean permissionIdForeignKeyFound = false;
            while (rs.next()) {
                String foreignKey = rs.getString("conname");

                if (foreignKey.equals("model_has_permissions_model_id_foreign")) {
                    modelIdForeignKeyFound = true;
                }
                if (foreignKey.equals("model_has_permissions_permission_id_foreign")) {
                    permissionIdForeignKeyFound = true;
                }
            }

            assertTrue(modelIdForeignKeyFound, "Foreign key constraint on 'model_id' is missing or incorrect");
            assertTrue(permissionIdForeignKeyFound, "Foreign key constraint on 'permission_id' is missing or incorrect");
        }
    }

    @Test
    public void testModelHasPermissionsIndexes() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT indexname " +
                            "FROM pg_indexes " +
                            "WHERE tablename = 'model_has_permissions';"
            );

            boolean modelIdModelTypeIndexFound = false;

            while (rs.next()) {
                String indexName = rs.getString("indexname");
                if (indexName.equals("model_has_permissions_model_id_model_type_index")) {
                    modelIdModelTypeIndexFound = true;
                }
            }

            assertTrue(modelIdModelTypeIndexFound, "Index on 'model_id' and 'model_type' is missing or incorrect");
        }
    }

    @Test
    public void testModelHasPermissionsDataOperations() throws SQLException {
        int permissionId = 1;
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

        // Вставка данных в таблицу permissions
        try (PreparedStatement pstmt = connection.prepareStatement(
                "INSERT INTO public.permissions (id, name, guard_name) VALUES (?, ?, ?) ON CONFLICT (id) DO NOTHING;"
        )) {
            pstmt.setInt(1, permissionId);
            pstmt.setString(2, "test_permission");
            pstmt.setString(3, "web");
            pstmt.executeUpdate();
        }

        // Вставка данных в таблицу model_has_permissions
        try (PreparedStatement pstmt = connection.prepareStatement(
                "INSERT INTO public.model_has_permissions (permission_id, model_type, model_id) " +
                        "VALUES (?, ?, ?);"
        )) {
            pstmt.setInt(1, permissionId);
            pstmt.setString(2, modelType);
            pstmt.setInt(3, modelId);
            int rowsInserted = pstmt.executeUpdate();
            assertEquals(1, rowsInserted, "Failed to insert data into model_has_permissions");
        }

        // Проверка вставки данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "SELECT * FROM public.model_has_permissions WHERE permission_id = ? AND model_type = ? AND model_id = ?;"
        )) {
            pstmt.setInt(1, permissionId);
            pstmt.setString(2, modelType);
            pstmt.setInt(3, modelId);
            ResultSet rs = pstmt.executeQuery();
            assertTrue(rs.next(), "Data insertion verification failed");
        }

        // Удаление данных и каскадное удаление
        try (Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("DELETE FROM public.permissions WHERE id = 1;");
            ResultSet rs = stmt.executeQuery(
                    "SELECT COUNT(*) FROM public.model_has_permissions WHERE permission_id = 1;"
            );

            rs.next();
            int count = rs.getInt(1);
            assertEquals(0, count, "Failed to cascade delete data from model_has_permissions");
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
