package com.orderprocessing.service;

import com.orderprocessing.model.Order;
import com.orderprocessing.model.OrderEvent;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * In-Memory Service storing:
 * 1. Inventory counts using HashMap (ConcurrentHashMap for thread safety).
 * 2. Orders list using ArrayList (CopyOnWriteArrayList).
 * 3. Event feed history using ArrayList for real-time dashboard updates.
 */
@Service
public class InventoryService {

    // In-memory inventory map: Product Name -> Stock count
    private final Map<String, Integer> inventory = new ConcurrentHashMap<>();

    // In-memory list storing all orders placed
    private final List<Order> orders = new CopyOnWriteArrayList<>();

    // In-memory list storing all Kafka producer and consumer events
    private final List<OrderEvent> events = new CopyOnWriteArrayList<>();

    public InventoryService() {
        initDefaults();
    }

    /**
     * Initializes default stock for products.
     */
    public synchronized void initDefaults() {
        inventory.put("Office Chair", 50);
        inventory.put("Sofa", 20);
        inventory.put("Table", 30);
        inventory.put("Study Chair", 40);
    }

    /**
     * Deducts requested quantity from inventory if available.
     * Synchronized to prevent race conditions during concurrent orders.
     */
    public synchronized int deductStock(String product, int quantity) {
        int currentStock = inventory.getOrDefault(product, 0);
        int newStock = Math.max(0, currentStock - quantity);
        inventory.put(product, newStock);
        return newStock;
    }

    /**
     * Returns an unmodifiable snapshot of the current inventory.
     */
    public Map<String, Integer> getInventory() {
        return Collections.unmodifiableMap(inventory);
    }

    /**
     * Returns an unmodifiable list of all orders.
     */
    public List<Order> getOrders() {
        return Collections.unmodifiableList(orders);
    }

    /**
     * Adds an order to in-memory order history.
     */
    public void addOrder(Order order) {
        orders.add(0, order); // Add newest first
    }

    /**
     * Returns the list of recent Kafka events.
     */
    public List<OrderEvent> getEvents() {
        return Collections.unmodifiableList(events);
    }

    /**
     * Appends an event to the in-memory live feed (keeps latest 100).
     */
    public void addEvent(OrderEvent event) {
        events.add(0, event); // Add newest first
        if (events.size() > 100) {
            events.remove(events.size() - 1);
        }
    }

    /**
     * Resets inventory and clear orders/events (useful for viva demo testing).
     */
    public synchronized void resetAll() {
        orders.clear();
        events.clear();
        initDefaults();
    }
}
