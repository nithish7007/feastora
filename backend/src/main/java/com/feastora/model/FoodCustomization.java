package com.feastora.model;

import java.math.BigDecimal;

public class FoodCustomization {
    private Long id;
    private Long foodItemId;
    private String name;
    private BigDecimal additionalPrice;
    private Boolean isRequired;
    private String customizationType;

    public FoodCustomization() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFoodItemId() { return foodItemId; }
    public void setFoodItemId(Long foodItemId) { this.foodItemId = foodItemId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getAdditionalPrice() { return additionalPrice; }
    public void setAdditionalPrice(BigDecimal additionalPrice) { this.additionalPrice = additionalPrice; }

    public Boolean getIsRequired() { return isRequired; }
    public void setIsRequired(Boolean required) { isRequired = required; }

    public String getCustomizationType() { return customizationType; }
    public void setCustomizationType(String customizationType) { this.customizationType = customizationType; }
}
