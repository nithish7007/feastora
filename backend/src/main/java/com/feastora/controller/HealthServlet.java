package com.feastora.controller;

import com.feastora.config.AppConfig;
import com.feastora.config.DatabaseConfig;
import com.feastora.util.JsonUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/api/health")
public class HealthServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("application", AppConfig.APP_NAME);
        health.put("tagline", AppConfig.APP_TAGLINE);
        health.put("backendEngine", "Java Servlets 6.0 (Tomcat 10.1+)");
        health.put("databaseConnected", DatabaseConfig.testConnection());
        health.put("timestamp", System.currentTimeMillis());

        Runtime runtime = Runtime.getRuntime();
        Map<String, Object> memory = new HashMap<>();
        memory.put("totalMemoryMB", runtime.totalMemory() / (1024 * 1024));
        memory.put("freeMemoryMB", runtime.freeMemory() / (1024 * 1024));
        memory.put("maxMemoryMB", runtime.maxMemory() / (1024 * 1024));
        health.put("jvmMemory", memory);

        JsonUtil.sendSuccess(resp, health, "FEASTORA Java Backend is running healthy");
    }
}
