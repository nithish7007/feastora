package com.feastora.dao;

import com.feastora.config.DatabaseConfig;
import com.feastora.model.Payment;
import com.feastora.model.PaymentSetting;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

public class PaymentDAO {

    private static final Logger LOGGER = Logger.getLogger(PaymentDAO.class.getName());

    public Payment recordPayment(Payment payment, Connection conn) throws SQLException {
        String sql = "INSERT INTO payments (order_id, payment_method, amount, transaction_id, upi_reference, payment_status) VALUES (?, ?, ?, ?, ?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setLong(1, payment.getOrderId());
            ps.setString(2, payment.getPaymentMethod());
            ps.setBigDecimal(3, payment.getAmount());
            ps.setString(4, payment.getTransactionId());
            ps.setString(5, payment.getUpiReference());
            ps.setString(6, payment.getPaymentStatus() != null ? payment.getPaymentStatus() : "PENDING");
            ps.executeUpdate();
            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    payment.setId(rs.getLong(1));
                }
            }
        }
        return payment;
    }

    public List<Payment> getAllPayments() {
        List<Payment> list = new ArrayList<>();
        String sql = "SELECT p.*, o.order_number, u.full_name as admin_name " +
                "FROM payments p " +
                "JOIN orders o ON p.order_id = o.id " +
                "LEFT JOIN users u ON p.verified_by_admin_id = u.id " +
                "ORDER BY p.created_at DESC";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Payment p = new Payment();
                p.setId(rs.getLong("id"));
                p.setOrderId(rs.getLong("order_id"));
                p.setOrderNumber(rs.getString("order_number"));
                p.setPaymentMethod(rs.getString("payment_method"));
                p.setAmount(rs.getBigDecimal("amount"));
                p.setTransactionId(rs.getString("transaction_id"));
                p.setUpiReference(rs.getString("upi_reference"));
                p.setPaymentStatus(rs.getString("payment_status"));
                p.setVerifiedByAdminId((Long) rs.getObject("verified_by_admin_id"));
                p.setVerifiedByAdminName(rs.getString("admin_name"));
                p.setVerifiedAt(rs.getTimestamp("verified_at"));
                p.setRefundStatus(rs.getString("refund_status"));
                p.setRefundAmount(rs.getBigDecimal("refund_amount"));
                p.setCreatedAt(rs.getTimestamp("created_at"));
                list.add(p);
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error getting all payments", e);
        }
        return list;
    }

    public boolean submitUpiReference(Long orderId, String upiRef, String txnId) {
        String sql = "UPDATE payments SET upi_reference = ?, transaction_id = ?, payment_status = 'PENDING' WHERE order_id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, upiRef);
            ps.setString(2, txnId);
            ps.setLong(3, orderId);
            int affected = ps.executeUpdate();
            if (affected == 0) {
                // If payment row wasn't present, insert it
                String ins = "INSERT INTO payments (order_id, payment_method, amount, transaction_id, upi_reference, payment_status) " +
                        "SELECT id, 'UPI', grand_total, ?, ?, 'PENDING' FROM orders WHERE id = ?";
                try (PreparedStatement insPs = conn.prepareStatement(ins)) {
                    insPs.setString(1, txnId);
                    insPs.setString(2, upiRef);
                    insPs.setLong(3, orderId);
                    return insPs.executeUpdate() > 0;
                }
            }
            return true;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error submitting UPI reference for order: " + orderId, e);
            return false;
        }
    }

    public boolean verifyUpiPayment(Long paymentId, Long adminId, boolean approve) {
        String newStatus = approve ? "VERIFIED_BY_ADMIN" : "FAILED";
        String paySql = "UPDATE payments SET payment_status = ?, verified_by_admin_id = ?, verified_at = NOW() WHERE id = ?";
        String orderSql = "UPDATE orders SET payment_status = ? WHERE id = (SELECT order_id FROM payments WHERE id = ?)";

        try (Connection conn = DatabaseConfig.getConnection()) {
            conn.setAutoCommit(false);
            try (PreparedStatement ps1 = conn.prepareStatement(paySql);
                 PreparedStatement ps2 = conn.prepareStatement(orderSql)) {
                ps1.setString(1, newStatus);
                ps1.setLong(2, adminId);
                ps1.setLong(3, paymentId);
                ps1.executeUpdate();

                ps2.setString(1, newStatus);
                ps2.setLong(2, paymentId);
                ps2.executeUpdate();

                conn.commit();
                return true;
            } catch (SQLException ex) {
                conn.rollback();
                throw ex;
            } finally {
                conn.setAutoCommit(true);
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error verifying payment: " + paymentId, e);
            return false;
        }
    }

    public Map<String, String> getPaymentSettings() {
        Map<String, String> settings = new HashMap<>();
        String sql = "SELECT setting_key, setting_value FROM payment_settings WHERE is_active = TRUE";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                settings.put(rs.getString("setting_key"), rs.getString("setting_value"));
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error loading payment settings", e);
        }
        return settings;
    }

    public boolean updateSetting(String key, String value) {
        String sql = "INSERT INTO payment_settings (setting_key, setting_value, is_active) VALUES (?, ?, TRUE) " +
                "ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = NOW()";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, key);
            ps.setString(2, value);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error updating payment setting: " + key, e);
            return false;
        }
    }
}
