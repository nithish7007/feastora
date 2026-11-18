package com.feastora.controller;

import com.feastora.dao.FoodDAO;
import com.feastora.dao.RestaurantDAO;
import com.feastora.model.FoodItem;
import com.feastora.model.Restaurant;
import com.feastora.util.JsonUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/restaurants/*")
public class RestaurantServlet extends HttpServlet {

    private final RestaurantDAO restaurantDAO = new RestaurantDAO();
    private final FoodDAO foodDAO = new FoodDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();

        if (pathInfo == null || "/".equals(pathInfo)) {
            // GET /api/restaurants
            String city = req.getParameter("city");
            String search = req.getParameter("search");
            String sortBy = req.getParameter("sortBy");
            Boolean featuredOnly = req.getParameter("featured") != null ? Boolean.parseBoolean(req.getParameter("featured")) : null;

            List<Restaurant> list = restaurantDAO.findAll(city, search, sortBy, featuredOnly);
            JsonUtil.sendSuccess(resp, list, "Restaurants retrieved successfully");
        } else {
            // GET /api/restaurants/{id}
            try {
                String idStr = pathInfo.substring(1);
                Long id = Long.parseLong(idStr);
                Restaurant r = restaurantDAO.findById(id);
                if (r != null) {
                    List<FoodItem> menu = foodDAO.findAll(id, null, null, null, null);
                    r.setMenu(menu);
                    JsonUtil.sendSuccess(resp, r, "Restaurant details retrieved");
                } else {
                    JsonUtil.sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Restaurant not found with id: " + id);
                }
            } catch (NumberFormatException e) {
                JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid restaurant id");
            }
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            Restaurant r = JsonUtil.fromJson(req, Restaurant.class);
            if (r == null || r.getName() == null || r.getCity() == null) {
                JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Restaurant name and city are required");
                return;
            }
            Restaurant created = restaurantDAO.create(r);
            JsonUtil.sendSuccess(resp, created, "Restaurant created successfully");
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error creating restaurant: " + e.getMessage());
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.length() <= 1) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Restaurant id required");
            return;
        }

        try {
            Long id = Long.parseLong(pathInfo.substring(1));
            Restaurant r = JsonUtil.fromJson(req, Restaurant.class);
            r.setId(id);
            boolean updated = restaurantDAO.update(r);
            if (updated) {
                JsonUtil.sendSuccess(resp, r, "Restaurant updated successfully");
            } else {
                JsonUtil.sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Restaurant not found");
            }
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Error updating restaurant: " + e.getMessage());
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.length() <= 1) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Restaurant id required");
            return;
        }

        try {
            Long id = Long.parseLong(pathInfo.substring(1));
            boolean deleted = restaurantDAO.delete(id);
            if (deleted) {
                JsonUtil.sendSuccess(resp, null, "Restaurant deleted successfully");
            } else {
                JsonUtil.sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Restaurant not found");
            }
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Error deleting restaurant: " + e.getMessage());
        }
    }
}
