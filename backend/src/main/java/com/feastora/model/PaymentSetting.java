package com.feastora.model;

public class PaymentSetting {
    private Integer id;
    private String settingKey;
    private String settingValue;
    private String description;
    private Boolean isActive;

    public PaymentSetting() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getSettingKey() { return settingKey; }
    public void setSettingKey(String settingKey) { this.settingKey = settingKey; }

    public String getSettingValue() { return settingValue; }
    public void setSettingValue(String settingValue) { this.settingValue = settingValue; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }
}
