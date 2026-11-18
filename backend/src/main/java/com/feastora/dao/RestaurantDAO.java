package com.feastora.dao;

import com.feastora.config.DatabaseConfig;
import com.feastora.model.Restaurant;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class RestaurantDAO {

    private static final Logger LOGGER = Logger.getLogger(RestaurantDAO.class.getName());

    public List<Restaurant> findAll(String city, String search, String sortBy, Boolean featuredOnly) {
        List<Restaurant> list = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT * FROM restaurants WHERE 1=1 ");
        List<Object> params = new ArrayList<>();

        if (city != null && !city.trim().isEmpty() && !city.equalsIgnoreCase("all")) {
            sql.append("AND (LOWER(city) LIKE LOWER(?) OR LOWER(location) LIKE LOWER(?)) ");
            params.add("%" + city.trim() + "%");
            params.add("%" + city.trim() + "%");
        }

        if (search != null && !search.trim().isEmpty()) {
            sql.append("AND (LOWER(name) LIKE LOWER(?) OR LOWER(cuisine) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?)) ");
            String term = "%" + search.trim() + "%";
            params.add(term);
            params.add(term);
            params.add(term);
        }

        if (Boolean.TRUE.equals(featuredOnly)) {
            sql.append("AND is_featured = TRUE ");
        }

        if ("rating".equalsIgnoreCase(sortBy)) {
            sql.append("ORDER BY rating DESC, rating_count DESC ");
        } else if ("time".equalsIgnoreCase(sortBy)) {
            sql.append("ORDER BY delivery_time_min ASC ");
        } else if ("cost_asc".equalsIgnoreCase(sortBy)) {
            sql.append("ORDER BY cost_for_two ASC ");
        } else if ("cost_desc".equalsIgnoreCase(sortBy)) {
            sql.append("ORDER BY cost_for_two DESC ");
        } else {
            sql.append("ORDER BY is_featured DESC, rating DESC ");
        }

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {
            for (int i = 0; i < params.size(); i++) {
                ps.setObject(i + 1, params.get(i));
            }
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapRestaurant(rs));
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error in RestaurantDAO.findAll", e);
        }
        return list;
    }

    public Restaurant findById(Long id) {
        String sql = "SELECT * FROM restaurants WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapRestaurant(rs);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error finding restaurant by id: " + id, e);
        }
        return null;
    }

    public Restaurant create(Restaurant r) throws SQLException {
        String sql = "INSERT INTO restaurants (name, slug, description, image_url, banner_url, location, city, address, rating, rating_count, delivery_time_min, delivery_time_max, cuisine, delivery_fee, cost_for_two, opening_time, closing_time, is_open, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            setRestaurantStatement(ps, r);
            ps.executeUpdate();
            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    r.setId(rs.getLong(1));
                }
            }
        }
        return r;
    }

    public boolean update(Restaurant r) {
        String sql = "UPDATE restaurants SET name=?, slug=?, description=?, image_url=?, banner_url=?, location=?, city=?, address=?, rating=?, rating_count=?, delivery_time_min=?, delivery_time_max=?, cuisine=?, delivery_fee=?, cost_for_two=?, opening_time=?, closing_time=?, is_open=?, is_featured=? WHERE id=?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            setRestaurantStatement(ps, r);
            ps.setLong(20, r.getId());
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error updating restaurant: " + r.getId(), e);
            return false;
        }
    }

    public boolean delete(Long id) {
        String sql = "DELETE FROM restaurants WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error deleting restaurant: " + id, e);
            return false;
        }
    }

    public boolean updateStatus(Long id, boolean isOpen) {
        String sql = "UPDATE restaurants SET is_open = ? WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setBoolean(1, isOpen);
            ps.setLong(2, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error updating status for restaurant: " + id, e);
            return false;
        }
    }

    private void setRestaurantStatement(PreparedStatement ps, Restaurant r) throws SQLException {
        ps.setString(1, r.getName());
        ps.setString(2, r.getSlug() != null ? r.getSlug() : r.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-"));
        ps.setString(3, r.getDescription());
        ps.setString(4, r.getImageUrl());
        ps.setString(5, r.getBannerUrl() != null ? r.getBannerUrl() : r.getImageUrl());
        ps.setString(6, r.getLocation());
        ps.setString(7, r.getCity());
        ps.setString(8, r.getAddress());
        ps.setBigDecimal(9, r.getRating() != null ? r.getRating() : new java.math.BigDecimal("4.5"));
        ps.setInt(10, r.getRatingCount() != null ? r.getRatingCount() : 100);
        ps.setInt(11, r.getDeliveryTimeMin() != null ? r.getDeliveryTimeMin() : 25);
        ps.setInt(12, r.getDeliveryTimeMax() != null ? r.getDeliveryTimeMax() : 40);
        ps.setString(13, r.getCuisine());
        ps.setBigDecimal(14, r.getDeliveryFee() != null ? r.getDeliveryFee() : new java.math.BigDecimal("30.00"));
        ps.setBigDecimal(15, r.getCostForTwo() != null ? r.getCostForTwo() : new java.math.BigDecimal("400.00"));
        ps.setTime(16, Time.valueOf(r.getOpeningTime() != null ? r.getOpeningTime() : "07:00:00"));
        ps.setTime(17, Time.valueOf(r.getClosingTime() != null ? r.getClosingTime() : "23:00:00"));
        ps.setBoolean(18, r.getIsOpen() != null ? r.getIsOpen() : true);
        ps.setBoolean(19, r.getIsFeatured() != null ? r.getIsFeatured() : false);
    }

    private Restaurant mapRestaurant(ResultSet rs) throws SQLException {
        Restaurant r = new Restaurant();
        r.setId(rs.getLong("id"));
        r.setName(rs.getString("name"));
        r.setSlug(rs.getString("slug"));
        r.setDescription(rs.getString("description"));
        r.setImageUrl(rs.getString("image_url"));
        r.setBannerUrl(rs.getString("banner_url"));
        r.setLocation(rs.getString("location"));
        r.setCity(rs.getString("city"));
        r.setAddress(rs.getString("address"));
        r.setRating(rs.getBigDecimal("rating"));
        r.setRatingCount(rs.getInt("rating_count"));
        r.setDeliveryTimeMin(rs.getInt("delivery_time_min"));
        r.setDeliveryTimeMax(rs.getInt("delivery_time_max"));
        r.setCuisine(rs.getString("cuisine"));
        r.setDeliveryFee(rs.getBigDecimal("delivery_fee"));
        r.setCostForTwo(rs.getBigDecimal("cost_for_two"));
        r.setOpeningTime(rs.getString("opening_time"));
        r.setClosingTime(rs.getString("closing_time"));
        r.setIsOpen(rs.getBoolean("is_open"));
        r.setIsFeatured(rs.getBoolean("is_featured"));
        return r;
    }
}
