package org.example.db;
import org.junit.jupiter.api.*;

import java.sql.*;

import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class BlogTableTest {

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
    public void testBlogsTableExists() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT EXISTS (" +
                            "   SELECT FROM information_schema.tables " +
                            "   WHERE table_schema = 'public' AND table_name = 'blogs'" +
                            ");"
            );
            rs.next();
            boolean tableExists = rs.getBoolean(1);
            assertTrue(tableExists, "Table 'blogs' does not exist");
        }
    }

    @Test
    public void testBlogsColumns() throws SQLException {
        String[][] expectedColumns = {
                {"id", "integer"},
                {"title", "text"},
                {"description", "jsonb"},
                {"content", "text"},
                {"cover_uri", "text"},
                {"status", "character varying"},
                {"views", "integer"},
                {"likes", "integer"},
                {"reposts", "integer"},
                {"created_at", "timestamp without time zone"},
                {"updated_at", "timestamp without time zone"},
                {"author_id", "integer"}
        };

        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT column_name, data_type " +
                            "FROM information_schema.columns " +
                            "WHERE table_schema = 'public' AND table_name = 'blogs';"
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
    public void testBlogsConstraints() throws SQLException {
        // Проверка первичного ключа
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.blogs'::regclass AND contype = 'p';"
            );
            rs.next();
            String primaryKey = rs.getString("conname");
            assertEquals("blogs_pkey", primaryKey, "Primary key constraint is missing or incorrect");
        }

        // Проверка ограничения на значение 'status'
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname, pg_get_constraintdef(oid) " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.blogs'::regclass AND contype = 'c';"
            );

            boolean statusCheckFound = false;
            while (rs.next()) {
                String constraintName = rs.getString("conname");
                String constraintDef = rs.getString("pg_get_constraintdef").replaceAll("\\s+", " "); // Удаление лишних пробелов

                if (constraintName.equals("blogs_status_check") &&
                        constraintDef.contains("CHECK (((status)::text = ANY ((ARRAY['moderating'::character varying, 'published'::character varying, 'archived'::character varying, 'pending'::character varying])::text[])))")) {
                    statusCheckFound = true;
                    break;
                }
            }

            assertTrue(statusCheckFound, "Status check constraint is missing or incorrect");
        }

        // Проверка внешнего ключа 'author_id'
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.blogs'::regclass AND contype = 'f';"
            );

            boolean foreignKeyFound = false;
            while (rs.next()) {
                String foreignKey = rs.getString("conname");

                if (foreignKey.equals("blogs_author_id_foreign")) {
                    foreignKeyFound = true;
                    break;
                }
            }

            assertTrue(foreignKeyFound, "Foreign key constraint is missing or incorrect");
        }
    }



    @Test
    public void testBlogsDefaultValues() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            // Вставка пользователя с паролем
            stmt.executeUpdate("INSERT INTO public.user_login_data (id, password) VALUES (1, 'test_password') ON CONFLICT (id) DO NOTHING;");

            // Вставка блога
            ResultSet rs = stmt.executeQuery(
                    "INSERT INTO public.blogs (title, description, content, cover_uri, status, author_id) " +
                            "VALUES ('Test Blog', '{}'::jsonb, 'This is a test blog content.', '/images/test.jpg', 'published', 1) " +
                            "RETURNING views, likes, reposts;"
            );

            rs.next();
            assertEquals(0, rs.getInt("views"), "Default value for views is incorrect");
            assertEquals(0, rs.getInt("likes"), "Default value for likes is incorrect");
            assertEquals(0, rs.getInt("reposts"), "Default value for reposts is incorrect");
        }
    }


    @Test
    public void testBlogsDataOperations() throws SQLException {
        int blogId;

        // Вставка данных
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "INSERT INTO public.blogs (title, description, content, cover_uri, status, author_id) " +
                            "VALUES ('Test Blog Insert', '{}'::jsonb, 'This is a test blog content for insert.', '/images/test.jpg', 'pending', 1) " +
                            "RETURNING id;"
            );

            rs.next();
            blogId = rs.getInt("id");
            assertTrue(blogId > 0, "Failed to insert data into blogs");
        }

        // Обновление данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "UPDATE public.blogs SET title = 'Updated Test Blog' WHERE id = ? RETURNING title;"
        )) {
            pstmt.setInt(1, blogId);
            ResultSet rs = pstmt.executeQuery();

            rs.next();
            String updatedTitle = rs.getString("title");
            assertEquals("Updated Test Blog", updatedTitle, "Failed to update data in blogs");
        }

        // Удаление данных и каскадное удаление
        try (Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("DELETE FROM public.user_login_data WHERE id = 1;");
            ResultSet rs = stmt.executeQuery(
                    "SELECT COUNT(*) FROM public.blogs WHERE author_id = 1;"
            );

            rs.next();
            int count = rs.getInt(1);
            assertEquals(0, count, "Failed to cascade delete data from blogs");
        }
    }
}
