package com.feastora.dao;

import com.feastora.config.DatabaseConfig;
import com.feastora.model.Order;
import com.feastora.model.OrderItem;
import com.feastora.model.OrderStatusHistory;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class OrderDAO {

    private static final Logger LOGGER = Logger.getLogger(OrderDAO.class.getName());

    public Order createOrderInTransaction(Order order, Connection conn) throws SQLException {
        String sql = "INSERT INTO orders (order_number, user_id, restaurant_id, delivery_address_id, recipient_name, recipient_phone, delivery_address_text, total_item_amount, delivery_fee, tax_amount, discount_amount, coupon_code, grand_total, payment_method, payment_status, order_status, special_instructions, estimated_delivery_time) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 35 MINUTE))";

        try (PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, order.getOrderNumber());
            ps.setLong(2, order.getUserId());
            ps.setLong(3, order.getRestaurantId());
            ps.setObject(4, null); // optional address ID
            ps.setString(5, order.getCustomerName());
            ps.setString(6, order.getCustomerPhone());
            ps.setString(7, order.getDeliveryAddressText());
            ps.setBigDecimal(8, order.getTotalItemAmount());
            ps.setBigDecimal(9, order.getDeliveryFee());
            ps.setBigDecimal(10, order.getTaxAmount());
            ps.setBigDecimal(11, order.getDiscountAmount());
            ps.setString(12, order.getCouponCode());
            ps.setBigDecimal(13, order.getGrandTotal());
            ps.setString(14, order.getPaymentMethod());
            ps.setString(15, order.getPaymentStatus() != null ? order.getPaymentStatus() : "PENDING");
            ps.setString(16, "ORDER_PLACED");
            ps.setString(17, order.getSpecialInstructions());

            ps.executeUpdate();
            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    order.setId(rs.getLong(1));
                }
            }
        }

        // Insert Order Items
        String itemSql = "INSERT INTO order_items (order_id, food_item_id, item_name, quantity, unit_price, subtotal, customizations_json) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(itemSql)) {
            for (OrderItem item : order.getItems()) {
                ps.setLong(1, order.getId());
                ps.setLong(2, item.getFoodItemId());
                ps.setString(3, item.getItemName());
                ps.setInt(4, item.getQuantity());
                ps.setBigDecimal(5, item.getUnitPrice());
                ps.setBigDecimal(6, item.getSubtotal());
                ps.setString(7, item.getCustomizationsJson() != null ? item.getCustomizationsJson() : "[]");
                ps.addBatch();
            }
            ps.executeBatch();
        }

        // Add Initial Timeline Entry
        addStatusHistory(order.getId(), "ORDER_PLACED", "Order received and confirmed by Feastora system", order.getUserId(), conn);

        return order;
    }

    public Order getById(Long id) {
        String sql = "SELECT o.*, u.full_name as user_name, u.email as user_email, u.phone as user_phone, " +
                "r.name as restaurant_name, dp.name as partner_name, dp.phone as partner_phone " +
                "FROM orders o " +
                "JOIN users u ON o.user_id = u.id " +
                "JOIN restaurants r ON o.restaurant_id = r.id " +
                "LEFT JOIN delivery_partners dp ON o.delivery_partner_id = dp.id " +
                "WHERE o.id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Order order = mapOrder(rs);
                    order.setItems(getOrderItems(order.getId(), conn));
                    order.setTimeline(getOrderTimeline(order.getId(), conn));
                    return order;
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error fetching order by id: " + id, e);
        }
        return null;
    }

    public Order getByOrderNumber(String orderNumber) {
        String sql = "SELECT o.*, u.full_name as user_name, u.email as user_email, u.phone as user_phone, " +
                "r.name as restaurant_name, dp.name as partner_name, dp.phone as partner_phone " +
                "FROM orders o " +
                "JOIN users u ON o.user_id = u.id " +
                "JOIN restaurants r ON o.restaurant_id = r.id " +
                "LEFT JOIN delivery_partners dp ON o.delivery_partner_id = dp.id " +
                "WHERE o.order_number = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, orderNumber.trim());
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Order order = mapOrder(rs);
                    order.setItems(getOrderItems(order.getId(), conn));
                    order.setTimeline(getOrderTimeline(order.getId(), conn));
                    return order;
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error fetching order by orderNumber: " + orderNumber, e);
        }
        return null;
    }

    public List<Order> getOrdersByUser(Long userId) {
        List<Order> list = new ArrayList<>();
        String sql = "SELECT o.*, u.full_name as user_name, u.email as user_email, u.phone as user_phone, " +
                "r.name as restaurant_name, dp.name as partner_name, dp.phone as partner_phone " +
                "FROM orders o " +
                "JOIN users u ON o.user_id = u.id " +
                "JOIN restaurants r ON o.restaurant_id = r.id " +
                "LEFT JOIN delivery_partners dp ON o.delivery_partner_id = dp.id " +
                "WHERE o.user_id = ? ORDER BY o.created_at DESC";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Order o = mapOrder(rs);
                    o.setItems(getOrderItems(o.getId(), conn));
                    list.add(o);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error fetching orders for user: " + userId, e);
        }
        return list;
    }

    public List<Order> getAllOrdersAdmin(String status) {
        List<Order> list = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT o.*, u.full_name as user_name, u.email as user_email, u.phone as user_phone, " +
                "r.name as restaurant_name, dp.name as partner_name, dp.phone as partner_phone " +
                "FROM orders o " +
                "JOIN users u ON o.user_id = u.id " +
                "JOIN restaurants r ON o.restaurant_id = r.id " +
                "LEFT JOIN delivery_partners dp ON o.delivery_partner_id = dp.id ");
        List<Object> params = new ArrayList<>();

        if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL")) {
            sql.append("WHERE o.order_status = ? ");
            params.add(status.trim());
        }

        sql.append("ORDER BY o.created_at DESC");

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {
            for (int i = 0; i < params.size(); i++) {
                ps.setObject(i + 1, params.get(i));
            }
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Order o = mapOrder(rs);
                    o.setItems(getOrderItems(o.getId(), conn));
                    o.setTimeline(getOrderTimeline(o.getId(), conn));
                    list.add(o);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error fetching all orders for admin", e);
        }
        return list;
    }

    public boolean updateOrderStatus(Long orderId, String newStatus, String comment, Long adminUserId) {
        String updateSql = "UPDATE orders SET order_status = ?, updated_at = NOW() ";
        if ("DELIVERED".equalsIgnoreCase(newStatus)) {
            updateSql += ", delivered_at = NOW() ";
        } else if ("CANCELLED".equalsIgnoreCase(newStatus)) {
            updateSql += ", cancelled_at = NOW() ";
        }
        updateSql += "WHERE id = ?";

        try (Connection conn = DatabaseConfig.getConnection()) {
            conn.setAutoCommit(false);
            try (PreparedStatement ps = conn.prepareStatement(updateSql)) {
                ps.setString(1, newStatus);
                ps.setLong(2, orderId);
                int affected = ps.executeUpdate();
                if (affected > 0) {
                    addStatusHistory(orderId, newStatus, comment, adminUserId, conn);
                    conn.commit();
                    return true;
                }
            } catch (SQLException ex) {
                conn.rollback();
                throw ex;
            } finally {
                conn.setAutoCommit(true);
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error updating status for order: " + orderId, e);
        }
        return false;
    }

    public boolean assignDeliveryPartner(Long orderId, Long partnerId) {
        String sql = "UPDATE orders SET delivery_partner_id = ?, order_status = 'DELIVERY_PARTNER_ASSIGNED' WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, partnerId);
            ps.setLong(2, orderId);
            int affected = ps.executeUpdate();
            if (affected > 0) {
                addStatusHistory(orderId, "DELIVERY_PARTNER_ASSIGNED", "Delivery partner assigned and on the way to restaurant", null, conn);
                return true;
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error assigning delivery partner to order: " + orderId, e);
        }
        return false;
    }

    private void addStatusHistory(Long orderId, String status, String comment, Long userId, Connection conn) throws SQLException {
        String sql = "INSERT INTO order_status_history (order_id, status, comment, updated_by_user_id) VALUES (?, ?, ?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, orderId);
            ps.setString(2, status);
            ps.setString(3, comment != null ? comment : "Status updated to " + status);
            ps.setObject(4, userId);
            ps.executeUpdate();
        }
    }

    private List<OrderItem> getOrderItems(Long orderId, Connection conn) {
        List<OrderItem> items = new ArrayList<>();
        String sql = "SELECT * FROM order_items WHERE order_id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, orderId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    OrderItem item = new OrderItem();
                    item.setId(rs.getLong("id"));
                    item.setOrderId(rs.getLong("order_id"));
                    item.setFoodItemId(rs.getLong("food_item_id"));
                    item.setItemName(rs.getString("item_name"));
                    item.setQuantity(rs.getInt("quantity"));
                    item.setUnitPrice(rs.getBigDecimal("unit_price"));
                    item.setSubtotal(rs.getBigDecimal("subtotal"));
                    item.setCustomizationsJson(rs.getString("customizations_json"));
                    items.add(item);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.WARNING, "Error loading order items for order: " + orderId, e);
        }
        return items;
    }

    private List<OrderStatusHistory> getOrderTimeline(Long orderId, Connection conn) {
        List<OrderStatusHistory> timeline = new ArrayList<>();
        String sql = "SELECT * FROM order_status_history WHERE order_id = ? ORDER BY created_at ASC";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, orderId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    OrderStatusHistory h = new OrderStatusHistory();
                    h.setId(rs.getLong("id"));
                    h.setOrderId(rs.getLong("order_id"));
                    h.setStatus(rs.getString("status"));
                    h.setComment(rs.getString("comment"));
                    h.setUpdatedByUserId((Long) rs.getObject("updated_by_user_id"));
                    h.setCreatedAt(rs.getTimestamp("created_at"));
                    timeline.add(h);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.WARNING, "Error loading timeline for order: " + orderId, e);
        }
        return timeline;
    }

    private Order mapOrder(ResultSet rs) throws SQLException {
        Order o = new Order();
        o.setId(rs.getLong("id"));
        o.setOrderNumber(rs.getString("order_number"));
        o.setUserId(rs.getLong("user_id"));
        o.setCustomerName(rs.getString("recipient_name"));
        o.setCustomerPhone(rs.getString("recipient_phone"));
        o.setCustomerEmail(rs.getString("user_email"));
        o.setRestaurantId(rs.getLong("restaurant_id"));
        o.setRestaurantName(rs.getString("restaurant_name"));
        o.setDeliveryAddressText(rs.getString("delivery_address_text"));
        o.setDeliveryPartnerId((Long) rs.getObject("delivery_partner_id"));
        o.setDeliveryPartnerName(rs.getString("partner_name"));
        o.setDeliveryPartnerPhone(rs.getString("partner_phone"));
        o.setTotalItemAmount(rs.getBigDecimal("total_item_amount"));
        o.setDeliveryFee(rs.getBigDecimal("delivery_fee"));
        o.setTaxAmount(rs.getBigDecimal("tax_amount"));
        o.setDiscountAmount(rs.getBigDecimal("discount_amount"));
        o.setCouponCode(rs.getString("coupon_code"));
        o.setGrandTotal(rs.getBigDecimal("grand_total"));
        o.setPaymentMethod(rs.getString("payment_method"));
        o.setPaymentStatus(rs.getString("payment_status"));
        o.setOrderStatus(rs.getString("order_status"));
        o.setSpecialInstructions(rs.getString("special_instructions"));
        o.setEstimatedDeliveryTime(rs.getTimestamp("estimated_delivery_time"));
        o.setDeliveredAt(rs.getTimestamp("delivered_at"));
        o.setCancelledAt(rs.getTimestamp("cancelled_at"));
        o.setCancellationReason(rs.getString("cancellation_reason"));
        o.setCreatedAt(rs.getTimestamp("created_at"));
        return o;
    }
}
