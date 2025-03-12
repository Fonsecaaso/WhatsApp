package com.mateus.WhatsAppBackend.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;


@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    @Autowired
    private CustomWebSocketHandler customWebSocketHandler; 

    @Override
    public void registerWebSocketHandlers(@SuppressWarnings("null") WebSocketHandlerRegistry registry) {
        registry.addHandler(customWebSocketHandler, "/ws")
                .setAllowedOrigins("*");  // Permite qualquer origem para fins de teste
    }
}
