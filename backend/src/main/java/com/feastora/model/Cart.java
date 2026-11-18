package com.feastora.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class Cart {
    private Long id;
    private Long userId;
    private Long restaurantId;
    private String restaurantName;
    private String sessionId;
    private List<CartItem> items = new ArrayList<>();
    private BigDecimal itemTotal = BigDecimal.ZERO;
    private BigDecimal deliveryFee = BigDecimal.ZERO;
    private BigDecimal taxAmount = BigDecimal.ZERO;
    private BigDecimal discountAmount = BigDecimal.ZERO;
    private String couponCode;
    private BigDecimal grandTotal = BigDecimal.ZERO;

    public Cart() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getRestaurantId() { return restaurantId; }
    public void setRestaurantId(Long restaurantId) { this.restaurantId = restaurantId; }

    public String getRestaurantName() { return restaurantName; }
    public void setRestaurantName(String restaurantName) { this.restaurantName = restaurantName; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public List<CartItem> getItems() { return items; }
    public void setItems(List<CartItem> items) { this.items = items; }

    public BigDecimal getItemTotal() { return itemTotal; }
    public void setItemTotal(BigDecimal itemTotal) { this.itemTotal = itemTotal; }

    public BigDecimal getDeliveryFee() { return deliveryFee; }
    public void setDeliveryFee(BigDecimal deliveryFee) { this.deliveryFee = deliveryFee; }

    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }

    public BigDecimal getGrandTotal() { return grandTotal; }
    public void setGrandTotal(BigDecimal grandTotal) { this.grandTotal = grandTotal; }

    public void recalculateTotals() {
        BigDecimal sum = BigDecimal.ZERO;
        for (CartItem item : items) {
            BigDecimal lineTotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            item.setSubtotal(lineTotal);
            sum = sum.add(lineTotal);
        }
        this.itemTotal = sum;
        // 5% GST standard restaurant tax
        this.taxAmount = this.itemTotal.multiply(new BigDecimal("0.05")).setScale(2, java.math.RoundingMode.HALF_UP);
        if (this.deliveryFee == null) {
            this.deliveryFee = new BigDecimal("35.00");
        }
        if (this.discountAmount == null) {
            this.discountAmount = BigDecimal.ZERO;
        }
        this.grandTotal = this.itemTotal.add(this.deliveryFee).add(this.taxAmount).subtract(this.discountAmount);
        if (this.grandTotal.compareTo(BigDecimal.ZERO) < 0) {
            this.grandTotal = BigDecimal.ZERO;
        }
    }
}
