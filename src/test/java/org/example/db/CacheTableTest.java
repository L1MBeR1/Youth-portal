package org.example.db;

import org.junit.jupiter.api.*;

import java.sql.*;

import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class CacheTableTest {

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
    public void testCacheTableExists() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT EXISTS (" +
                            "   SELECT FROM information_schema.tables " +
                            "   WHERE table_schema = 'public' AND table_name = 'cache'" +
                            ");"
            );
            rs.next();
            boolean tableExists = rs.getBoolean(1);
            assertTrue(tableExists, "Table 'cache' does not exist");
        }
    }

    @Test
    public void testCacheColumns() throws SQLException {
        String[][] expectedColumns = {
                {"key", "character varying"},
                {"value", "text"},
                {"expiration", "integer"}
        };

        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT column_name, data_type " +
                            "FROM information_schema.columns " +
                            "WHERE table_schema = 'public' AND table_name = 'cache';"
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
    public void testCacheConstraints() throws SQLException {
        // Проверка первичного ключа
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.cache'::regclass AND contype = 'p';"
            );
            rs.next();
            String primaryKey = rs.getString("conname");
            assertEquals("cache_pkey", primaryKey, "Primary key constraint is missing or incorrect");
        }
    }

    @Test
    public void testCacheDataOperations() throws SQLException {
        String cacheKey = "test_key";
        String cacheValue = "test_value";
        int expiration = 123456;

        // Вставка данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "INSERT INTO public.cache (key, value, expiration) VALUES (?, ?, ?);"
        )) {
            pstmt.setString(1, cacheKey);
            pstmt.setString(2, cacheValue);
            pstmt.setInt(3, expiration);
            int rowsInserted = pstmt.executeUpdate();
            assertEquals(1, rowsInserted, "Failed to insert data into cache");
        }

        // Проверка вставки данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "SELECT * FROM public.cache WHERE key = ?;"
        )) {
            pstmt.setString(1, cacheKey);
            ResultSet rs = pstmt.executeQuery();
            assertTrue(rs.next(), "Data insertion verification failed");
        }

        // Обновление данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "UPDATE public.cache SET value = ? WHERE key = ?;"
        )) {
            String updatedValue = "updated_value";
            pstmt.setString(1, updatedValue);
            pstmt.setString(2, cacheKey);
            int rowsUpdated = pstmt.executeUpdate();
            assertEquals(1, rowsUpdated, "Failed to update data in cache");
        }

        // Проверка обновления данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "SELECT value FROM public.cache WHERE key = ?;"
        )) {
            pstmt.setString(1, cacheKey);
            ResultSet rs = pstmt.executeQuery();
            rs.next();
            String updatedValue = rs.getString("value");
            assertEquals("updated_value", updatedValue, "Data update verification failed");
        }

        // Удаление данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "DELETE FROM public.cache WHERE key = ?;"
        )) {
            pstmt.setString(1, cacheKey);
            int rowsDeleted = pstmt.executeUpdate();
            assertEquals(1, rowsDeleted, "Failed to delete data from cache");
        }

        // Проверка удаления данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "SELECT COUNT(*) FROM public.cache WHERE key = ?;"
        )) {
            pstmt.setString(1, cacheKey);
            ResultSet rs = pstmt.executeQuery();
            rs.next();
            int count = rs.getInt(1);
            assertEquals(0, count, "Data deletion verification failed");
        }
    }
}
