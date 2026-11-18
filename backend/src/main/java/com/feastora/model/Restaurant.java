package com.feastora.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class Restaurant {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String imageUrl;
    private String bannerUrl;
    private String location;
    private String city;
    private String address;
    private BigDecimal rating;
    private Integer ratingCount;
    private Integer deliveryTimeMin;
    private Integer deliveryTimeMax;
    private String cuisine;
    private BigDecimal deliveryFee;
    private BigDecimal costForTwo;
    private String openingTime;
    private String closingTime;
    private Boolean isOpen;
    private Boolean isFeatured;
    private List<FoodItem> menu = new ArrayList<>();

    public Restaurant() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getBannerUrl() { return bannerUrl; }
    public void setBannerUrl(String bannerUrl) { this.bannerUrl = bannerUrl; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public Integer getRatingCount() { return ratingCount; }
    public void setRatingCount(Integer ratingCount) { this.ratingCount = ratingCount; }

    public Integer getDeliveryTimeMin() { return deliveryTimeMin; }
    public void setDeliveryTimeMin(Integer deliveryTimeMin) { this.deliveryTimeMin = deliveryTimeMin; }

    public Integer getDeliveryTimeMax() { return deliveryTimeMax; }
    public void setDeliveryTimeMax(Integer deliveryTimeMax) { this.deliveryTimeMax = deliveryTimeMax; }

    public String getCuisine() { return cuisine; }
    public void setCuisine(String cuisine) { this.cuisine = cuisine; }

    public BigDecimal getDeliveryFee() { return deliveryFee; }
    public void setDeliveryFee(BigDecimal deliveryFee) { this.deliveryFee = deliveryFee; }

    public BigDecimal getCostForTwo() { return costForTwo; }
    public void setCostForTwo(BigDecimal costForTwo) { this.costForTwo = costForTwo; }

    public String getOpeningTime() { return openingTime; }
    public void setOpeningTime(String openingTime) { this.openingTime = openingTime; }

    public String getClosingTime() { return closingTime; }
    public void setClosingTime(String closingTime) { this.closingTime = closingTime; }

    public Boolean getIsOpen() { return isOpen; }
    public void setIsOpen(Boolean open) { isOpen = open; }

    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean featured) { isFeatured = featured; }

    public List<FoodItem> getMenu() { return menu; }
    public void setMenu(List<FoodItem> menu) { this.menu = menu; }
}
