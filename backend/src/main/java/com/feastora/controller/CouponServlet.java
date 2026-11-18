package com.feastora.controller;

import com.feastora.dao.CouponDAO;
import com.feastora.model.Coupon;
import com.feastora.util.JsonUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/api/coupons/*")
public class CouponServlet extends HttpServlet {

    private final CouponDAO couponDAO = new CouponDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String code = req.getParameter("code");
        String amountStr = req.getParameter("amount");

        if (code == null || code.trim().isEmpty()) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Coupon code is required");
            return;
        }

        Coupon coupon = couponDAO.findByCode(code);
        if (coupon == null) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Invalid or expired coupon code");
            return;
        }

        BigDecimal amount = amountStr != null ? new BigDecimal(amountStr) : BigDecimal.ZERO;
        if (coupon.getMinOrderValue() != null && amount.compareTo(coupon.getMinOrderValue()) < 0) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST,
                    "Coupon requires a minimum order amount of ₹" + coupon.getMinOrderValue());
            return;
        }

        BigDecimal discount = couponDAO.calculateDiscount(coupon, amount);

        Map<String, Object> result = new HashMap<>();
        result.put("coupon", coupon);
        result.put("discountAmount", discount);
        result.put("finalAmount", amount.subtract(discount));

        JsonUtil.sendSuccess(resp, result, "Coupon applied successfully!");
    }
}
