package com.feastora.model;

import java.math.BigDecimal;
import java.sql.Timestamp;

public class Payment {
    private Long id;
    private Long orderId;
    private String orderNumber;
    private String paymentMethod;
    private BigDecimal amount;
    private String transactionId;
    private String upiReference;
    private String paymentStatus;
    private Long verifiedByAdminId;
    private String verifiedByAdminName;
    private Timestamp verifiedAt;
    private String refundStatus;
    private BigDecimal refundAmount;
    private Timestamp createdAt;

    public Payment() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public String getUpiReference() { return upiReference; }
    public void setUpiReference(String upiReference) { this.upiReference = upiReference; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public Long getVerifiedByAdminId() { return verifiedByAdminId; }
    public void setVerifiedByAdminId(Long verifiedByAdminId) { this.verifiedByAdminId = verifiedByAdminId; }

    public String getVerifiedByAdminName() { return verifiedByAdminName; }
    public void setVerifiedByAdminName(String verifiedByAdminName) { this.verifiedByAdminName = verifiedByAdminName; }

    public Timestamp getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(Timestamp verifiedAt) { this.verifiedAt = verifiedAt; }

    public String getRefundStatus() { return refundStatus; }
    public void setRefundStatus(String refundStatus) { this.refundStatus = refundStatus; }

    public BigDecimal getRefundAmount() { return refundAmount; }
    public void setRefundAmount(BigDecimal refundAmount) { this.refundAmount = refundAmount; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}
