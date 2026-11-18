package com.feastora.dao;

import com.feastora.config.DatabaseConfig;
import com.feastora.model.FoodCustomization;
import com.feastora.model.FoodItem;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class FoodDAO {

    private static final Logger LOGGER = Logger.getLogger(FoodDAO.class.getName());

    public List<FoodItem> findAll(Long restaurantId, Integer categoryId, Boolean isVeg, String search, Boolean bestsellerOnly) {
        List<FoodItem> list = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT f.*, r.name as restaurant_name, c.name as category_name " +
                "FROM food_items f " +
                "JOIN restaurants r ON f.restaurant_id = r.id " +
                "JOIN food_categories c ON f.category_id = c.id " +
                "WHERE 1=1 ");
        List<Object> params = new ArrayList<>();

        if (restaurantId != null) {
            sql.append("AND f.restaurant_id = ? ");
            params.add(restaurantId);
        }

        if (categoryId != null) {
            sql.append("AND f.category_id = ? ");
            params.add(categoryId);
        }

        if (isVeg != null) {
            sql.append("AND f.is_veg = ? ");
            params.add(isVeg);
        }

        if (Boolean.TRUE.equals(bestsellerOnly)) {
            sql.append("AND f.is_bestseller = TRUE ");
        }

        if (search != null && !search.trim().isEmpty()) {
            sql.append("AND (LOWER(f.name) LIKE LOWER(?) OR LOWER(f.description) LIKE LOWER(?) OR LOWER(r.name) LIKE LOWER(?)) ");
            String term = "%" + search.trim() + "%";
            params.add(term);
            params.add(term);
            params.add(term);
        }

        sql.append("ORDER BY f.is_bestseller DESC, f.id ASC");

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {
            for (int i = 0; i < params.size(); i++) {
                ps.setObject(i + 1, params.get(i));
            }
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    FoodItem item = mapFoodItem(rs);
                    item.setCustomizations(getCustomizations(item.getId(), conn));
                    list.add(item);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error in FoodDAO.findAll", e);
        }
        return list;
    }

    public FoodItem findById(Long id) {
        String sql = "SELECT f.*, r.name as restaurant_name, c.name as category_name " +
                "FROM food_items f " +
                "JOIN restaurants r ON f.restaurant_id = r.id " +
                "JOIN food_categories c ON f.category_id = c.id " +
                "WHERE f.id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    FoodItem item = mapFoodItem(rs);
                    item.setCustomizations(getCustomizations(item.getId(), conn));
                    return item;
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error finding food item by id: " + id, e);
        }
        return null;
    }

    public List<FoodCustomization> getCustomizations(Long foodItemId, Connection conn) {
        List<FoodCustomization> list = new ArrayList<>();
        String sql = "SELECT * FROM food_customizations WHERE food_item_id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, foodItemId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    FoodCustomization c = new FoodCustomization();
                    c.setId(rs.getLong("id"));
                    c.setFoodItemId(rs.getLong("food_item_id"));
                    c.setName(rs.getString("name"));
                    c.setAdditionalPrice(rs.getBigDecimal("additional_price"));
                    c.setIsRequired(rs.getBoolean("is_required"));
                    c.setCustomizationType(rs.getString("customization_type"));
                    list.add(c);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.WARNING, "Error loading customizations for item: " + foodItemId, e);
        }
        return list;
    }

    public FoodItem create(FoodItem item) throws SQLException {
        String sql = "INSERT INTO food_items (restaurant_id, category_id, name, description, image_url, price, discount_percentage, is_veg, is_available, is_bestseller, stock_quantity, preparation_time_min) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setLong(1, item.getRestaurantId());
            ps.setInt(2, item.getCategoryId());
            ps.setString(3, item.getName());
            ps.setString(4, item.getDescription());
            ps.setString(5, item.getImageUrl());
            ps.setBigDecimal(6, item.getPrice());
            ps.setInt(7, item.getDiscountPercentage() != null ? item.getDiscountPercentage() : 0);
            ps.setBoolean(8, item.getIsVeg() != null ? item.getIsVeg() : true);
            ps.setBoolean(9, item.getIsAvailable() != null ? item.getIsAvailable() : true);
            ps.setBoolean(10, item.getIsBestseller() != null ? item.getIsBestseller() : false);
            ps.setInt(11, item.getStockQuantity() != null ? item.getStockQuantity() : 100);
            ps.setInt(12, item.getPreparationTimeMin() != null ? item.getPreparationTimeMin() : 15);

            ps.executeUpdate();
            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    item.setId(rs.getLong(1));
                    // initialize inventory row
                    initInventory(item.getId(), item.getStockQuantity(), conn);
                }
            }
        }
        return item;
    }

    public boolean update(FoodItem item) {
        String sql = "UPDATE food_items SET restaurant_id=?, category_id=?, name=?, description=?, image_url=?, price=?, discount_percentage=?, is_veg=?, is_available=?, is_bestseller=?, stock_quantity=?, preparation_time_min=? WHERE id=?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, item.getRestaurantId());
            ps.setInt(2, item.getCategoryId());
            ps.setString(3, item.getName());
            ps.setString(4, item.getDescription());
            ps.setString(5, item.getImageUrl());
            ps.setBigDecimal(6, item.getPrice());
            ps.setInt(7, item.getDiscountPercentage() != null ? item.getDiscountPercentage() : 0);
            ps.setBoolean(8, item.getIsVeg() != null ? item.getIsVeg() : true);
            ps.setBoolean(9, item.getIsAvailable() != null ? item.getIsAvailable() : true);
            ps.setBoolean(10, item.getIsBestseller() != null ? item.getIsBestseller() : false);
            ps.setInt(11, item.getStockQuantity() != null ? item.getStockQuantity() : 100);
            ps.setInt(12, item.getPreparationTimeMin() != null ? item.getPreparationTimeMin() : 15);
            ps.setLong(13, item.getId());
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error updating food item: " + item.getId(), e);
            return false;
        }
    }

    public boolean delete(Long id) {
        String sql = "DELETE FROM food_items WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error deleting food item: " + id, e);
            return false;
        }
    }

    public boolean updateStockAndAvailability(Long id, int stockQuantity, boolean isAvailable) {
        String sql = "UPDATE food_items SET stock_quantity = ?, is_available = ? WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, stockQuantity);
            ps.setBoolean(2, isAvailable);
            ps.setLong(3, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error updating stock for food item: " + id, e);
            return false;
        }
    }

    private void initInventory(Long foodItemId, Integer stock, Connection conn) {
        String sql = "INSERT INTO inventory (food_item_id, initial_stock, current_stock, low_stock_threshold) VALUES (?, ?, ?, 10) ON DUPLICATE KEY UPDATE current_stock=VALUES(current_stock)";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, foodItemId);
            ps.setInt(2, stock != null ? stock : 100);
            ps.setInt(3, stock != null ? stock : 100);
            ps.executeUpdate();
        } catch (SQLException e) {
            LOGGER.log(Level.WARNING, "Error initializing inventory for item: " + foodItemId, e);
        }
    }

    private FoodItem mapFoodItem(ResultSet rs) throws SQLException {
        FoodItem item = new FoodItem();
        item.setId(rs.getLong("id"));
        item.setRestaurantId(rs.getLong("restaurant_id"));
        item.setRestaurantName(rs.getString("restaurant_name"));
        item.setCategoryId(rs.getInt("category_id"));
        item.setCategoryName(rs.getString("category_name"));
        item.setName(rs.getString("name"));
        item.setDescription(rs.getString("description"));
        item.setImageUrl(rs.getString("image_url"));
        item.setPrice(rs.getBigDecimal("price"));
        item.setDiscountPercentage(rs.getInt("discount_percentage"));
        item.setIsVeg(rs.getBoolean("is_veg"));
        item.setIsAvailable(rs.getBoolean("is_available"));
        item.setIsBestseller(rs.getBoolean("is_bestseller"));
        item.setStockQuantity(rs.getInt("stock_quantity"));
        item.setPreparationTimeMin(rs.getInt("preparation_time_min"));
        return item;
    }
}
