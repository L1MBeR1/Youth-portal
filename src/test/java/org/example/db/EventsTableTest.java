package org.example.db;

import org.junit.jupiter.api.*;

import java.sql.*;

import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class EventsTableTest {

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
    public void testEventsTableExists() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT EXISTS (" +
                            "   SELECT FROM information_schema.tables " +
                            "   WHERE table_schema = 'public' AND table_name = 'events'" +
                            ");"
            );
            rs.next();
            boolean tableExists = rs.getBoolean(1);
            assertTrue(tableExists, "Table 'events' does not exist");
        }
    }

    @Test
    public void testEventsColumns() throws SQLException {
        String[][] expectedColumns = {
                {"id", "integer"},
                {"name", "text"},
                {"description", "text"},
                {"location", "text"},
                {"views", "integer"},
                {"start_time", "timestamp without time zone"},
                {"end_time", "timestamp without time zone"},
                {"created_at", "timestamp without time zone"},
                {"updated_at", "timestamp without time zone"},
                {"author_id", "integer"},
                {"project_id", "integer"}
        };

        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT column_name, data_type " +
                            "FROM information_schema.columns " +
                            "WHERE table_schema = 'public' AND table_name = 'events';"
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
    public void testEventsConstraints() throws SQLException {
        // Проверка первичного ключа
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.events'::regclass AND contype = 'p';"
            );
            rs.next();
            String primaryKey = rs.getString("conname");
            assertEquals("events_pkey", primaryKey, "Primary key constraint is missing or incorrect");
        }

        // Проверка внешнего ключа 'author_id'
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.events'::regclass AND contype = 'f';"
            );

            boolean foreignKeyFound = false;
            while (rs.next()) {
                String foreignKey = rs.getString("conname");

                if (foreignKey.equals("events_author_id_foreign")) {
                    foreignKeyFound = true;
                    break;
                }
            }

            assertTrue(foreignKeyFound, "Foreign key constraint on 'author_id' is missing or incorrect");
        }

        // Проверка внешнего ключа 'project_id'
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.events'::regclass AND contype = 'f';"
            );

            boolean foreignKeyFound = false;
            while (rs.next()) {
                String foreignKey = rs.getString("conname");

                if (foreignKey.equals("events_project_id_foreign")) {
                    foreignKeyFound = true;
                    break;
                }
            }

            assertTrue(foreignKeyFound, "Foreign key constraint on 'project_id' is missing or incorrect");
        }
    }

    @Test
    public void testEventsDefaultValues() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            // Вставка данных в таблицы user_login_data и projects, если необходимо
            stmt.executeUpdate("INSERT INTO public.user_login_data (id, password) VALUES (1, 'test_password') ON CONFLICT (id) DO NOTHING;");
            stmt.executeUpdate("INSERT INTO projects (id, name, description, location, author_id, created_at, updated_at) VALUES (1, 'test_name', '{}'::jsonb, 'test_location', 1, NOW(), NOW()) ON CONFLICT (id) DO NOTHING;");



            ResultSet rs = stmt.executeQuery(
                    "INSERT INTO public.events (name, description, location, start_time, end_time, author_id, project_id) " +
                            "VALUES ('Test Event', 'This is a test event.', 'Test Location', '2023-01-01 10:00:00', '2023-01-01 12:00:00', 1, 1) " +
                            "RETURNING views;"
            );

            rs.next();
            assertEquals(0, rs.getInt("views"), "Default value for views is incorrect");
        }
    }

    @Test
    public void testEventsDataOperations() throws SQLException {
        int eventId;

        // Вставка данных
        try (Statement stmt = connection.createStatement()) {
            // Вставка данных в таблицы user_login_data и projects, если необходимо
            stmt.executeUpdate("INSERT INTO public.user_login_data (id, password) VALUES (1, 'test_password') ON CONFLICT (id) DO NOTHING;");
            stmt.executeUpdate("INSERT INTO projects (id, name, description, location, author_id, created_at, updated_at) VALUES (1, 'test_name', '{}'::jsonb, 'test_location', 1, NOW(), NOW()) ON CONFLICT (id) DO NOTHING;");



            ResultSet rs = stmt.executeQuery(
                    "INSERT INTO public.events (name, description, location, start_time, end_time, author_id, project_id) " +
                            "VALUES ('Test Event', 'This is a test event for insert.', 'Test Location', '2023-01-01 10:00:00', '2023-01-01 12:00:00', 1, 1) " +
                            "RETURNING id;"
            );

            rs.next();
            eventId = rs.getInt("id");
            assertTrue(eventId > 0, "Failed to insert data into events");
        }

        // Обновление данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "UPDATE public.events SET name = 'Updated Test Event' WHERE id = ? RETURNING name;"
        )) {
            pstmt.setInt(1, eventId);
            ResultSet rs = pstmt.executeQuery();

            rs.next();
            String updatedName = rs.getString("name");
            assertEquals("Updated Test Event", updatedName, "Failed to update data in events");
        }

        // Удаление данных и каскадное удаление
        try (Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("DELETE FROM public.user_login_data WHERE id = 1;");
            ResultSet rs = stmt.executeQuery(
                    "SELECT COUNT(*) FROM public.events WHERE author_id = 1;"
            );

            rs.next();
            int count = rs.getInt(1);
            assertEquals(0, count, "Failed to cascade delete data from events");
        }
    }
}
