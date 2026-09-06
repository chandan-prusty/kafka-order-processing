package com.orderprocessing;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for Real-Time Order Processing System using Apache Kafka.
 *
 * Demonstrates:
 * 1. Kafka Producer: OrderController & OrderProducer
 * 2. Topic: 'orders'
 * 3. Consumer 1: InventoryConsumer (reduces stock)
 * 4. Consumer 2: NotificationConsumer (sends order confirmation)
 * 5. In-Memory Store: ConcurrentHashMap & CopyOnWriteArrayList
 */
@SpringBootApplication
public class OrderProcessingApplication {

    private static final Logger log = LoggerFactory.getLogger(OrderProcessingApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(OrderProcessingApplication.class, args);
        log.info("=================================================================================");
        log.info("🚀 KAFKA ORDER PROCESSING SYSTEM IS RUNNING ON http://localhost:8080");
        log.info("📡 Kafka Topic: 'orders'");
        log.info("📦 In-Memory Inventory initialized with Office Chair, Sofa, Table, Study Chair");
        log.info("=================================================================================");
    }
}
