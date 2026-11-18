package com.feastora.dao;

import com.feastora.config.DatabaseConfig;
import com.feastora.model.Cart;
import com.feastora.model.CartItem;

import java.math.BigDecimal;
import java.sql.*;
import java.util.logging.Level;
import java.util.logging.Logger;

public class CartDAO {

    private static final Logger LOGGER = Logger.getLogger(CartDAO.class.getName());

    public Cart getOrCreateCart(String sessionId, Long userId) {
        Cart cart = findCart(sessionId, userId);
        if (cart == null) {
            cart = createCart(sessionId, userId);
        }
        populateCartItems(cart);
        cart.recalculateTotals();
        return cart;
    }

    private Cart findCart(String sessionId, Long userId) {
        String sql = "SELECT c.*, r.name as restaurant_name, r.delivery_fee " +
                "FROM carts c " +
                "LEFT JOIN restaurants r ON c.restaurant_id = r.id " +
                "WHERE (c.session_id = ? OR (c.user_id = ? AND ? IS NOT NULL)) " +
                "ORDER BY c.updated_at DESC LIMIT 1";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, sessionId != null ? sessionId : "");
            ps.setObject(2, userId);
            ps.setObject(3, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Cart c = new Cart();
                    c.setId(rs.getLong("id"));
                    c.setUserId((Long) rs.getObject("user_id"));
                    c.setRestaurantId((Long) rs.getObject("restaurant_id"));
                    c.setRestaurantName(rs.getString("restaurant_name"));
                    c.setSessionId(rs.getString("session_id"));
                    BigDecimal fee = rs.getBigDecimal("delivery_fee");
                    c.setDeliveryFee(fee != null ? fee : new BigDecimal("35.00"));
                    return c;
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error finding cart", e);
        }
        return null;
    }

    private Cart createCart(String sessionId, Long userId) {
        Cart cart = new Cart();
        String sql = "INSERT INTO carts (user_id, session_id) VALUES (?, ?)";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setObject(1, userId);
            ps.setString(2, sessionId != null ? sessionId : "ANON-" + System.currentTimeMillis());
            ps.executeUpdate();
            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    cart.setId(rs.getLong(1));
                    cart.setUserId(userId);
                    cart.setSessionId(sessionId);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error creating cart", e);
        }
        return cart;
    }

    private void populateCartItems(Cart cart) {
        if (cart == null || cart.getId() == null) return;
        String sql = "SELECT ci.*, f.name as food_name, f.image_url, f.is_veg " +
                "FROM cart_items ci " +
                "JOIN food_items f ON ci.food_item_id = f.id " +
                "WHERE ci.cart_id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, cart.getId());
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    CartItem item = new CartItem();
                    item.setId(rs.getLong("id"));
                    item.setCartId(rs.getLong("cart_id"));
                    item.setFoodItemId(rs.getLong("food_item_id"));
                    item.setFoodName(rs.getString("food_name"));
                    item.setImageUrl(rs.getString("image_url"));
                    item.setIsVeg(rs.getBoolean("is_veg"));
                    item.setQuantity(rs.getInt("quantity"));
                    item.setUnitPrice(rs.getBigDecimal("unit_price"));
                    item.setCustomizationsJson(rs.getString("customizations_json"));
                    cart.getItems().add(item);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error populating cart items for cart: " + cart.getId(), e);
        }
    }

    public boolean addItem(Long cartId, Long foodItemId, int quantity, BigDecimal unitPrice, String customizationsJson, Long restaurantId) {
        // Enforce restaurant association
        updateCartRestaurant(cartId, restaurantId);

        String checkSql = "SELECT id, quantity FROM cart_items WHERE cart_id = ? AND food_item_id = ?";
        try (Connection conn = DatabaseConfig.getConnection()) {
            Long existingItemId = null;
            int currentQty = 0;

            try (PreparedStatement checkPs = conn.prepareStatement(checkSql)) {
                checkPs.setLong(1, cartId);
                checkPs.setLong(2, foodItemId);
                try (ResultSet rs = checkPs.executeQuery()) {
                    if (rs.next()) {
                        existingItemId = rs.getLong("id");
                        currentQty = rs.getInt("quantity");
                    }
                }
            }

            if (existingItemId != null) {
                String updateSql = "UPDATE cart_items SET quantity = quantity + ? WHERE id = ?";
                try (PreparedStatement updatePs = conn.prepareStatement(updateSql)) {
                    updatePs.setInt(1, quantity);
                    updatePs.setLong(2, existingItemId);
                    return updatePs.executeUpdate() > 0;
                }
            } else {
                String insertSql = "INSERT INTO cart_items (cart_id, food_item_id, quantity, unit_price, customizations_json) VALUES (?, ?, ?, ?, ?)";
                try (PreparedStatement insertPs = conn.prepareStatement(insertSql)) {
                    insertPs.setLong(1, cartId);
                    insertPs.setLong(2, foodItemId);
                    insertPs.setInt(3, quantity);
                    insertPs.setBigDecimal(4, unitPrice);
                    insertPs.setString(5, customizationsJson != null ? customizationsJson : "[]");
                    return insertPs.executeUpdate() > 0;
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error adding item to cart", e);
            return false;
        }
    }

    public boolean updateQuantity(Long cartItemId, int newQty) {
        if (newQty <= 0) {
            return removeItem(cartItemId);
        }
        String sql = "UPDATE cart_items SET quantity = ? WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, newQty);
            ps.setLong(2, cartItemId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error updating cart item quantity", e);
            return false;
        }
    }

    public boolean removeItem(Long cartItemId) {
        String sql = "DELETE FROM cart_items WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, cartItemId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error removing cart item", e);
            return false;
        }
    }

    public boolean clearCart(Long cartId) {
        String sql = "DELETE FROM cart_items WHERE cart_id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, cartId);
            ps.executeUpdate();

            // Reset restaurant on cart
            try (PreparedStatement ps2 = conn.prepareStatement("UPDATE carts SET restaurant_id = NULL WHERE id = ?")) {
                ps2.setLong(1, cartId);
                ps2.executeUpdate();
            }
            return true;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error clearing cart: " + cartId, e);
            return false;
        }
    }

    private void updateCartRestaurant(Long cartId, Long restaurantId) {
        String sql = "UPDATE carts SET restaurant_id = ? WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, restaurantId);
            ps.setLong(2, cartId);
            ps.executeUpdate();
        } catch (SQLException e) {
            LOGGER.log(Level.WARNING, "Error updating restaurant for cart: " + cartId, e);
        }
    }
}
