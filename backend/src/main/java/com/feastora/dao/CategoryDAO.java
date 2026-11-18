package com.feastora.dao;

import com.feastora.config.DatabaseConfig;
import com.feastora.model.FoodCategory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class CategoryDAO {

    private static final Logger LOGGER = Logger.getLogger(CategoryDAO.class.getName());

    public List<FoodCategory> findAll() {
        List<FoodCategory> list = new ArrayList<>();
        String sql = "SELECT c.*, COUNT(f.id) as item_count " +
                "FROM food_categories c " +
                "LEFT JOIN food_items f ON c.id = f.category_id AND f.is_available = TRUE " +
                "WHERE c.is_active = TRUE " +
                "GROUP BY c.id " +
                "ORDER BY c.display_order ASC";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                FoodCategory cat = new FoodCategory();
                cat.setId(rs.getInt("id"));
                cat.setName(rs.getString("name"));
                cat.setSlug(rs.getString("slug"));
                cat.setImageUrl(rs.getString("image_url"));
                cat.setDescription(rs.getString("description"));
                cat.setDisplayOrder(rs.getInt("display_order"));
                cat.setIsActive(rs.getBoolean("is_active"));
                cat.setItemCount(rs.getInt("item_count"));
                list.add(cat);
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error in CategoryDAO.findAll", e);
        }
        return list;
    }
}
