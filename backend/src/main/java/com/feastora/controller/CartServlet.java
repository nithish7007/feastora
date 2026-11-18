package com.feastora.controller;

import com.feastora.config.AppConfig;
import com.feastora.dao.CartDAO;
import com.feastora.model.Cart;
import com.feastora.model.User;
import com.feastora.util.JsonUtil;
import com.google.gson.JsonObject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.math.BigDecimal;

@WebServlet("/api/cart/*")
public class CartServlet extends HttpServlet {

    private final CartDAO cartDAO = new CartDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String sessionId = getSessionId(req);
        Long userId = getUserId(req);

        Cart cart = cartDAO.getOrCreateCart(sessionId, userId);
        JsonUtil.sendSuccess(resp, cart, "Cart retrieved");
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        String sessionId = getSessionId(req);
        Long userId = getUserId(req);
        Cart cart = cartDAO.getOrCreateCart(sessionId, userId);

        if ("/add".equals(pathInfo) || pathInfo == null || "/".equals(pathInfo)) {
            JsonObject json = JsonUtil.fromJson(req, JsonObject.class);
            Long foodItemId = json.get("foodItemId").getAsLong();
            int quantity = json.has("quantity") ? json.get("quantity").getAsInt() : 1;
            BigDecimal unitPrice = json.get("unitPrice").getAsBigDecimal();
            Long restaurantId = json.get("restaurantId").getAsLong();
            String customizationsJson = json.has("customizations") ? json.get("customizations").toString() : "[]";

            // If user adding from a different restaurant, check if cart needs clearing or replacing
            if (cart.getRestaurantId() != null && !cart.getRestaurantId().equals(restaurantId) && !cart.getItems().isEmpty()) {
                if (json.has("resetCart") && json.get("resetCart").getAsBoolean()) {
                    cartDAO.clearCart(cart.getId());
                } else {
                    JsonUtil.sendError(resp, HttpServletResponse.SC_CONFLICT, "Your cart contains items from another restaurant. Would you like to discard and start fresh?");
                    return;
                }
            }

            cartDAO.addItem(cart.getId(), foodItemId, quantity, unitPrice, customizationsJson, restaurantId);
            Cart updated = cartDAO.getOrCreateCart(sessionId, userId);
            JsonUtil.sendSuccess(resp, updated, "Item added to cart");
        } else {
            JsonUtil.sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Cart endpoint not found");
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        String sessionId = getSessionId(req);
        Long userId = getUserId(req);

        if ("/update".equals(pathInfo)) {
            JsonObject json = JsonUtil.fromJson(req, JsonObject.class);
            Long cartItemId = json.get("cartItemId").getAsLong();
            int newQuantity = json.get("quantity").getAsInt();

            cartDAO.updateQuantity(cartItemId, newQuantity);
            Cart updated = cartDAO.getOrCreateCart(sessionId, userId);
            JsonUtil.sendSuccess(resp, updated, "Cart quantity updated");
        } else {
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Unknown update action");
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        String sessionId = getSessionId(req);
        Long userId = getUserId(req);
        Cart cart = cartDAO.getOrCreateCart(sessionId, userId);

        if ("/clear".equals(pathInfo)) {
            cartDAO.clearCart(cart.getId());
            Cart emptyCart = cartDAO.getOrCreateCart(sessionId, userId);
            JsonUtil.sendSuccess(resp, emptyCart, "Cart cleared successfully");
        } else if (pathInfo != null && pathInfo.startsWith("/item/")) {
            Long cartItemId = Long.parseLong(pathInfo.substring("/item/".length()));
            cartDAO.removeItem(cartItemId);
            Cart updated = cartDAO.getOrCreateCart(sessionId, userId);
            JsonUtil.sendSuccess(resp, updated, "Item removed from cart");
        } else {
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid cart delete request");
        }
    }

    private String getSessionId(HttpServletRequest req) {
        String headerSession = req.getHeader("Session-Token");
        if (headerSession != null && !headerSession.trim().isEmpty()) {
            return headerSession.trim();
        }
        HttpSession session = req.getSession(true);
        return session.getId();
    }

    private Long getUserId(HttpServletRequest req) {
        HttpSession session = req.getSession(false);
        if (session != null) {
            User user = (User) session.getAttribute(AppConfig.SESSION_USER_KEY);
            if (user != null) {
                return user.getId();
            }
        }
        return null;
    }
}
