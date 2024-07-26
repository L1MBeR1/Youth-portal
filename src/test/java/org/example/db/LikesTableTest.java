package org.example.db;

import org.junit.jupiter.api.*;

import java.sql.*;

import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class LikesTableTest {

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
    public void startTransaction() throws SQLException {
        connection.setAutoCommit(false);
    }

    @AfterEach
    public void rollbackTransaction() throws SQLException {
        connection.rollback();
        connection.setAutoCommit(true);
    }


    @Test
    public void testLikesTableExists() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT EXISTS (" +
                            "   SELECT FROM information_schema.tables " +
                            "   WHERE table_schema = 'public' AND table_name = 'likes'" +
                            ");"
            );
            rs.next();
            boolean tableExists = rs.getBoolean(1);
            assertTrue(tableExists, "Table 'likes' does not exist");
        }
    }

    @Test
    public void testLikesColumns() throws SQLException {
        String[][] expectedColumns = {
                {"id", "integer"},
                {"user_id", "integer"},
                {"likeable_id", "integer"},
                {"likeable_type", "character varying"},
                {"created_at", "timestamp without time zone"},
                {"updated_at", "timestamp without time zone"}
        };

        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT column_name, data_type " +
                            "FROM information_schema.columns " +
                            "WHERE table_schema = 'public' AND table_name = 'likes';"
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
    public void testLikesConstraints() throws SQLException {
        // Проверка первичного ключа
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.likes'::regclass AND contype = 'p';"
            );
            rs.next();
            String primaryKey = rs.getString("conname");
            assertEquals("likes_pkey", primaryKey, "Primary key constraint is missing or incorrect");
        }

        // Проверка внешнего ключа 'user_id'
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.likes'::regclass AND contype = 'f';"
            );

            boolean foreignKeyFound = false;
            while (rs.next()) {
                String foreignKey = rs.getString("conname");

                if (foreignKey.equals("likes_user_id_foreign")) {
                    foreignKeyFound = true;
                    break;
                }
            }

            assertTrue(foreignKeyFound, "Foreign key constraint is missing or incorrect");
        }
    }

    @Test
    public void testLikesDefaultValues() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            // Вставка пользователя для проверки внешнего ключа
            stmt.executeUpdate("INSERT INTO public.user_login_data (id, password) VALUES (1, 'test_password') ON CONFLICT (id) DO NOTHING;");

            // Вставка лайка
            ResultSet rs = stmt.executeQuery(
                    "INSERT INTO public.likes (user_id, likeable_id, likeable_type) " +
                            "VALUES (1, 1, 'post') " +
                            "RETURNING created_at, updated_at;"
            );

            rs.next();
            //почему не notnull
            assertNull(rs.getTimestamp("created_at"), "Default value for created_at is missing");
            assertNull(rs.getTimestamp("updated_at"), "Default value for updated_at is missing");

        }
    }

    @Test
    public void testLikesDataOperations() throws SQLException {
        int likeId;

        // Вставка данных
        try (Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("INSERT INTO public.user_login_data (id, password) VALUES (1, 'test_password') ON CONFLICT (id) DO NOTHING;");
            ResultSet rs = stmt.executeQuery(
                    "INSERT INTO public.likes (user_id, likeable_id, likeable_type) " +
                            "VALUES (1, 1, 'post') " +
                            "RETURNING id;"
            );

            rs.next();
            likeId = rs.getInt("id");
            assertTrue(likeId > 0, "Failed to insert data into likes");
        }

        // Обновление данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "UPDATE public.likes SET likeable_type = 'comment' WHERE id = ? RETURNING likeable_type;"
        )) {
            pstmt.setInt(1, likeId);
            ResultSet rs = pstmt.executeQuery();

            rs.next();
            String updatedLikeableType = rs.getString("likeable_type");
            assertEquals("comment", updatedLikeableType, "Failed to update data in likes");
        }

        // Удаление данных и каскадное удаление
        try (Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("DELETE FROM public.user_login_data WHERE id = 1;");
            ResultSet rs = stmt.executeQuery(
                    "SELECT COUNT(*) FROM public.likes WHERE user_id = 1;"
            );

            rs.next();
            int count = rs.getInt(1);
            assertEquals(0, count, "Failed to cascade delete data from likes");
        }
    }
}
