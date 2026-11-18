package com.feastora.controller;

import com.feastora.dao.CategoryDAO;
import com.feastora.model.FoodCategory;
import com.feastora.util.JsonUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/categories/*")
public class CategoryServlet extends HttpServlet {

    private final CategoryDAO categoryDAO = new CategoryDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        List<FoodCategory> list = categoryDAO.findAll();
        JsonUtil.sendSuccess(resp, list, "Categories retrieved successfully");
    }
}
