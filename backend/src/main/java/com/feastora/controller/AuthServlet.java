package com.feastora.controller;

import com.feastora.config.AppConfig;
import com.feastora.model.User;
import com.feastora.service.AuthService;
import com.feastora.util.JsonUtil;
import com.google.gson.JsonObject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/api/auth/*")
public class AuthServlet extends HttpServlet {

    private final AuthService authService = new AuthService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || "/me".equals(pathInfo)) {
            handleGetMe(req, resp);
        } else {
            JsonUtil.sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Auth endpoint not found");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        if (pathInfo == null) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid auth path");
            return;
        }

        switch (pathInfo) {
            case "/login":
                handleLogin(req, resp);
                break;
            case "/register":
                handleRegister(req, resp);
                break;
            case "/logout":
                handleLogout(req, resp);
                break;
            case "/change-password":
                handleChangePassword(req, resp);
                break;
            default:
                JsonUtil.sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Auth endpoint not found: " + pathInfo);
                break;
        }
    }

    private void handleLogin(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            JsonObject json = JsonUtil.fromJson(req, JsonObject.class);
            if (json == null || !json.has("email") || !json.has("password")) {
                JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Email and password are required.");
                return;
            }

            String email = json.get("email").getAsString();
            String password = json.get("password").getAsString();
            String ipAddress = req.getRemoteAddr();
            String userAgent = req.getHeader("User-Agent");

            User user = authService.authenticate(email, password, ipAddress, userAgent);
            if (user == null) {
                JsonUtil.sendError(resp, HttpServletResponse.SC_UNAUTHORIZED, "Invalid email or password.");
                return;
            }

            HttpSession session = req.getSession(true);
            session.setAttribute(AppConfig.SESSION_USER_KEY, user);
            session.setAttribute(AppConfig.SESSION_ROLE_KEY, user.getRoleName());

            Map<String, Object> data = new HashMap<>();
            data.put("user", user);
            data.put("sessionId", session.getId());
            data.put("token", "FEASTORA-AUTH-" + session.getId());

            JsonUtil.sendSuccess(resp, data, "Welcome back, " + user.getFullName() + "!");
        } catch (IllegalStateException e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_FORBIDDEN, e.getMessage());
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Login error: " + e.getMessage());
        }
    }

    private void handleRegister(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            JsonObject json = JsonUtil.fromJson(req, JsonObject.class);
            if (json == null || !json.has("email") || !json.has("password") || !json.has("fullName")) {
                JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Full name, email and password are required.");
                return;
            }

            String fullName = json.get("fullName").getAsString();
            String email = json.get("email").getAsString();
            String password = json.get("password").getAsString();
            String phone = json.has("phone") ? json.get("phone").getAsString() : null;

            User user = authService.registerCustomer(fullName, email, phone, password);

            HttpSession session = req.getSession(true);
            session.setAttribute(AppConfig.SESSION_USER_KEY, user);
            session.setAttribute(AppConfig.SESSION_ROLE_KEY, "CUSTOMER");

            Map<String, Object> data = new HashMap<>();
            data.put("user", user);
            data.put("sessionId", session.getId());

            JsonUtil.sendSuccess(resp, data, "Registration successful! Welcome to FEASTORA.");
        } catch (IllegalArgumentException e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Registration error: " + e.getMessage());
        }
    }

    private void handleGetMe(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession(false);
        User user = session != null ? (User) session.getAttribute(AppConfig.SESSION_USER_KEY) : null;
        if (user != null) {
            JsonUtil.sendSuccess(resp, user, "Authenticated profile retrieved");
        } else {
            JsonUtil.sendError(resp, HttpServletResponse.SC_UNAUTHORIZED, "No active session");
        }
    }

    private void handleLogout(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        JsonUtil.sendSuccess(resp, null, "Logged out successfully");
    }

    private void handleChangePassword(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession(false);
        User user = session != null ? (User) session.getAttribute(AppConfig.SESSION_USER_KEY) : null;
        if (user == null) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_UNAUTHORIZED, "Authentication required");
            return;
        }

        try {
            JsonObject json = JsonUtil.fromJson(req, JsonObject.class);
            String currentPassword = json.get("currentPassword").getAsString();
            String newPassword = json.get("newPassword").getAsString();

            boolean changed = authService.changePassword(user.getId(), currentPassword, newPassword);
            if (changed) {
                JsonUtil.sendSuccess(resp, null, "Password updated successfully");
            } else {
                JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Could not update password");
            }
        } catch (IllegalArgumentException e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        }
    }
}
