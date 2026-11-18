package com.feastora.dao;

import com.feastora.config.DatabaseConfig;
import com.feastora.model.InventoryItem;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class InventoryDAO {

    private static final Logger LOGGER = Logger.getLogger(InventoryDAO.class.getName());

    public List<InventoryItem> getAllInventory() {
        List<InventoryItem> list = new ArrayList<>();
        String sql = "SELECT i.*, f.name as food_name, f.price, r.name as restaurant_name " +
                "FROM inventory i " +
                "JOIN food_items f ON i.food_item_id = f.id " +
                "JOIN restaurants r ON f.restaurant_id = r.id " +
                "ORDER BY i.current_stock ASC";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                InventoryItem item = new InventoryItem();
                item.setId(rs.getLong("id"));
                item.setFoodItemId(rs.getLong("food_item_id"));
                item.setFoodName(rs.getString("food_name"));
                item.setRestaurantName(rs.getString("restaurant_name"));
                item.setPrice(rs.getBigDecimal("price"));
                item.setInitialStock(rs.getInt("initial_stock"));
                item.setSoldQuantity(rs.getInt("sold_quantity"));
                item.setLowStockThreshold(rs.getInt("low_stock_threshold"));
                item.setCurrentStock(rs.getInt("current_stock"));
                item.setLastRestockedAt(rs.getTimestamp("last_restocked_at"));
                list.add(item);
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error loading inventory list", e);
        }
        return list;
    }

    public boolean updateStock(Long foodItemId, int newStock) {
        String invSql = "UPDATE inventory SET current_stock = ?, last_restocked_at = NOW() WHERE food_item_id = ?";
        String foodSql = "UPDATE food_items SET stock_quantity = ?, is_available = (? > 0) WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection()) {
            conn.setAutoCommit(false);
            try (PreparedStatement ps1 = conn.prepareStatement(invSql);
                 PreparedStatement ps2 = conn.prepareStatement(foodSql)) {
                ps1.setInt(1, newStock);
                ps1.setLong(2, foodItemId);
                ps1.executeUpdate();

                ps2.setInt(1, newStock);
                ps2.setInt(2, newStock);
                ps2.setLong(3, foodItemId);
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
            LOGGER.log(Level.SEVERE, "Error updating stock for food item: " + foodItemId, e);
            return false;
        }
    }

    public void deductStockInTransaction(Long foodItemId, int quantity, Connection conn) throws SQLException {
        String sql = "UPDATE inventory SET current_stock = GREATEST(0, current_stock - ?), sold_quantity = sold_quantity + ? WHERE food_item_id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, quantity);
            ps.setInt(2, quantity);
            ps.setLong(3, foodItemId);
            ps.executeUpdate();
        }

        String foodSql = "UPDATE food_items SET stock_quantity = GREATEST(0, stock_quantity - ?), is_available = (stock_quantity - ? > 0) WHERE id = ?";
        try (PreparedStatement ps = conn.prepareStatement(foodSql)) {
            ps.setInt(1, quantity);
            ps.setInt(2, quantity);
            ps.setLong(3, foodItemId);
            ps.executeUpdate();
        }
    }

    public void restoreStockInTransaction(Long foodItemId, int quantity, Connection conn) throws SQLException {
        String sql = "UPDATE inventory SET current_stock = current_stock + ?, sold_quantity = GREATEST(0, sold_quantity - ?) WHERE food_item_id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, quantity);
            ps.setInt(2, quantity);
            ps.setLong(3, foodItemId);
            ps.executeUpdate();
        }

        String foodSql = "UPDATE food_items SET stock_quantity = stock_quantity + ?, is_available = TRUE WHERE id = ?";
        try (PreparedStatement ps = conn.prepareStatement(foodSql)) {
            ps.setInt(1, quantity);
            ps.setLong(2, foodItemId);
            ps.executeUpdate();
        }
    }
}
