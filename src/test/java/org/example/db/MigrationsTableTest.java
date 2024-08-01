package org.example.db;

import org.junit.jupiter.api.*;

import java.sql.*;

import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class MigrationsTableTest {

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
    public void testMigrationsTableExists() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT EXISTS (" +
                            "   SELECT FROM information_schema.tables " +
                            "   WHERE table_schema = 'public' AND table_name = 'migrations'" +
                            ");"
            );
            rs.next();
            boolean tableExists = rs.getBoolean(1);
            assertTrue(tableExists, "Table 'migrations' does not exist");
        }
    }

    @Test
    public void testMigrationsColumns() throws SQLException {
        String[][] expectedColumns = {
                {"id", "integer"},
                {"migration", "character varying"},
                {"batch", "integer"}
        };

        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT column_name, data_type " +
                            "FROM information_schema.columns " +
                            "WHERE table_schema = 'public' AND table_name = 'migrations';"
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
    public void testMigrationsConstraints() throws SQLException {
        // Проверка первичного ключа
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.migrations'::regclass AND contype = 'p';"
            );
            rs.next();
            String primaryKey = rs.getString("conname");
            assertEquals("migrations_pkey", primaryKey, "Primary key constraint is missing or incorrect");
        }
    }

    @Test
    public void testMigrationsDataOperations() throws SQLException {
        int id = 9999;
        String migration = "initial_migration";
        int batch = 1;

        // Вставка данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "INSERT INTO public.migrations (id, migration, batch) " +
                        "VALUES (?, ?, ?);"
        )) {
            pstmt.setInt(1, id);
            pstmt.setString(2, migration);
            pstmt.setInt(3, batch);
            int rowsInserted = pstmt.executeUpdate();
            assertEquals(1, rowsInserted, "Failed to insert data into migrations");
        }

        // Проверка вставки данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "SELECT * FROM public.migrations WHERE id = ?;"
        )) {
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();
            assertTrue(rs.next(), "Data insertion verification failed");
        }

        // Удаление данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "DELETE FROM public.migrations WHERE id = ?;"
        )) {
            pstmt.setInt(1, id);
            int rowsDeleted = pstmt.executeUpdate();
            assertEquals(1, rowsDeleted, "Failed to delete data from migrations");
        }

        // Проверка удаления данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "SELECT COUNT(*) FROM public.migrations WHERE id = ?;"
        )) {
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();
            rs.next();
            int count = rs.getInt(1);
            assertEquals(0, count, "Data deletion verification failed");
        }
    }
}
