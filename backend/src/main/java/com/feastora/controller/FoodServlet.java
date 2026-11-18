package com.feastora.controller;

import com.feastora.dao.FoodDAO;
import com.feastora.model.FoodItem;
import com.feastora.util.JsonUtil;
import com.google.gson.JsonObject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/foods/*")
public class FoodServlet extends HttpServlet {

    private final FoodDAO foodDAO = new FoodDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();

        if (pathInfo == null || "/".equals(pathInfo)) {
            // GET /api/foods
            Long restaurantId = req.getParameter("restaurantId") != null ? Long.parseLong(req.getParameter("restaurantId")) : null;
            Integer categoryId = req.getParameter("categoryId") != null ? Integer.parseInt(req.getParameter("categoryId")) : null;
            Boolean isVeg = req.getParameter("isVeg") != null ? Boolean.parseBoolean(req.getParameter("isVeg")) : null;
            String search = req.getParameter("search");
            Boolean bestseller = req.getParameter("bestseller") != null ? Boolean.parseBoolean(req.getParameter("bestseller")) : null;

            List<FoodItem> items = foodDAO.findAll(restaurantId, categoryId, isVeg, search, bestseller);
            JsonUtil.sendSuccess(resp, items, "Food items retrieved");
        } else {
            // GET /api/foods/{id}
            try {
                Long id = Long.parseLong(pathInfo.substring(1));
                FoodItem item = foodDAO.findById(id);
                if (item != null) {
                    JsonUtil.sendSuccess(resp, item, "Food item retrieved");
                } else {
                    JsonUtil.sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Food item not found");
                }
            } catch (NumberFormatException e) {
                JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid food item id");
            }
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            FoodItem item = JsonUtil.fromJson(req, FoodItem.class);
            if (item == null || item.getName() == null || item.getPrice() == null) {
                JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Item name and price are required");
                return;
            }
            FoodItem created = foodDAO.create(item);
            JsonUtil.sendSuccess(resp, created, "Food item created successfully");
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error creating food item: " + e.getMessage());
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.length() <= 1) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Food item id required");
            return;
        }

        try {
            Long id = Long.parseLong(pathInfo.substring(1));
            FoodItem item = JsonUtil.fromJson(req, FoodItem.class);
            item.setId(id);
            boolean updated = foodDAO.update(item);
            if (updated) {
                JsonUtil.sendSuccess(resp, item, "Food item updated successfully");
            } else {
                JsonUtil.sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Food item not found");
            }
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Error updating food item: " + e.getMessage());
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.length() <= 1) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Food item id required");
            return;
        }

        try {
            Long id = Long.parseLong(pathInfo.substring(1));
            boolean deleted = foodDAO.delete(id);
            if (deleted) {
                JsonUtil.sendSuccess(resp, null, "Food item deleted");
            } else {
                JsonUtil.sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Food item not found");
            }
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Error deleting food item: " + e.getMessage());
        }
    }
}
