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
 * Inventory Consumer.
 * Listens to topic 'orders' under consumer group 'inventory-group'.
 * When an order message arrives:
 * 1. Deducts quantity from in-memory inventory.
 * 2. Prints required viva logs (Order received, Product, Quantity, Remaining stock).
 */
@Service
public class InventoryConsumer {

    private static final Logger log = LoggerFactory.getLogger(InventoryConsumer.class);
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm:ss");

    private final InventoryService inventoryService;

    public InventoryConsumer(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @KafkaListener(topics = "${app.kafka.topic:orders}", groupId = "inventory-group")
    public void consume(Order order) {
        // 1. Deduct stock from in-memory inventory
        int remainingStock = inventoryService.deductStock(order.getProduct(), order.getQuantity());

        // 2. Print required logs
        log.info("------------------------------------------------------------------");
        log.info("[INVENTORY CONSUMER] Order received: {}", order.getOrderId());
        log.info("[INVENTORY CONSUMER] Product: {}", order.getProduct());
        log.info("[INVENTORY CONSUMER] Quantity: {}", order.getQuantity());
        log.info("[INVENTORY CONSUMER] Remaining stock: {}", remainingStock);
        log.info("------------------------------------------------------------------");

        // 3. Append to in-memory event feed for the live dashboard
        OrderEvent event = new OrderEvent(
                UUID.randomUUID().toString(),
                LocalDateTime.now().format(TIME_FORMATTER),
                "INVENTORY_CONSUMER",
                "inventory-group",
                order.getOrderId(),
                "Stock reduced by " + order.getQuantity() + " units for '" + order.getProduct() + "'. Remaining: " + remainingStock,
                order.getProduct(),
                order.getQuantity(),
                remainingStock,
                "blue"
        );
        inventoryService.addEvent(event);
    }
}
