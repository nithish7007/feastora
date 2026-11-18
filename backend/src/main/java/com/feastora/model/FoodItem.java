package com.feastora.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class FoodItem {
    private Long id;
    private Long restaurantId;
    private String restaurantName;
    private Integer categoryId;
    private String categoryName;
    private String name;
    private String description;
    private String imageUrl;
    private BigDecimal price;
    private Integer discountPercentage;
    private Boolean isVeg;
    private Boolean isAvailable;
    private Boolean isBestseller;
    private Integer stockQuantity;
    private Integer preparationTimeMin;
    private List<FoodCustomization> customizations = new ArrayList<>();

    public FoodItem() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getRestaurantId() { return restaurantId; }
    public void setRestaurantId(Long restaurantId) { this.restaurantId = restaurantId; }

    public String getRestaurantName() { return restaurantName; }
    public void setRestaurantName(String restaurantName) { this.restaurantName = restaurantName; }

    public Integer getCategoryId() { return categoryId; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getDiscountPercentage() { return discountPercentage; }
    public void setDiscountPercentage(Integer discountPercentage) { this.discountPercentage = discountPercentage; }

    public Boolean getIsVeg() { return isVeg; }
    public void setIsVeg(Boolean veg) { isVeg = veg; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean available) { isAvailable = available; }

    public Boolean getIsBestseller() { return isBestseller; }
    public void setIsBestseller(Boolean bestseller) { isBestseller = bestseller; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

    public Integer getPreparationTimeMin() { return preparationTimeMin; }
    public void setPreparationTimeMin(Integer preparationTimeMin) { this.preparationTimeMin = preparationTimeMin; }

    public List<FoodCustomization> getCustomizations() { return customizations; }
    public void setCustomizations(List<FoodCustomization> customizations) { this.customizations = customizations; }
}
