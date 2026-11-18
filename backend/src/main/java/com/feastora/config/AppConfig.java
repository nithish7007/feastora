package com.feastora.config;

/**
 * Global Application Constants and Runtime Configuration for FEASTORA
 */
public class AppConfig {
    public static final String APP_NAME = "FEASTORA";
    public static final String APP_TAGLINE = "Every Craving Has a Destination.";
    public static final String ADMIN_NOTIFICATION_EMAIL = "s.ten8hs9698@gmail.com";
    public static final String SESSION_USER_KEY = "FEASTORA_CURRENT_USER";
    public static final String SESSION_ROLE_KEY = "FEASTORA_CURRENT_ROLE";

    // Rate limiting & security
    public static final int MAX_FAILED_LOGIN_ATTEMPTS = 5;
    public static final int LOCKOUT_MINUTES = 15;
}
