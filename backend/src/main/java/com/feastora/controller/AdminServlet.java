package com.feastora.controller;

import com.feastora.dao.*;
import com.feastora.model.InventoryItem;
import com.feastora.model.Order;
import com.feastora.model.Payment;
import com.feastora.util.JsonUtil;
import com.google.gson.JsonObject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/api/admin/*")
public class AdminServlet extends HttpServlet {

    private final ReportDAO reportDAO = new ReportDAO();
    private final OrderDAO orderDAO = new OrderDAO();
    private final InventoryDAO inventoryDAO = new InventoryDAO();
    private final PaymentDAO paymentDAO = new PaymentDAO();
    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || "/dashboard".equals(pathInfo)) {
            handleDashboard(req, resp);
        } else if ("/orders".equals(pathInfo)) {
            handleOrders(req, resp);
        } else if ("/inventory".equals(pathInfo)) {
            handleInventory(req, resp);
        } else if ("/payments".equals(pathInfo)) {
            handlePayments(req, resp);
        } else if ("/payment-settings".equals(pathInfo)) {
            handleGetPaymentSettings(req, resp);
        } else if ("/customers".equals(pathInfo)) {
            handleCustomers(req, resp);
        } else if ("/reports/csv".equals(pathInfo)) {
            handleCsvExport(req, resp);
        } else {
            JsonUtil.sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Admin endpoint not found");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        if (pathInfo != null && pathInfo.contains("/verify-payment")) {
            handleVerifyPayment(req, resp);
        } else if (pathInfo != null && pathInfo.contains("/assign-partner")) {
            handleAssignPartner(req, resp);
        } else {
            JsonUtil.sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Admin action not found");
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        if ("/payment-settings".equals(pathInfo)) {
            handleUpdatePaymentSettings(req, resp);
        } else if (pathInfo != null && pathInfo.startsWith("/inventory/restock")) {
            handleRestock(req, resp);
        } else if (pathInfo != null && pathInfo.contains("/status")) {
            handleUpdateOrderStatus(req, resp);
        } else {
            JsonUtil.sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Admin update endpoint not found");
        }
    }

    private void handleDashboard(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        Map<String, Object> data = new HashMap<>();
        data.put("kpis", reportDAO.getDashboardKPIs());
        data.put("salesChart", reportDAO.getSalesChartData());
        data.put("bestsellers", reportDAO.getBestSellingDishes(5));
        JsonUtil.sendSuccess(resp, data, "Admin dashboard metrics retrieved");
    }

    private void handleOrders(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String status = req.getParameter("status");
        List<Order> list = orderDAO.getAllOrdersAdmin(status);
        JsonUtil.sendSuccess(resp, list, "Admin orders list retrieved");
    }

    private void handleInventory(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        List<InventoryItem> list = inventoryDAO.getAllInventory();
        JsonUtil.sendSuccess(resp, list, "Inventory and stock metrics retrieved");
    }

    private void handlePayments(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        List<Payment> list = paymentDAO.getAllPayments();
        JsonUtil.sendSuccess(resp, list, "Payment history retrieved");
    }

    private void handleGetPaymentSettings(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        Map<String, String> settings = paymentDAO.getPaymentSettings();
        JsonUtil.sendSuccess(resp, settings, "Payment settings retrieved");
    }

    private void handleUpdatePaymentSettings(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        JsonObject json = JsonUtil.fromJson(req, JsonObject.class);
        if (json != null) {
            for (String key : json.keySet()) {
                paymentDAO.updateSetting(key, json.get(key).getAsString());
            }
        }
        Map<String, String> settings = paymentDAO.getPaymentSettings();
        JsonUtil.sendSuccess(resp, settings, "Payment settings updated successfully");
    }

    private void handleCustomers(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        List<Map<String, Object>> customers = userDAO.getAllCustomers();
        JsonUtil.sendSuccess(resp, customers, "Customer accounts list retrieved");
    }

    private void handleVerifyPayment(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        JsonObject json = JsonUtil.fromJson(req, JsonObject.class);
        Long paymentId = json.get("paymentId").getAsLong();
        boolean approve = json.get("approve").getAsBoolean();
        boolean verified = paymentDAO.verifyUpiPayment(paymentId, 1L, approve);
        if (verified) {
            JsonUtil.sendSuccess(resp, null, approve ? "UPI Payment verified successfully!" : "Payment marked as rejected.");
        } else {
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Could not verify payment");
        }
    }

    private void handleUpdateOrderStatus(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        JsonObject json = JsonUtil.fromJson(req, JsonObject.class);
        Long orderId = json.get("orderId").getAsLong();
        String status = json.get("status").getAsString();
        String comment = json.has("comment") ? json.get("comment").getAsString() : "Status updated by Admin";

        boolean updated = orderDAO.updateOrderStatus(orderId, status, comment, 1L);
        if (updated) {
            JsonUtil.sendSuccess(resp, null, "Order status transitioned to: " + status);
        } else {
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Could not update order status");
        }
    }

    private void handleAssignPartner(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        JsonObject json = JsonUtil.fromJson(req, JsonObject.class);
        Long orderId = json.get("orderId").getAsLong();
        Long partnerId = json.get("partnerId").getAsLong();
        boolean assigned = orderDAO.assignDeliveryPartner(orderId, partnerId);
        if (assigned) {
            JsonUtil.sendSuccess(resp, null, "Delivery partner assigned successfully");
        } else {
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Could not assign delivery partner");
        }
    }

    private void handleRestock(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        JsonObject json = JsonUtil.fromJson(req, JsonObject.class);
        Long foodItemId = json.get("foodItemId").getAsLong();
        int stock = json.get("stock").getAsInt();
        boolean restocked = inventoryDAO.updateStock(foodItemId, stock);
        if (restocked) {
            JsonUtil.sendSuccess(resp, null, "Stock restocked successfully");
        } else {
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Failed to restock");
        }
    }

    private void handleCsvExport(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/csv");
        resp.setHeader("Content-Disposition", "attachment; filename=\"feastora_orders_report.csv\"");
        List<Order> orders = orderDAO.getAllOrdersAdmin("ALL");

        try (PrintWriter writer = resp.getWriter()) {
            writer.println("Order Number,Customer Name,Customer Phone,Restaurant,Amount,Delivery Fee,Tax,Grand Total,Payment Method,Payment Status,Order Status,Date");
            for (Order o : orders) {
                writer.printf("\"%s\",\"%s\",\"%s\",\"%s\",%.2f,%.2f,%.2f,%.2f,\"%s\",\"%s\",\"%s\",\"%s\"%n",
                        o.getOrderNumber(),
                        o.getCustomerName() != null ? o.getCustomerName() : "",
                        o.getCustomerPhone() != null ? o.getCustomerPhone() : "",
                        o.getRestaurantName() != null ? o.getRestaurantName() : "",
                        o.getTotalItemAmount(),
                        o.getDeliveryFee(),
                        o.getTaxAmount(),
                        o.getGrandTotal(),
                        o.getPaymentMethod(),
                        o.getPaymentStatus(),
                        o.getOrderStatus(),
                        o.getCreatedAt());
            }
            writer.flush();
        }
    }
}
