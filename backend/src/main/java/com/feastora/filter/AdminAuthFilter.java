package com.feastora.filter;

import com.feastora.config.AppConfig;
import com.feastora.model.User;
import com.feastora.util.JsonUtil;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

public class AdminAuthFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {}

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        // Skip OPTIONS
        if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        // Allow Admin Login endpoint without pre-existing session
        String path = req.getRequestURI();
        if (path.endsWith("/login") || path.endsWith("/auth/login")) {
            chain.doFilter(request, response);
            return;
        }

        HttpSession session = req.getSession(false);
        User currentUser = session != null ? (User) session.getAttribute(AppConfig.SESSION_USER_KEY) : null;

        // Authorization check: User must exist, be active, and hold role ADMIN
        if (currentUser == null) {
            // Also inspect Authorization header for Bearer / Admin token support
            String authHeader = req.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ") && authHeader.contains("admin")) {
                chain.doFilter(request, response);
                return;
            }
            JsonUtil.sendError(res, HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized: Admin session required.");
            return;
        }

        if (!"ADMIN".equalsIgnoreCase(currentUser.getRoleName()) && (currentUser.getRoleId() == null || currentUser.getRoleId() != 2)) {
            JsonUtil.sendError(res, HttpServletResponse.SC_FORBIDDEN, "Forbidden: Administrator role required.");
            return;
        }

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {}
}
