package com.feastora.dao;

import com.feastora.config.DatabaseConfig;
import com.feastora.model.User;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

public class UserDAO {

    private static final Logger LOGGER = Logger.getLogger(UserDAO.class.getName());

    public User findByEmail(String email) {
        String sql = "SELECT u.*, r.role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE LOWER(u.email) = LOWER(?)";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, email.trim());
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapUser(rs);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error in findByEmail: " + email, e);
        }
        return null;
    }

    public User findById(Long id) {
        String sql = "SELECT u.*, r.role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapUser(rs);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error in findById: " + id, e);
        }
        return null;
    }

    public User create(User user) throws SQLException {
        String sql = "INSERT INTO users (role_id, full_name, email, phone, password_hash, avatar_url, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setInt(1, user.getRoleId() != null ? user.getRoleId() : 1); // 1 = CUSTOMER
            ps.setString(2, user.getFullName());
            ps.setString(3, user.getEmail().toLowerCase().trim());
            ps.setString(4, user.getPhone());
            ps.setString(5, user.getPasswordHash());
            ps.setString(6, user.getAvatarUrl());
            ps.setBoolean(7, user.getIsActive() != null ? user.getIsActive() : true);

            int affected = ps.executeUpdate();
            if (affected > 0) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        user.setId(rs.getLong(1));
                    }
                }
            }
        }
        return user;
    }

    public boolean updatePassword(Long userId, String newHash) {
        String sql = "UPDATE users SET password_hash = ?, failed_login_attempts = 0, lockout_until = NULL WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, newHash);
            ps.setLong(2, userId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error updating password for user: " + userId, e);
            return false;
        }
    }

    public void recordFailedLogin(String email) {
        String sql = "UPDATE users SET failed_login_attempts = failed_login_attempts + 1, " +
                "lockout_until = CASE WHEN failed_login_attempts >= 4 THEN DATE_ADD(NOW(), INTERVAL 15 MINUTE) ELSE NULL END " +
                "WHERE LOWER(email) = LOWER(?)";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, email.trim());
            ps.executeUpdate();
        } catch (SQLException e) {
            LOGGER.log(Level.WARNING, "Error recording failed login for: " + email, e);
        }
    }

    public void resetFailedLogins(Long userId) {
        String sql = "UPDATE users SET failed_login_attempts = 0, lockout_until = NULL WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, userId);
            ps.executeUpdate();
        } catch (SQLException e) {
            LOGGER.log(Level.WARNING, "Error resetting failed logins for: " + userId, e);
        }
    }

    public void logAdminLogin(Long userId, String ipAddress, String userAgent, String status) {
        String sql = "INSERT INTO admin_login_logs (user_id, ip_address, user_agent, status) VALUES (?, ?, ?, ?)";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, userId);
            ps.setString(2, ipAddress != null ? ipAddress : "127.0.0.1");
            ps.setString(3, userAgent);
            ps.setString(4, status);
            ps.executeUpdate();
        } catch (SQLException e) {
            LOGGER.log(Level.WARNING, "Error logging admin login", e);
        }
    }

    public List<Map<String, Object>> getAllCustomers() {
        List<Map<String, Object>> list = new ArrayList<>();
        String sql = "SELECT u.id, u.full_name, u.email, u.phone, u.avatar_url, u.is_active, u.created_at, " +
                "COUNT(o.id) as order_count, COALESCE(SUM(o.grand_total), 0) as total_spent " +
                "FROM users u " +
                "LEFT JOIN orders o ON u.id = o.user_id " +
                "WHERE u.role_id = 1 " +
                "GROUP BY u.id " +
                "ORDER BY u.created_at DESC";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", rs.getLong("id"));
                map.put("fullName", rs.getString("full_name"));
                map.put("email", rs.getString("email"));
                map.put("phone", rs.getString("phone"));
                map.put("avatarUrl", rs.getString("avatar_url"));
                map.put("isActive", rs.getBoolean("is_active"));
                map.put("createdAt", rs.getTimestamp("created_at"));
                map.put("orderCount", rs.getInt("order_count"));
                map.put("totalSpent", rs.getBigDecimal("total_spent"));
                list.add(map);
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error fetching all customers", e);
        }
        return list;
    }

    public boolean toggleCustomerStatus(Long userId, boolean isActive) {
        String sql = "UPDATE users SET is_active = ? WHERE id = ? AND role_id = 1";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setBoolean(1, isActive);
            ps.setLong(2, userId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error toggling status for user: " + userId, e);
            return false;
        }
    }

    private User mapUser(ResultSet rs) throws SQLException {
        User u = new User();
        u.setId(rs.getLong("id"));
        u.setRoleId(rs.getInt("role_id"));
        u.setRoleName(rs.getString("role_name"));
        u.setFullName(rs.getString("full_name"));
        u.setEmail(rs.getString("email"));
        u.setPhone(rs.getString("phone"));
        u.setPasswordHash(rs.getString("password_hash"));
        u.setAvatarUrl(rs.getString("avatar_url"));
        u.setIsActive(rs.getBoolean("is_active"));
        u.setFailedLoginAttempts(rs.getInt("failed_login_attempts"));
        u.setLockoutUntil(rs.getTimestamp("lockout_until"));
        u.setCreatedAt(rs.getTimestamp("created_at"));
        return u;
    }
}
