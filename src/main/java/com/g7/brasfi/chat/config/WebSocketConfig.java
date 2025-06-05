package com.g7.brasfi.chat.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins(
                    "http://localhost:3000",
                    "http://localhost:5173",
                    "http://localhost:8080",
                    "https://g7-brasfi.onrender.com",
                    "https://brasfi-bice.vercel.app"
                )
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app");
        registry.enableSimpleBroker("/topic");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        // Configurar pool de threads para processar mensagens grandes
        registration.taskExecutor()
                .corePoolSize(4)          // Threads mínimas
                .maxPoolSize(8)           // Threads máximas
                .keepAliveSeconds(60)     // Tempo de vida idle
                .queueCapacity(100);      // Capacidade da fila
    }

    @Override
    public void configureClientOutboundChannel(ChannelRegistration registration) {
        // Configurar pool de threads para enviar mensagens
        registration.taskExecutor()
                .corePoolSize(4)
                .maxPoolSize(8)
                .keepAliveSeconds(60)
                .queueCapacity(100);
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration reg) {
        // até 10 MB por frame
        reg.setMessageSizeLimit(10 * 1024 * 1024);
        reg.setSendBufferSizeLimit(10 * 1024 * 1024);
        reg.setSendTimeLimit(20 * 1000);          // 20 s para empurrar o payload
    }
}