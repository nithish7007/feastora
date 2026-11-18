package com.feastora.service;

import com.feastora.config.AppConfig;
import com.feastora.config.DatabaseConfig;
import com.feastora.model.Order;
import com.feastora.model.Payment;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * JavaMail SMTP Service for sending Admin Email Alerts.
 * Failure-safe: never throws uncaught exceptions to caller.
 */
public class EmailService {

    private static final Logger LOGGER = Logger.getLogger(EmailService.class.getName());
    private static final EmailService INSTANCE = new EmailService();
    private final ExecutorService executor = Executors.newFixedThreadPool(3);
    private Properties mailProperties = new Properties();
    private String smtpUsername;
    private String smtpPassword;
    private String adminRecipient;

    private EmailService() {
        initMailSettings();
    }

    public static EmailService getInstance() {
        return INSTANCE;
    }

    private void initMailSettings() {
        try (InputStream input = EmailService.class.getClassLoader().getResourceAsStream("email.properties")) {
            if (input != null) {
                mailProperties.load(input);
            }
        } catch (Exception e) {
            LOGGER.log(Level.WARNING, "Failed to load email.properties", e);
        }

        this.adminRecipient = System.getenv("ADMIN_NOTIFICATION_EMAIL");
        if (this.adminRecipient == null || this.adminRecipient.isEmpty()) {
            this.adminRecipient = mailProperties.getProperty("mail.admin.recipient", AppConfig.ADMIN_NOTIFICATION_EMAIL);
        }

        this.smtpUsername = System.getenv("SMTP_USERNAME");
        if (this.smtpUsername == null || this.smtpUsername.isEmpty()) {
            this.smtpUsername = mailProperties.getProperty("mail.smtp.username", "s.ten8hs9698@gmail.com");
        }

        this.smtpPassword = System.getenv("SMTP_PASSWORD");
        if (this.smtpPassword == null) {
            this.smtpPassword = mailProperties.getProperty("mail.smtp.password", "");
        }
    }

    /**
     * Sends Admin Login Alert
     */
    public void sendAdminLoginAlert(String ipAddress, String userAgent, String adminEmail) {
        String subject = "FEASTORA - Admin Login Alert";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss z");
        String currentTime = sdf.format(new Date());

        String body = "An administrator has successfully logged into the FEASTORA dashboard.\n\n" +
                "Admin Account: " + (adminEmail != null ? adminEmail : "admin@feastora.com") + "\n" +
                "Login Time: " + currentTime + "\n" +
                "IP Address: " + (ipAddress != null ? ipAddress : "127.0.0.1") + "\n" +
                "User Agent: " + (userAgent != null ? userAgent : "Unknown Browser") + "\n\n" +
                "If this was not authorized by you, please secure your server immediately.\n" +
                "-- FEASTORA Security Engine";

        sendAsync(this.adminRecipient, subject, body);
    }

    /**
     * Sends New Order Alert
     */
    public void sendNewOrderNotification(Order order) {
        String subject = "FEASTORA - New Order Placed #" + order.getOrderNumber();
        String body = "A new delicious order has been received on FEASTORA!\n\n" +
                "Order Number: " + order.getOrderNumber() + "\n" +
                "Customer: " + order.getCustomerName() + " (" + order.getCustomerPhone() + ")\n" +
                "Restaurant: " + order.getRestaurantName() + "\n" +
                "Delivery Address: " + order.getDeliveryAddressText() + "\n" +
                "Total Items Amount: ₹" + order.getTotalItemAmount() + "\n" +
                "Grand Total: ₹" + order.getGrandTotal() + "\n" +
                "Payment Method: " + order.getPaymentMethod() + " (" + order.getPaymentStatus() + ")\n\n" +
                "Manage this order on the Admin Dashboard: http://localhost:5173/admin\n" +
                "-- FEASTORA Automated Notifications";

        sendAsync(this.adminRecipient, subject, body);
    }

    /**
     * Sends Payment Received Alert
     */
    public void sendPaymentReceivedNotification(Payment payment, Order order) {
        String subject = "FEASTORA - Payment Received for Order #" + (order != null ? order.getOrderNumber() : payment.getOrderId());
        String body = "Payment has been processed for order:\n\n" +
                "Payment Method: " + payment.getPaymentMethod() + "\n" +
                "Amount: ₹" + payment.getAmount() + "\n" +
                "Transaction / UTR Reference: " + (payment.getUpiReference() != null ? payment.getUpiReference() : payment.getTransactionId()) + "\n" +
                "Status: " + payment.getPaymentStatus() + "\n\n" +
                "-- FEASTORA Payment Dispatcher";

        sendAsync(this.adminRecipient, subject, body);
    }

    /**
     * Sends Order Cancelled Alert
     */
    public void sendOrderCancelledNotification(Order order, String reason) {
        String subject = "FEASTORA - Order Cancelled #" + order.getOrderNumber();
        String body = "An order has been cancelled on FEASTORA.\n\n" +
                "Order Number: " + order.getOrderNumber() + "\n" +
                "Customer: " + order.getCustomerName() + "\n" +
                "Grand Total: ₹" + order.getGrandTotal() + "\n" +
                "Cancellation Reason: " + (reason != null ? reason : "Customer / Admin Request") + "\n\n" +
                "Stock has been restored automatically in inventory.\n" +
                "-- FEASTORA Order Operations";

        sendAsync(this.adminRecipient, subject, body);
    }

    private void sendAsync(String recipient, String subject, String body) {
        executor.submit(() -> {
            boolean success = false;
            String errorMessage = null;

            try {
                // If password is blank, log safely in database and console without crashing
                if (smtpPassword == null || smtpPassword.trim().isEmpty()) {
                    LOGGER.info("[Email Simulation] SMTP password not set in environment. Notification logged: Subject: '" + subject + "' to: " + recipient);
                    saveNotificationLog(recipient, subject, body, "SENT_SIMULATED", null);
                    return;
                }

                Session session = Session.getInstance(mailProperties, new Authenticator() {
                    @Override
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(smtpUsername, smtpPassword);
                    }
                });

                Message message = new MimeMessage(session);
                message.setFrom(new InternetAddress(smtpUsername, "FEASTORA Orders"));
                message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(recipient));
                message.setSubject(subject);
                message.setText(body);

                Transport.send(message);
                success = true;
                LOGGER.info("Email alert successfully sent to " + recipient + " [" + subject + "]");
            } catch (Exception e) {
                errorMessage = e.getMessage();
                LOGGER.log(Level.WARNING, "Failed to deliver SMTP email: " + e.getMessage());
            } finally {
                saveNotificationLog(recipient, subject, body, success ? "SENT" : "FAILED", errorMessage);
            }
        });
    }

    private void saveNotificationLog(String recipient, String subject, String body, String status, String error) {
        String sql = "INSERT INTO email_notifications (recipient_email, subject, body, status, sent_at, error_message) VALUES (?, ?, ?, ?, NOW(), ?)";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, recipient);
            ps.setString(2, subject);
            ps.setString(3, body);
            ps.setString(4, status);
            ps.setString(5, error);
            ps.executeUpdate();
        } catch (SQLException e) {
            LOGGER.log(Level.FINE, "Error recording email notification log to DB: " + e.getMessage());
        }
    }
}
