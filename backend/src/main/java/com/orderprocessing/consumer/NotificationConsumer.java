package com.orderprocessing.consumer;

import com.orderprocessing.model.Order;
import com.orderprocessing.model.OrderEvent;
import com.orderprocessing.service.InventoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

/**
 * Notification Consumer.
 * Listens to the same topic 'orders' under a separate consumer group 'notification-group'.
 * Demonstrates Apache Kafka's publish-subscribe pattern:
 * Multiple consumer groups independently receive and process the exact same message.
 *
 * When a message is received:
 * Prints required viva logs:
 * - Customer name
 * - Order confirmed
 * - Product
 * - Quantity
 * - Timestamp
 */
@Service
public class NotificationConsumer {

    private static final Logger log = LoggerFactory.getLogger(NotificationConsumer.class);
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm:ss");

    private final InventoryService inventoryService;

    public NotificationConsumer(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @KafkaListener(topics = "${app.kafka.topic:orders}", groupId = "notification-group")
    public void consume(Order order) {
        // 1. Print required logs
        log.info("******************************************************************");
        log.info("[NOTIFICATION CONSUMER] Customer name: {}", order.getCustomerName());
        log.info("[NOTIFICATION CONSUMER] Order confirmed: {}", order.getOrderId());
        log.info("[NOTIFICATION CONSUMER] Product: {}", order.getProduct());
        log.info("[NOTIFICATION CONSUMER] Quantity: {}", order.getQuantity());
        log.info("[NOTIFICATION CONSUMER] Timestamp: {}", order.getTimestamp());
        log.info("******************************************************************");

        // 2. Build WhatsApp Click to Chat URL (wa.me)
        String cleanPhone = (order.getPhoneNumber() != null) ? order.getPhoneNumber().replaceAll("[^0-9]", "") : "";
        String msgText = "Hi " + order.getCustomerName() + "! Your order " + order.getOrderId()
                + " for " + order.getQuantity() + "x " + order.getProduct()
                + " has been confirmed! Timestamp: " + order.getTimestamp()
                + ". Thank you for shopping with us!";
        String encodedText;
        try {
            encodedText = java.net.URLEncoder.encode(msgText, java.nio.charset.StandardCharsets.UTF_8.toString());
        } catch (Exception e) {
            encodedText = msgText.replace(" ", "%20");
        }
        String whatsappUrl = cleanPhone.isEmpty()
                ? "https://wa.me/?text=" + encodedText
                : "https://wa.me/" + cleanPhone + "?text=" + encodedText;
        order.setWhatsappUrl(whatsappUrl);

        log.info("[NOTIFICATION CONSUMER] WhatsApp Click to Chat link generated: {}", whatsappUrl);

        // 3. Append notification event to in-memory feed for the live dashboard
        OrderEvent event = new OrderEvent(
                UUID.randomUUID().toString(),
                LocalDateTime.now().format(TIME_FORMATTER),
                "NOTIFICATION_CONSUMER",
                "notification-group",
                order.getOrderId(),
                "Order confirmed for " + order.getCustomerName() + ". WhatsApp Click-to-Chat notification ready.",
                order.getProduct(),
                order.getQuantity(),
                -1,
                "green",
                whatsappUrl
        );
        inventoryService.addEvent(event);
    }
}
