package com.feastora.controller;

import com.feastora.dao.PaymentDAO;
import com.feastora.util.JsonUtil;
import com.google.gson.JsonObject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Map;

@WebServlet("/api/payments/*")
public class PaymentServlet extends HttpServlet {

    private final PaymentDAO paymentDAO = new PaymentDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || "/config".equals(pathInfo) || "/".equals(pathInfo)) {
            Map<String, String> settings = paymentDAO.getPaymentSettings();
            JsonUtil.sendSuccess(resp, settings, "Active payment configuration");
        } else {
            JsonUtil.sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Payment endpoint not found");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        if ("/submit-upi".equals(pathInfo)) {
            JsonObject json = JsonUtil.fromJson(req, JsonObject.class);
            Long orderId = json.get("orderId").getAsLong();
            String upiRef = json.get("upiReference").getAsString();
            String txnId = json.has("transactionId") ? json.get("transactionId").getAsString() : "TXN-" + System.currentTimeMillis();

            boolean submitted = paymentDAO.submitUpiReference(orderId, upiRef, txnId);
            if (submitted) {
                JsonUtil.sendSuccess(resp, null, "UPI Reference submitted successfully for verification.");
            } else {
                JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Failed to submit UPI reference");
            }
        } else {
            JsonUtil.sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Unknown payment submission");
        }
    }
}
