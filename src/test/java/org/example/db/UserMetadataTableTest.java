package org.example.db;

import org.junit.jupiter.api.*;

import java.sql.*;

import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class UserMetadataTableTest {

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
    public void testUserMetadataTableExists() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT EXISTS (" +
                            "   SELECT FROM information_schema.tables " +
                            "   WHERE table_schema = 'public' AND table_name = 'user_metadata'" +
                            ");"
            );
            rs.next();
            boolean tableExists = rs.getBoolean(1);
            assertTrue(tableExists, "Table 'user_metadata' does not exist");
        }
    }

    @Test
    public void testUserMetadataColumns() throws SQLException {
        String[][] expectedColumns = {
                {"id", "integer"},
                {"user_id", "integer"},
                {"first_name", "text"},
                {"last_name", "text"},
                {"patronymic", "text"},
                {"nickname", "text"},
                {"profile_image_uri", "text"},
                {"city", "text"},
                {"gender", "character varying"},
                {"birthday", "date"}
        };

        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT column_name, data_type " +
                            "FROM information_schema.columns " +
                            "WHERE table_schema = 'public' AND table_name = 'user_metadata';"
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
    public void testUserMetadataConstraints() throws SQLException {
        // Проверка первичного ключа
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.user_metadata'::regclass AND contype = 'p';"
            );
            rs.next();
            String primaryKey = rs.getString("conname");
            assertEquals("user_metadata_pkey", primaryKey, "Primary key constraint is missing or incorrect");
        }

        // Проверка ограничения на значение 'gender'
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname, pg_get_constraintdef(oid) " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.user_metadata'::regclass AND contype = 'c';"
            );

            boolean genderCheckFound = false;
            while (rs.next()) {
                String constraintName = rs.getString("conname");
                String constraintDef = rs.getString("pg_get_constraintdef").replaceAll("\\s+", " "); // Удаление лишних пробелов

                if (constraintName.equals("user_metadata_gender_check") &&
                        constraintDef.contains("CHECK (((gender)::text = ANY ((ARRAY['m'::character varying, 'f'::character varying])::text[])))")) {
                    genderCheckFound = true;
                    break;
                }
            }

            assertTrue(genderCheckFound, "Gender check constraint is missing or incorrect");
        }

        // Проверка внешнего ключа 'user_id'
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.user_metadata'::regclass AND contype = 'f';"
            );

            boolean foreignKeyFound = false;
            while (rs.next()) {
                String foreignKey = rs.getString("conname");

                if (foreignKey.equals("user_metadata_user_id_foreign")) {
                    foreignKeyFound = true;
                    break;
                }
            }

            assertTrue(foreignKeyFound, "Foreign key constraint is missing or incorrect");
        }
    }

    @Test
    public void testUserMetadataDataOperations() throws SQLException {
        int metadataId;

        // Вставка пользователя для проверки внешнего ключа
        try (Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("INSERT INTO public.user_login_data (id, password) VALUES (1, 'test_password') ON CONFLICT (id) DO NOTHING;");
        }

        // Вставка данных
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "INSERT INTO public.user_metadata (user_id, first_name, last_name, gender, birthday) " +
                            "VALUES (1, 'John', 'Doe', 'm', '1990-01-01')  " +
                            "RETURNING user_id ;"
            );

            rs.next();
            metadataId = rs.getInt("user_id");
            assertTrue(metadataId > 0, "Failed to insert data into user_metadata");
        }

        // Обновление данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "UPDATE public.user_metadata SET first_name = 'Jane' WHERE user_id = ? RETURNING first_name;"
        )) {
            pstmt.setInt(1, metadataId);
            ResultSet rs = pstmt.executeQuery();

            rs.next();
            String updatedFirstName = rs.getString("first_name");
            assertEquals("Jane", updatedFirstName, "Failed to update data in user_metadata");
        }

        // Удаление данных и каскадное удаление
        try (Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("DELETE FROM public.user_login_data WHERE id = 1;");
            ResultSet rs = stmt.executeQuery(
                    "SELECT COUNT(*) FROM public.user_metadata WHERE user_id = 1;"
            );

            rs.next();
            int count = rs.getInt(1);
            assertEquals(0, count, "Failed to cascade delete data from user_metadata");
        }
    }
}
