package com.feastora.service;

import com.feastora.dao.UserDAO;
import com.feastora.model.User;
import com.feastora.util.SecurityUtil;

import java.sql.SQLException;
import java.sql.Timestamp;

public class AuthService {

    private final UserDAO userDAO = new UserDAO();
    private final EmailService emailService = EmailService.getInstance();

    public User authenticate(String email, String plainPassword, String ipAddress, String userAgent) {
        if (email == null || plainPassword == null) return null;

        User user = userDAO.findByEmail(email);
        if (user == null || !Boolean.TRUE.equals(user.getIsActive())) {
            return null;
        }

        // Check lockout
        if (user.getLockoutUntil() != null && user.getLockoutUntil().after(new Timestamp(System.currentTimeMillis()))) {
            throw new IllegalStateException("Account temporarily locked due to multiple failed login attempts. Please try again after 15 minutes.");
        }

        boolean matches = SecurityUtil.checkPassword(plainPassword, user.getPasswordHash());
        if (!matches) {
            userDAO.recordFailedLogin(email);
            return null;
        }

        // Reset failed login counter
        userDAO.resetFailedLogins(user.getId());

        // If admin logged in, log and dispatch email notification
        if ("ADMIN".equalsIgnoreCase(user.getRoleName()) || (user.getRoleId() != null && user.getRoleId() == 2)) {
            userDAO.logAdminLogin(user.getId(), ipAddress, userAgent, "SUCCESS");
            emailService.sendAdminLoginAlert(ipAddress, userAgent, user.getEmail());
        }

        return user;
    }

    public User registerCustomer(String fullName, String email, String phone, String plainPassword) throws SQLException {
        if (email == null || plainPassword == null || fullName == null) {
            throw new IllegalArgumentException("All fields are required");
        }

        User existing = userDAO.findByEmail(email);
        if (existing != null) {
            throw new IllegalArgumentException("An account with this email address already exists");
        }

        User newUser = new User();
        newUser.setFullName(fullName.trim());
        newUser.setEmail(email.trim().toLowerCase());
        newUser.setPhone(phone != null ? phone.trim() : null);
        newUser.setPasswordHash(SecurityUtil.hashPassword(plainPassword));
        newUser.setRoleId(1); // CUSTOMER
        newUser.setIsActive(true);
        newUser.setAvatarUrl("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80");

        return userDAO.create(newUser);
    }

    public boolean changePassword(Long userId, String currentPassword, String newPassword) {
        User user = userDAO.findById(userId);
        if (user == null) return false;

        if (!SecurityUtil.checkPassword(currentPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        String newHash = SecurityUtil.hashPassword(newPassword);
        return userDAO.updatePassword(userId, newHash);
    }
}
