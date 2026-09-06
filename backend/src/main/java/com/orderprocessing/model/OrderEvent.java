package com.orderprocessing.model;

/**
 * Represents an event logged during the lifecycle of an order:
 * Producer publication, Inventory Consumer processing, or Notification Consumer processing.
 */
public class OrderEvent {
    private String id;
    private String timestamp;
    private String source; // "PRODUCER", "INVENTORY_CONSUMER", "NOTIFICATION_CONSUMER"
    private String consumerGroup;
    private String orderId;
    private String message;
    private String product;
    private int quantity;
    private int remainingStock;
    private String badgeColor; // "orange", "blue", "green"
    private String whatsappUrl;

    public OrderEvent() {
    }

    public OrderEvent(String id, String timestamp, String source, String consumerGroup,
                      String orderId, String message, String product, int quantity,
                      int remainingStock, String badgeColor) {
        this(id, timestamp, source, consumerGroup, orderId, message, product, quantity, remainingStock, badgeColor, null);
    }

    public OrderEvent(String id, String timestamp, String source, String consumerGroup,
                      String orderId, String message, String product, int quantity,
                      int remainingStock, String badgeColor, String whatsappUrl) {
        this.id = id;
        this.timestamp = timestamp;
        this.source = source;
        this.consumerGroup = consumerGroup;
        this.orderId = orderId;
        this.message = message;
        this.product = product;
        this.quantity = quantity;
        this.remainingStock = remainingStock;
        this.badgeColor = badgeColor;
        this.whatsappUrl = whatsappUrl;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getConsumerGroup() {
        return consumerGroup;
    }

    public void setConsumerGroup(String consumerGroup) {
        this.consumerGroup = consumerGroup;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getProduct() {
        return product;
    }

    public void setProduct(String product) {
        this.product = product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getRemainingStock() {
        return remainingStock;
    }

    public void setRemainingStock(int remainingStock) {
        this.remainingStock = remainingStock;
    }

    public String getBadgeColor() {
        return badgeColor;
    }

    public void setBadgeColor(String badgeColor) {
        this.badgeColor = badgeColor;
    }

    public String getWhatsappUrl() {
        return whatsappUrl;
    }

    public void setWhatsappUrl(String whatsappUrl) {
        this.whatsappUrl = whatsappUrl;
    }
}
