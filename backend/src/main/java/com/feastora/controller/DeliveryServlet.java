package com.feastora.controller;

import com.feastora.config.DatabaseConfig;
import com.feastora.model.DeliveryPartner;
import com.feastora.util.JsonUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/api/delivery/*")
public class DeliveryServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        List<DeliveryPartner> partners = new ArrayList<>();
        String sql = "SELECT * FROM delivery_partners WHERE is_active = TRUE";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                DeliveryPartner p = new DeliveryPartner();
                p.setId(rs.getLong("id"));
                p.setName(rs.getString("name"));
                p.setPhone(rs.getString("phone"));
                p.setVehicleNumber(rs.getString("vehicle_number"));
                p.setRating(rs.getBigDecimal("rating"));
                p.setIsActive(rs.getBoolean("is_active"));
                p.setIsAvailable(rs.getBoolean("is_available"));
                partners.add(p);
            }
        } catch (SQLException e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error loading delivery partners");
            return;
        }

        JsonUtil.sendSuccess(resp, partners, "Active delivery partners retrieved");
    }
}
