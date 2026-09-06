package com.orderprocessing.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.test.EmbeddedKafkaZKBroker;

import java.io.IOException;
import java.net.Socket;

/**
 * Kafka Topic Configuration.
 * 1. Creates the 'orders' topic with 1 partition and 1 replica.
 * 2. Conditionally boots an embedded Kafka broker on port 9092 if external Kafka is not detected.
 */
@Configuration
public class KafkaTopicConfig {

    private static final Logger log = LoggerFactory.getLogger(KafkaTopicConfig.class);

    @Value("${app.kafka.topic:orders}")
    private String topicName;

    @Value("${app.embedded-kafka.enabled:true}")
    private boolean embeddedKafkaEnabled;

    @Value("${app.embedded-kafka.port:9092}")
    private int kafkaPort;

    /**
     * Automatically creates the 'orders' topic if it does not already exist.
     */
    @Bean
    public NewTopic ordersTopic() {
        log.info("Configuring Kafka Topic '{}' with 1 partition, 1 replica.", topicName);
        return TopicBuilder.name(topicName)
                .partitions(1)
                .replicas(1)
                .build();
    }

    /**
     * Starts an Embedded Kafka Broker on port 9092 if external Docker Kafka is not already running.
     * Guarantees that the college viva demo works out of the box with zero external setup!
     */
    @Bean
    @ConditionalOnProperty(name = "app.embedded-kafka.enabled", havingValue = "true", matchIfMissing = true)
    public EmbeddedKafkaZKBroker embeddedKafkaBroker() {
        if (isPortInUse("localhost", kafkaPort)) {
            log.info("External Kafka broker detected on port {}. Using external Kafka.", kafkaPort);
            return null;
        }

        log.info("No external Kafka detected on port {}. Starting Embedded Apache Kafka broker for demo...", kafkaPort);
        EmbeddedKafkaZKBroker broker = new EmbeddedKafkaZKBroker(1, false, 1, topicName)
                .kafkaPorts(kafkaPort);
        try {
            broker.afterPropertiesSet();
            log.info("Embedded Apache Kafka broker successfully started on port {} with topic '{}'!", kafkaPort, topicName);
        } catch (Exception e) {
            log.warn("Could not start embedded Kafka: {}. Continuing with configured bootstrap servers.", e.getMessage());
        }
        return broker;
    }

    private boolean isPortInUse(String host, int port) {
        try (Socket s = new Socket(host, port)) {
            return true;
        } catch (IOException e) {
            return false;
        }
    }
}
