package com.feastora.dao;

import com.feastora.config.DatabaseConfig;
import com.feastora.model.Coupon;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

public class CouponDAO {

    private static final Logger LOGGER = Logger.getLogger(CouponDAO.class.getName());

    public Coupon findByCode(String code) {
        if (code == null || code.trim().isEmpty()) return null;
        String sql = "SELECT * FROM coupons WHERE UPPER(code) = UPPER(?) AND is_active = TRUE AND (valid_until IS NULL OR valid_until > NOW())";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, code.trim());
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Coupon c = new Coupon();
                    c.setId(rs.getInt("id"));
                    c.setCode(rs.getString("code"));
                    c.setDescription(rs.getString("description"));
                    c.setDiscountType(rs.getString("discount_type"));
                    c.setDiscountValue(rs.getBigDecimal("discount_value"));
                    c.setMinOrderValue(rs.getBigDecimal("min_order_value"));
                    c.setMaxDiscountAmount(rs.getBigDecimal("max_discount_amount"));
                    c.setValidFrom(rs.getTimestamp("valid_from"));
                    c.setValidUntil(rs.getTimestamp("valid_until"));
                    c.setIsActive(rs.getBoolean("is_active"));
                    return c;
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error finding coupon by code: " + code, e);
        }
        return null;
    }

    public BigDecimal calculateDiscount(Coupon coupon, BigDecimal cartItemTotal) {
        if (coupon == null || cartItemTotal == null) return BigDecimal.ZERO;
        if (coupon.getMinOrderValue() != null && cartItemTotal.compareTo(coupon.getMinOrderValue()) < 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal discount = BigDecimal.ZERO;
        if ("PERCENTAGE".equalsIgnoreCase(coupon.getDiscountType())) {
            BigDecimal factor = coupon.getDiscountValue().divide(new BigDecimal("100"), 4, java.math.RoundingMode.HALF_UP);
            discount = cartItemTotal.multiply(factor).setScale(2, java.math.RoundingMode.HALF_UP);
            if (coupon.getMaxDiscountAmount() != null && coupon.getMaxDiscountAmount().compareTo(BigDecimal.ZERO) > 0) {
                if (discount.compareTo(coupon.getMaxDiscountAmount()) > 0) {
                    discount = coupon.getMaxDiscountAmount();
                }
            }
        } else { // FLAT
            discount = coupon.getDiscountValue();
        }

        if (discount.compareTo(cartItemTotal) > 0) {
            discount = cartItemTotal;
        }
        return discount;
    }
}
