package com.orderprocessing.controller;

import com.orderprocessing.model.Order;
import com.orderprocessing.model.OrderEvent;
import com.orderprocessing.producer.OrderProducer;
import com.orderprocessing.service.InventoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * REST Controller exposing order endpoints and dashboard metrics.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class OrderController {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final OrderProducer orderProducer;
    private final InventoryService inventoryService;

    public OrderController(OrderProducer orderProducer, InventoryService inventoryService) {
        this.orderProducer = orderProducer;
        this.inventoryService = inventoryService;
    }

    /**
     * POST /api/orders
     * Step 1: Generate an Order ID.
     * Step 2: Add timestamp.
     * Step 3: Publish the order JSON to Kafka topic named 'orders'.
     * Step 4: Return success response.
     */
    @PostMapping("/orders")
    public ResponseEntity<Map<String, Object>> placeOrder(@RequestBody Order orderRequest) {
        // Validate request
        if (orderRequest.getCustomerName() == null || orderRequest.getCustomerName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Customer name is required"));
        }
        if (orderRequest.getProduct() == null || orderRequest.getProduct().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Product is required"));
        }
        if (orderRequest.getQuantity() <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Quantity must be greater than 0"));
        }

        // 1. Generate Order ID (e.g., ORD-7821)
        int randomId = 1000 + new Random().nextInt(9000);
        String orderId = "ORD-" + randomId;
        orderRequest.setOrderId(orderId);

        // 2. Add timestamp
        String timestamp = LocalDateTime.now().format(FORMATTER);
        orderRequest.setTimestamp(timestamp);
        orderRequest.setStatus("PLACED");

        // Format WhatsApp Click to Chat URL
        String cleanPhone = (orderRequest.getPhoneNumber() != null) ? orderRequest.getPhoneNumber().replaceAll("[^0-9]", "") : "";
        String msgText = "Hi " + orderRequest.getCustomerName() + "! Your order " + orderId
                + " for " + orderRequest.getQuantity() + "x " + orderRequest.getProduct()
                + " has been placed! Thank you.";
        try {
            String encodedText = java.net.URLEncoder.encode(msgText, java.nio.charset.StandardCharsets.UTF_8.toString());
            orderRequest.setWhatsappUrl(cleanPhone.isEmpty() ? "https://wa.me/?text=" + encodedText : "https://wa.me/" + cleanPhone + "?text=" + encodedText);
        } catch (Exception ignored) {}

        // Save order to in-memory order collection
        inventoryService.addOrder(orderRequest);

        // 3. Publish the order JSON to Kafka topic named 'orders'
        orderProducer.sendOrder(orderRequest);

        // 4. Return success response
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "SUCCESS");
        response.put("message", "Order placed and published to Kafka topic 'orders'");
        response.put("order", orderRequest);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/orders
     * Returns list of all orders stored in memory.
     */
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(inventoryService.getOrders());
    }

    /**
     * GET /api/inventory
     * Returns current in-memory inventory stock.
     */
    @GetMapping("/inventory")
    public ResponseEntity<Map<String, Integer>> getInventory() {
        return ResponseEntity.ok(inventoryService.getInventory());
    }

    /**
     * GET /api/events
     * Returns real-time event feed log from Producer and Consumers.
     */
    @GetMapping("/events")
    public ResponseEntity<List<OrderEvent>> getEvents() {
        return ResponseEntity.ok(inventoryService.getEvents());
    }

    /**
     * POST /api/reset
     * Resets inventory and clear orders (useful for live viva demonstrations).
     */
    @PostMapping("/reset")
    public ResponseEntity<Map<String, String>> reset() {
        inventoryService.resetAll();
        return ResponseEntity.ok(Map.of("message", "Inventory and order history have been reset to defaults."));
    }

    /**
     * GET /api/status
     * Health check endpoint for UI connectivity badge.
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("backend", "UP");
        status.put("kafkaTopic", "orders");
        status.put("inventoryConsumers", "inventory-group");
        status.put("notificationConsumers", "notification-group");
        return ResponseEntity.ok(status);
    }
}
