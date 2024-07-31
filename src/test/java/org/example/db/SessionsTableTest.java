package org.example.db;

import org.junit.jupiter.api.*;

import java.sql.*;

import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class SessionsTableTest {

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
    public void insertUser() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("INSERT INTO public.user_login_data (id, password) VALUES (1, 'test_password') ON CONFLICT (id) DO NOTHING;");
        }
    }

    @AfterEach
    public void deleteUser() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("DELETE FROM public.user_login_data WHERE id = 1;");
        }
    }

    @Test
    public void testSessionsTableExists() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT EXISTS (" +
                            "   SELECT FROM information_schema.tables " +
                            "   WHERE table_schema = 'public' AND table_name = 'sessions'" +
                            ");"
            );
            rs.next();
            boolean tableExists = rs.getBoolean(1);
            assertTrue(tableExists, "Table 'sessions' does not exist");
        }
    }

    @Test
    public void testSessionsColumns() throws SQLException {
        String[][] expectedColumns = {
                {"id", "character varying"},
                {"user_id", "bigint"},
                {"ip_address", "character varying"},
                {"user_agent", "text"},
                {"payload", "text"},
                {"last_activity", "integer"}
        };

        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT column_name, data_type " +
                            "FROM information_schema.columns " +
                            "WHERE table_schema = 'public' AND table_name = 'sessions';"
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
    public void testSessionsConstraints() throws SQLException {
        // Проверка первичного ключа
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.sessions'::regclass AND contype = 'p';"
            );
            rs.next();
            String primaryKey = rs.getString("conname");
            assertEquals("sessions_pkey", primaryKey, "Primary key constraint is missing or incorrect");
        }

        // Проверка внешнего ключа 'user_id'
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.sessions'::regclass AND contype = 'f';"
            );

            boolean foreignKeyFound = false;
            while (rs.next()) {
                String foreignKey = rs.getString("conname");

                if (foreignKey.equals("sessions_user_id_foreign")) {
                    foreignKeyFound = true;
                    break;
                }
            }

            assertTrue(foreignKeyFound, "Foreign key constraint is missing or incorrect");
        }
    }

    @Test
    public void testSessionsIndexes() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT indexname " +
                            "FROM pg_indexes " +
                            "WHERE tablename = 'sessions';"
            );

            boolean lastActivityIndexFound = false;
            boolean userIdIndexFound = false;

            while (rs.next()) {
                String indexName = rs.getString("indexname");
                if (indexName.equals("sessions_last_activity_index")) {
                    lastActivityIndexFound = true;
                }
                if (indexName.equals("sessions_user_id_index")) {
                    userIdIndexFound = true;
                }
            }

            assertTrue(lastActivityIndexFound, "Index on 'last_activity' is missing or incorrect");
            assertTrue(userIdIndexFound, "Index on 'user_id' is missing or incorrect");
        }
    }

    @Test
    public void testSessionsDataOperations() throws SQLException {
        String sessionId = "session_1";

        // Вставка данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "INSERT INTO public.sessions (id, user_id, ip_address, user_agent, payload, last_activity) " +
                        "VALUES (?, ?, ?, ?, ?, ?);"
        )) {
            pstmt.setString(1, sessionId);
            pstmt.setLong(2, 1L);
            pstmt.setString(3, "192.168.0.1");
            pstmt.setString(4, "Mozilla/5.0");
            pstmt.setString(5, "payload_data");
            pstmt.setInt(6, 123456789);
            int rowsInserted = pstmt.executeUpdate();
            assertEquals(1, rowsInserted, "Failed to insert data into sessions");
        }

        // Обновление данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "UPDATE public.sessions SET ip_address = ? WHERE id = ?;"
        )) {
            pstmt.setString(1, "192.168.0.2");
            pstmt.setString(2, sessionId);
            int rowsUpdated = pstmt.executeUpdate();
            assertEquals(1, rowsUpdated, "Failed to update data in sessions");
        }

        // Проверка обновления данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "SELECT ip_address FROM public.sessions WHERE id = ?;"
        )) {
            pstmt.setString(1, sessionId);
            ResultSet rs = pstmt.executeQuery();
            rs.next();
            String updatedIpAddress = rs.getString("ip_address");
            assertEquals("192.168.0.2", updatedIpAddress, "Data update verification failed");
        }

        // Удаление данных и каскадное удаление
        try (Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("DELETE FROM public.user_login_data WHERE id = 1;");
            ResultSet rs = stmt.executeQuery(
                    "SELECT COUNT(*) FROM public.sessions WHERE user_id = 1;"
            );

            rs.next();
            int count = rs.getInt(1);
            assertEquals(0, count, "Failed to cascade delete data from sessions");
        }
    }
}
