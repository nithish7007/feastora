package com.feastora.service;

import com.feastora.config.DatabaseConfig;
import com.feastora.dao.CartDAO;
import com.feastora.dao.CouponDAO;
import com.feastora.dao.InventoryDAO;
import com.feastora.dao.OrderDAO;
import com.feastora.dao.PaymentDAO;
import com.feastora.model.*;
import com.feastora.util.SecurityUtil;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

public class OrderService {

    private static final Logger LOGGER = Logger.getLogger(OrderService.class.getName());
    private final OrderDAO orderDAO = new OrderDAO();
    private final CartDAO cartDAO = new CartDAO();
    private final CouponDAO couponDAO = new CouponDAO();
    private final InventoryDAO inventoryDAO = new InventoryDAO();
    private final PaymentDAO paymentDAO = new PaymentDAO();
    private final EmailService emailService = EmailService.getInstance();

    public Order checkout(Long userId, String sessionId, String customerName, String customerPhone,
                          String deliveryAddress, String paymentMethod, String couponCode,
                          String specialInstructions, String upiReference) throws SQLException {

        Cart cart = cartDAO.getOrCreateCart(sessionId, userId);
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cart is empty. Please add items before checking out.");
        }

        BigDecimal discount = BigDecimal.ZERO;
        if (couponCode != null && !couponCode.trim().isEmpty()) {
            Coupon coupon = couponDAO.findByCode(couponCode);
            if (coupon != null) {
                discount = couponDAO.calculateDiscount(coupon, cart.getItemTotal());
            }
        }

        Order order = new Order();
        order.setOrderNumber(SecurityUtil.generateOrderNumber());
        order.setUserId(userId != null ? userId : 2L); // default to guest/customer
        order.setRestaurantId(cart.getRestaurantId() != null ? cart.getRestaurantId() : 1L);
        order.setRestaurantName(cart.getRestaurantName());
        order.setCustomerName(customerName);
        order.setCustomerPhone(customerPhone);
        order.setDeliveryAddressText(deliveryAddress);
        order.setTotalItemAmount(cart.getItemTotal());
        order.setDeliveryFee(cart.getDeliveryFee() != null ? cart.getDeliveryFee() : new BigDecimal("35.00"));
        order.setTaxAmount(cart.getTaxAmount());
        order.setDiscountAmount(discount);
        order.setCouponCode(couponCode);
        order.setSpecialInstructions(specialInstructions);

        BigDecimal finalTotal = cart.getItemTotal().add(order.getDeliveryFee()).add(order.getTaxAmount()).subtract(discount);
        if (finalTotal.compareTo(BigDecimal.ZERO) < 0) finalTotal = BigDecimal.ZERO;
        order.setGrandTotal(finalTotal);

        order.setPaymentMethod(paymentMethod != null ? paymentMethod : "COD");
        order.setPaymentStatus("COD".equalsIgnoreCase(paymentMethod) ? "PENDING" : ("UPI".equalsIgnoreCase(paymentMethod) ? "PENDING" : "SUCCESS"));

        for (CartItem ci : cart.getItems()) {
            OrderItem oi = new OrderItem();
            oi.setFoodItemId(ci.getFoodItemId());
            oi.setItemName(ci.getFoodName());
            oi.setQuantity(ci.getQuantity());
            oi.setUnitPrice(ci.getUnitPrice());
            oi.setSubtotal(ci.getUnitPrice().multiply(BigDecimal.valueOf(ci.getQuantity())));
            oi.setCustomizationsJson(ci.getCustomizationsJson());
            order.getItems().add(oi);
        }

        // Execute in JDBC Transaction
        Connection conn = null;
        try {
            conn = DatabaseConfig.getConnection();
            conn.setAutoCommit(false);

            // 1. Create order and order items
            orderDAO.createOrderInTransaction(order, conn);

            // 2. Deduct inventory stock atomically
            for (OrderItem item : order.getItems()) {
                inventoryDAO.deductStockInTransaction(item.getFoodItemId(), item.getQuantity(), conn);
            }

            // 3. Record payment row
            Payment payment = new Payment();
            payment.setOrderId(order.getId());
            payment.setPaymentMethod(order.getPaymentMethod());
            payment.setAmount(order.getGrandTotal());
            payment.setTransactionId("TXN-" + System.currentTimeMillis());
            payment.setUpiReference(upiReference);
            payment.setPaymentStatus(order.getPaymentStatus());
            paymentDAO.recordPayment(payment, conn);

            // 4. Clear user's cart
            cartDAO.clearCart(cart.getId());

            conn.commit();
        } catch (SQLException ex) {
            if (conn != null) {
                try { conn.rollback(); } catch (SQLException ignored) {}
            }
            LOGGER.log(Level.SEVERE, "Checkout transaction rolled back", ex);
            throw ex;
        } finally {
            if (conn != null) {
                try { conn.setAutoCommit(true); conn.close(); } catch (SQLException ignored) {}
            }
        }

        // Dispatch Email Notifications
        emailService.sendNewOrderNotification(order);

        return order;
    }

    public boolean cancelOrder(Long orderId, String reason, Long userId) {
        Order order = orderDAO.getById(orderId);
        if (order == null) return false;

        if ("DELIVERED".equalsIgnoreCase(order.getOrderStatus()) || "CANCELLED".equalsIgnoreCase(order.getOrderStatus())) {
            throw new IllegalStateException("Order cannot be cancelled in its current state.");
        }

        Connection conn = null;
        try {
            conn = DatabaseConfig.getConnection();
            conn.setAutoCommit(false);

            // 1. Update order status
            boolean updated = orderDAO.updateOrderStatus(orderId, "CANCELLED", "Cancelled: " + reason, userId);
            if (!updated) {
                conn.rollback();
                return false;
            }

            // 2. Restore stock in inventory
            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    inventoryDAO.restoreStockInTransaction(item.getFoodItemId(), item.getQuantity(), conn);
                }
            }

            conn.commit();

            // Send cancellation email alert
            emailService.sendOrderCancelledNotification(order, reason);
            return true;
        } catch (SQLException e) {
            if (conn != null) {
                try { conn.rollback(); } catch (SQLException ignored) {}
            }
            LOGGER.log(Level.SEVERE, "Error cancelling order: " + orderId, e);
            return false;
        } finally {
            if (conn != null) {
                try { conn.setAutoCommit(true); conn.close(); } catch (SQLException ignored) {}
            }
        }
    }
}
