package com.feastora.model;

import java.math.BigDecimal;
import java.sql.Timestamp;

public class InventoryItem {
    private Long id;
    private Long foodItemId;
    private String foodName;
    private String restaurantName;
    private BigDecimal price;
    private Integer initialStock;
    private Integer soldQuantity;
    private Integer currentStock;
    private Integer lowStockThreshold;
    private Boolean isLowStock;
    private Boolean isOutOfStock;
    private Timestamp lastRestockedAt;

    public InventoryItem() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFoodItemId() { return foodItemId; }
    public void setFoodItemId(Long foodItemId) { this.foodItemId = foodItemId; }

    public String getFoodName() { return foodName; }
    public void setFoodName(String foodName) { this.foodName = foodName; }

    public String getRestaurantName() { return restaurantName; }
    public void setRestaurantName(String restaurantName) { this.restaurantName = restaurantName; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getInitialStock() { return initialStock; }
    public void setInitialStock(Integer initialStock) { this.initialStock = initialStock; }

    public Integer getSoldQuantity() { return soldQuantity; }
    public void setSoldQuantity(Integer soldQuantity) { this.soldQuantity = soldQuantity; }

    public Integer getCurrentStock() { return currentStock; }
    public void setCurrentStock(Integer currentStock) {
        this.currentStock = currentStock;
        checkStockAlerts();
    }

    public Integer getLowStockThreshold() { return lowStockThreshold; }
    public void setLowStockThreshold(Integer lowStockThreshold) {
        this.lowStockThreshold = lowStockThreshold;
        checkStockAlerts();
    }

    public Boolean getIsLowStock() { return isLowStock; }
    public Boolean getIsOutOfStock() { return isOutOfStock; }

    public Timestamp getLastRestockedAt() { return lastRestockedAt; }
    public void setLastRestockedAt(Timestamp lastRestockedAt) { this.lastRestockedAt = lastRestockedAt; }

    private void checkStockAlerts() {
        if (currentStock == null) return;
        this.isOutOfStock = currentStock <= 0;
        int threshold = lowStockThreshold != null ? lowStockThreshold : 10;
        this.isLowStock = currentStock > 0 && currentStock <= threshold;
    }
}
