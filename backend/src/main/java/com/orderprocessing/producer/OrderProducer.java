package com.orderprocessing.producer;

import com.orderprocessing.model.Order;
import com.orderprocessing.model.OrderEvent;
import com.orderprocessing.service.InventoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

/**
 * Kafka Producer Service.
 * Publishes the complete Order object as a JSON message to the Kafka topic 'orders'.
 */
@Service
public class OrderProducer {

    private static final Logger log = LoggerFactory.getLogger(OrderProducer.class);
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm:ss");

    @Value("${app.kafka.topic:orders}")
    private String topicName;

    private final KafkaTemplate<String, Order> kafkaTemplate;
    private final InventoryService inventoryService;

    public OrderProducer(KafkaTemplate<String, Order> kafkaTemplate, InventoryService inventoryService) {
        this.kafkaTemplate = kafkaTemplate;
        this.inventoryService = inventoryService;
    }

    /**
     * Sends the complete order object to the Kafka topic.
     *
     * @param order The order to publish
     */
    public void sendOrder(Order order) {
        log.info("==================================================================");
        log.info("[KAFKA PRODUCER] Sending Order to topic '{}': {}", topicName, order.getOrderId());
        log.info("[KAFKA PRODUCER] Customer: {}, Product: {}, Quantity: {}",
                order.getCustomerName(), order.getProduct(), order.getQuantity());
        log.info("==================================================================");

        // Record event in in-memory feed for UI
        OrderEvent producerEvent = new OrderEvent(
                UUID.randomUUID().toString(),
                LocalDateTime.now().format(TIME_FORMATTER),
                "PRODUCER",
                "None (Topic Publisher)",
                order.getOrderId(),
                "Order published to topic '" + topicName + "'",
                order.getProduct(),
                order.getQuantity(),
                -1,
                "orange"
        );
        inventoryService.addEvent(producerEvent);

        // Asynchronously publish to Kafka topic
        CompletableFuture<SendResult<String, Order>> future = kafkaTemplate.send(topicName, order.getOrderId(), order);

        future.whenComplete((result, ex) -> {
            if (ex == null) {
                log.info("[KAFKA PRODUCER] Order [{}] successfully published to partition {} at offset {}",
                        order.getOrderId(),
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset());
            } else {
                log.error("[KAFKA PRODUCER] Failed to publish order [{}]: {}", order.getOrderId(), ex.getMessage());
            }
        });
    }
}
