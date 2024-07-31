package org.example.db;

import org.junit.jupiter.api.*;

import java.sql.*;

import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class OrganizationsTableTest {

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
    public void testOrganizationsTableExists() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT EXISTS (" +
                            "   SELECT FROM information_schema.tables " +
                            "   WHERE table_schema = 'public' AND table_name = 'organizations'" +
                            ");"
            );
            rs.next();
            boolean tableExists = rs.getBoolean(1);
            assertTrue(tableExists, "Table 'organizations' does not exist");
        }
    }

    @Test
    public void testOrganizationsColumns() throws SQLException {
        String[][] expectedColumns = {
                {"id", "integer"},
                {"created_at", "timestamp without time zone"},
                {"updated_at", "timestamp without time zone"},
                {"name", "text"}
        };

        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT column_name, data_type " +
                            "FROM information_schema.columns " +
                            "WHERE table_schema = 'public' AND table_name = 'organizations';"
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
    public void testOrganizationsConstraints() throws SQLException {
        // Проверка первичного ключа
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(
                    "SELECT conname " +
                            "FROM pg_constraint " +
                            "WHERE conrelid = 'public.organizations'::regclass AND contype = 'p';"
            );
            rs.next();
            String primaryKey = rs.getString("conname");
            assertEquals("organizations_pkey", primaryKey, "Primary key constraint is missing or incorrect");
        }
    }

    @Test
    public void testOrganizationsDataOperations() throws SQLException {
        String orgName = "Test Organization";

        // Вставка данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "INSERT INTO public.organizations (created_at, updated_at, name) " +
                        "VALUES (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?);"
        )) {
            pstmt.setString(1, orgName);
            int rowsInserted = pstmt.executeUpdate();
            assertEquals(1, rowsInserted, "Failed to insert data into organizations");
        }

        // Обновление данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "UPDATE public.organizations SET name = ? WHERE name = ?;"
        )) {
            pstmt.setString(1, "Updated Organization");
            pstmt.setString(2, orgName);
            int rowsUpdated = pstmt.executeUpdate();
            assertEquals(1, rowsUpdated, "Failed to update data in organizations");
        }

        // Проверка обновления данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "SELECT name FROM public.organizations WHERE name = ?;"
        )) {
            pstmt.setString(1, "Updated Organization");
            ResultSet rs = pstmt.executeQuery();
            rs.next();
            String updatedName = rs.getString("name");
            assertEquals("Updated Organization", updatedName, "Data update verification failed");
        }

        // Удаление данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "DELETE FROM public.organizations WHERE name = ?;"
        )) {
            pstmt.setString(1, "Updated Organization");
            int rowsDeleted = pstmt.executeUpdate();
            assertEquals(1, rowsDeleted, "Failed to delete data from organizations");
        }

        // Проверка удаления данных
        try (PreparedStatement pstmt = connection.prepareStatement(
                "SELECT COUNT(*) FROM public.organizations WHERE name = ?;"
        )) {
            pstmt.setString(1, "Updated Organization");
            ResultSet rs = pstmt.executeQuery();
            rs.next();
            int count = rs.getInt(1);
            assertEquals(0, count, "Data deletion verification failed");
        }
    }
}
