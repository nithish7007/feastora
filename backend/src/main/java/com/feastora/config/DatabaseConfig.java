package com.feastora.config;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Manages JDBC Database Connectivity for FEASTORA.
 * Connects to MySQL 8+ with support for environment overrides and fallback diagnostics.
 */
public class DatabaseConfig {

    private static final Logger LOGGER = Logger.getLogger(DatabaseConfig.class.getName());
    private static Properties properties = new Properties();
    private static boolean driverLoaded = false;

    static {
        loadConfiguration();
    }

    private static void loadConfiguration() {
        try (InputStream input = DatabaseConfig.class.getClassLoader().getResourceAsStream("database.properties")) {
            if (input != null) {
                properties.load(input);
            }
        } catch (Exception e) {
            LOGGER.log(Level.WARNING, "Failed to load database.properties from classpath, using defaults", e);
        }

        try {
            String driverClass = getProperty("db.driver", "com.mysql.cj.jdbc.Driver");
            Class.forName(driverClass);
            driverLoaded = true;
            LOGGER.info("MySQL JDBC Driver registered successfully: " + driverClass);
        } catch (ClassNotFoundException e) {
            LOGGER.log(Level.SEVERE, "MySQL JDBC Driver not found on classpath!", e);
        }
    }

    private static String getProperty(String key, String defaultValue) {
        String sysEnv = System.getenv(key.replace('.', '_').toUpperCase());
        if (sysEnv != null && !sysEnv.isEmpty()) {
            return sysEnv;
        }
        return properties.getProperty(key, defaultValue);
    }

    public static String getJdbcUrl() {
        String envUrl = System.getenv("FEASTORA_DB_URL");
        if (envUrl != null && !envUrl.isEmpty()) {
            return envUrl;
        }
        return getProperty("db.url", "jdbc:mysql://localhost:3306/feastora_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8");
    }

    public static String getUsername() {
        String envUser = System.getenv("FEASTORA_DB_USER");
        if (envUser != null && !envUser.isEmpty()) {
            return envUser;
        }
        return getProperty("db.username", "root");
    }

    public static String getPassword() {
        String envPass = System.getenv("FEASTORA_DB_PASS");
        if (envPass != null) {
            return envPass;
        }
        return getProperty("db.password", "root");
    }

    /**
     * Obtains a standard JDBC Connection from MySQL.
     * @return Connection
     * @throws SQLException
     */
    public static Connection getConnection() throws SQLException {
        if (!driverLoaded) {
            try {
                Class.forName("com.mysql.cj.jdbc.Driver");
                driverLoaded = true;
            } catch (Exception ignored) {}
        }
        return DriverManager.getConnection(getJdbcUrl(), getUsername(), getPassword());
    }

    /**
     * Tests if MySQL is reachable and feastora_db exists.
     */
    public static boolean testConnection() {
        try (Connection conn = getConnection()) {
            return conn != null && !conn.isClosed();
        } catch (SQLException e) {
            LOGGER.log(Level.WARNING, "Database connection check failed: " + e.getMessage());
            return false;
        }
    }
}
