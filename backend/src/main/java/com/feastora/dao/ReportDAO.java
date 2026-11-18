package com.feastora.dao;

import com.feastora.config.DatabaseConfig;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ReportDAO {

    private static final Logger LOGGER = Logger.getLogger(ReportDAO.class.getName());

    public Map<String, Object> getDashboardKPIs() {
        Map<String, Object> map = new HashMap<>();
        String sql = "SELECT " +
                "(SELECT COUNT(*) FROM orders) as total_orders, " +
                "(SELECT COALESCE(SUM(grand_total), 0) FROM orders WHERE order_status != 'CANCELLED') as total_revenue, " +
                "(SELECT COUNT(*) FROM users WHERE role_id = 1) as total_customers, " +
                "(SELECT COUNT(*) FROM restaurants) as total_restaurants, " +
                "(SELECT COUNT(*) FROM food_items) as total_dishes, " +
                "(SELECT COUNT(*) FROM orders WHERE order_status IN ('ORDER_PLACED', 'ORDER_CONFIRMED', 'FOOD_PREPARING', 'READY_FOR_PICKUP', 'DELIVERY_PARTNER_ASSIGNED', 'OUT_FOR DELIVERY')) as pending_orders, " +
                "(SELECT COUNT(*) FROM orders WHERE order_status = 'DELIVERY_PARTNER_ASSIGNED' OR order_status = 'OUT_FOR DELIVERY') as out_for_delivery_orders, " +
                "(SELECT COUNT(*) FROM orders WHERE order_status = 'DELIVERED') as delivered_orders, " +
                "(SELECT COUNT(*) FROM orders WHERE order_status = 'CANCELLED') as cancelled_orders, " +
                "(SELECT COALESCE(SUM(grand_total), 0) FROM orders WHERE order_status != 'CANCELLED' AND DATE(created_at) = CURDATE()) as today_sales, " +
                "(SELECT COALESCE(SUM(grand_total), 0) FROM orders WHERE order_status != 'CANCELLED' AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as weekly_sales, " +
                "(SELECT COALESCE(SUM(grand_total), 0) FROM orders WHERE order_status != 'CANCELLED' AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as monthly_sales";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                map.put("totalOrders", rs.getInt("total_orders"));
                map.put("totalRevenue", rs.getBigDecimal("total_revenue"));
                map.put("totalCustomers", rs.getInt("total_customers"));
                map.put("totalRestaurants", rs.getInt("total_restaurants"));
                map.put("totalDishes", rs.getInt("total_dishes"));
                map.put("pendingOrders", rs.getInt("pending_orders"));
                map.put("outForDeliveryOrders", rs.getInt("out_for_delivery_orders"));
                map.put("deliveredOrders", rs.getInt("delivered_orders"));
                map.put("cancelledOrders", rs.getInt("cancelled_orders"));
                map.put("todaySales", rs.getBigDecimal("today_sales"));
                map.put("weeklySales", rs.getBigDecimal("weekly_sales"));
                map.put("monthlySales", rs.getBigDecimal("monthly_sales"));
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error generating dashboard KPIs", e);
        }
        return map;
    }

    public List<Map<String, Object>> getSalesChartData() {
        List<Map<String, Object>> list = new ArrayList<>();
        String sql = "SELECT DATE(created_at) as sale_date, COUNT(id) as order_count, COALESCE(SUM(grand_total), 0) as daily_revenue " +
                "FROM orders " +
                "WHERE order_status != 'CANCELLED' AND created_at >= DATE_SUB(NOW(), INTERVAL 14 DAY) " +
                "GROUP BY DATE(created_at) " +
                "ORDER BY sale_date ASC";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Map<String, Object> day = new HashMap<>();
                day.put("date", rs.getString("sale_date"));
                day.put("orderCount", rs.getInt("order_count"));
                day.put("revenue", rs.getBigDecimal("daily_revenue"));
                list.add(day);
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error fetching sales chart data", e);
        }
        return list;
    }

    public List<Map<String, Object>> getBestSellingDishes(int limit) {
        List<Map<String, Object>> list = new ArrayList<>();
        String sql = "SELECT oi.item_name, r.name as restaurant_name, SUM(oi.quantity) as total_sold, SUM(oi.subtotal) as total_amount " +
                "FROM order_items oi " +
                "JOIN orders o ON oi.order_id = o.id " +
                "JOIN restaurants r ON o.restaurant_id = r.id " +
                "WHERE o.order_status != 'CANCELLED' " +
                "GROUP BY oi.item_name, r.name " +
                "ORDER BY total_sold DESC LIMIT ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, limit);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> item = new HashMap<>();
                    item.put("dishName", rs.getString("item_name"));
                    item.put("restaurantName", rs.getString("restaurant_name"));
                    item.put("totalSold", rs.getInt("total_sold"));
                    item.put("totalAmount", rs.getBigDecimal("total_amount"));
                    list.add(item);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error fetching best selling dishes", e);
        }
        return list;
    }
}
