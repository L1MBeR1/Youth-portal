package org.example.db;

import org.junit.jupiter.api.*;
import java.sql.*;

import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class CommentToResourceTableTest {

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
    public void testCommentToResourceTableExists() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT EXISTS (" +
                            "   SELECT FROM information_schema.tables " +
                            "   WHERE table_schema = 'public' AND table_name = 'comment_to_resource'" +
                            ");"
            );
            rs.next();
            boolean tableExists = rs.getBoolean(1);
            assertTrue(tableExists, "Table 'comment_to_resource' does not exist");
        }
    }

    @Test
    public void testCommentToResourceColumns() throws SQLException {
        String[][] expectedColumns = {
                {"id", "bigint"},
                {"comment_id", "bigint"},
                {"podcast_id", "integer"},
                {"blog_id", "integer"},
                {"news_id", "integer"},
                {"reply_to", "bigint"},
                {"created_at", "timestamp without time zone"},
                {"updated_at", "timestamp without time zone"}
        };

        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT column_name, data_type " +
                            "FROM information_schema.columns " +
                            "WHERE table_schema = 'public' AND table_name = 'comment_to_resource';"
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
    public void testCommentToResourceConstraints() throws SQLException {
        // Проверка первичного ключа
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.comment_to_resource'::regclass AND contype = 'p';"
            );
            rs.next();
            String primaryKey = rs.getString("conname");
            assertEquals("comment_to_resource_pkey", primaryKey, "Primary key constraint is missing or incorrect");
        }

        // Проверка внешних ключей
        String[][] foreignKeys = {
                {"comment_to_resource_blog_id_foreign", "blog_id"},
                {"comment_to_resource_comment_id_foreign", "comment_id"},
                {"comment_to_resource_news_id_foreign", "news_id"},
                {"comment_to_resource_podcast_id_foreign", "podcast_id"},
                {"comment_to_resource_reply_to_foreign", "reply_to"}
        };

        for (String[] foreignKey : foreignKeys) {
            try (Statement stmt = connection.createStatement()) {
                ResultSet rs = stmt.executeQuery(
                        "SELECT conname " +
                                "FROM pg_constraint " +
                                "WHERE conrelid = 'public.comment_to_resource'::regclass AND contype = 'f' AND conname = '" + foreignKey[0] + "';"
                );

                boolean foreignKeyFound = false;
                while (rs.next()) {
                    String fkName = rs.getString("conname");
                    if (fkName.equals(foreignKey[0])) {
                        foreignKeyFound = true;
                        break;
                    }
                }

                assertTrue(foreignKeyFound, "Foreign key constraint " + foreignKey[0] + " is missing or incorrect for column " + foreignKey[1]);
            }
        }
    }

    @Test
    public void testCommentToResourceDataOperations() throws SQLException {
        int commentToResourceId;

        // Вставка данных
        try (Statement stmt = connection.createStatement()) {
            // Вставка данных в связанные таблицы
            stmt.executeUpdate("INSERT INTO public.blogs (id, title, description, content, cover_uri, status, author_id) VALUES (1, 'Test Blog', '{}'::jsonb, 'This is a test blog content.', '/images/test.jpg', 'published', 1) ON CONFLICT (id) DO NOTHING;");
            stmt.executeUpdate("INSERT INTO public.user_login_data (id, password) VALUES (1, 'test_password') ON CONFLICT (id) DO NOTHING;");
            stmt.executeUpdate("INSERT INTO public.comments (id, user_id, content) VALUES (1, 1, 'Test comment') ON CONFLICT (id) DO NOTHING;");


            ResultSet rs = stmt.executeQuery(
                    "INSERT INTO public.comment_to_resource (comment_id, blog_id) " +
                            "VALUES (1, 1) " +
                            "RETURNING id;"
            );

            rs.next();
            commentToResourceId = rs.getInt("id");
            assertTrue(commentToResourceId > 0, "Failed to insert data into comment_to_resource");

        }

        // Обновление данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "UPDATE public.comment_to_resource SET blog_id = NULL WHERE id = ? RETURNING blog_id;"
        )) {
            pstmt.setInt(1, commentToResourceId);
            ResultSet rs = pstmt.executeQuery();

            rs.next();
            Integer updatedBlogId = rs.getObject("blog_id", Integer.class);
            assertNull(updatedBlogId, "Failed to update data in comment_to_resource");
        }

        // Удаление данных и каскадное удаление
        try (Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("DELETE FROM public.comments WHERE id = 1;");
            ResultSet rs = stmt.executeQuery(
                    "SELECT COUNT(*) FROM public.comment_to_resource WHERE comment_id = 1;"
            );

            rs.next();
            int count = rs.getInt(1);
            assertEquals(0, count, "Failed to cascade delete data from comment_to_resource");

            stmt.executeUpdate("DELETE FROM public.user_login_data WHERE id = 1");
        }
    }
}
