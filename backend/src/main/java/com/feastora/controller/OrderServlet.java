package com.feastora.controller;

import com.feastora.config.AppConfig;
import com.feastora.dao.OrderDAO;
import com.feastora.model.Order;
import com.feastora.model.User;
import com.feastora.service.OrderService;
import com.feastora.util.JsonUtil;
import com.google.gson.JsonObject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/orders/*")
public class OrderServlet extends HttpServlet {

    private final OrderService orderService = new OrderService();
    private final OrderDAO orderDAO = new OrderDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        Long userId = getUserId(req);

        if (pathInfo == null || "/".equals(pathInfo)) {
            // GET /api/orders (user's order history)
            if (userId == null) {
                // If not logged in, return empty list or demo orders
                userId = 2L; // sample default user
            }
            List<Order> orders = orderDAO.getOrdersByUser(userId);
            JsonUtil.sendSuccess(resp, orders, "Orders fetched successfully");
        } else if (pathInfo.startsWith("/track/")) {
            // GET /api/orders/track/{orderNumber}
            String orderNumber = pathInfo.substring("/track/".length());
            Order order = orderDAO.getByOrderNumber(orderNumber);
            if (order != null) {
                JsonUtil.sendSuccess(resp, order, "Live order tracking details");
            } else {
                JsonUtil.sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Order not found with number: " + orderNumber);
            }
        } else {
            // GET /api/orders/{id}
            try {
                Long orderId = Long.parseLong(pathInfo.substring(1));
                Order order = orderDAO.getById(orderId);
                if (order != null) {
                    JsonUtil.sendSuccess(resp, order, "Order details");
                } else {
                    JsonUtil.sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Order not found");
                }
            } catch (NumberFormatException e) {
                JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid order id");
            }
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();

        if ("/checkout".equals(pathInfo) || pathInfo == null || "/".equals(pathInfo)) {
            handleCheckout(req, resp);
        } else if (pathInfo.endsWith("/cancel")) {
            handleCancel(req, resp, pathInfo);
        } else {
            JsonUtil.sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Unknown order action");
        }
    }

    private void handleCheckout(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            JsonObject json = JsonUtil.fromJson(req, JsonObject.class);
            if (json == null) {
                JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid checkout payload");
                return;
            }

            Long userId = getUserId(req);
            String sessionId = getSessionId(req);
            String customerName = json.has("customerName") ? json.get("customerName").getAsString() : "Valued Customer";
            String customerPhone = json.has("customerPhone") ? json.get("customerPhone").getAsString() : "+91 9876543210";
            String deliveryAddress = json.has("deliveryAddress") ? json.get("deliveryAddress").getAsString() : "Standard Address";
            String paymentMethod = json.has("paymentMethod") ? json.get("paymentMethod").getAsString() : "COD";
            String couponCode = json.has("couponCode") && !json.get("couponCode").isJsonNull() ? json.get("couponCode").getAsString() : null;
            String specialInstructions = json.has("specialInstructions") && !json.get("specialInstructions").isJsonNull() ? json.get("specialInstructions").getAsString() : null;
            String upiReference = json.has("upiReference") && !json.get("upiReference").isJsonNull() ? json.get("upiReference").getAsString() : null;

            Order order = orderService.checkout(userId, sessionId, customerName, customerPhone,
                    deliveryAddress, paymentMethod, couponCode, specialInstructions, upiReference);

            JsonUtil.sendSuccess(resp, order, "Order placed successfully! Order #" + order.getOrderNumber());
        } catch (IllegalArgumentException e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Checkout failure: " + e.getMessage());
        }
    }

    private void handleCancel(HttpServletRequest req, HttpServletResponse resp, String pathInfo) throws IOException {
        try {
            // Path: /{id}/cancel
            String idStr = pathInfo.replace("/cancel", "").replace("/", "");
            Long orderId = Long.parseLong(idStr);

            JsonObject json = JsonUtil.fromJson(req, JsonObject.class);
            String reason = json != null && json.has("reason") ? json.get("reason").getAsString() : "Customer requested cancellation";
            Long userId = getUserId(req);

            boolean cancelled = orderService.cancelOrder(orderId, reason, userId);
            if (cancelled) {
                JsonUtil.sendSuccess(resp, null, "Order has been cancelled successfully. Stock restored.");
            } else {
                JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Could not cancel order in its current status.");
            }
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Error cancelling order: " + e.getMessage());
        }
    }

    private String getSessionId(HttpServletRequest req) {
        String header = req.getHeader("Session-Token");
        if (header != null && !header.trim().isEmpty()) {
            return header.trim();
        }
        HttpSession s = req.getSession(true);
        return s.getId();
    }

    private Long getUserId(HttpServletRequest req) {
        HttpSession s = req.getSession(false);
        if (s != null) {
            User u = (User) s.getAttribute(AppConfig.SESSION_USER_KEY);
            if (u != null) return u.getId();
        }
        return null;
    }
}
