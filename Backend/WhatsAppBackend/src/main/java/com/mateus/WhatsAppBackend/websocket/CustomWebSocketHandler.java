package com.mateus.WhatsAppBackend.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.web.socket.CloseStatus;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class CustomWebSocketHandler extends TextWebSocketHandler {

    @Autowired
    private JwtDecoder jwtDecoder;  // Injete o JwtDecoder

    private final ConcurrentHashMap<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper(); // Para converter JSON

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("Conexão WebSocket estabelecida.");
        String token = getTokenFromSession(session);

        // if (token != null && authenticateToken(token)) {
            String username = getUsernameFromSession(session);
            if (username != null) {
                sessions.put(username, session);
                System.out.println("Conexão estabelecida com " + username);
            }
        // } else {
        //     System.out.println("Token inválido ou não fornecido.");
        //     session.close();  // Fecha a conexão se o token for inválido
        // }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        // Parseia a mensagem recebida
        String payload = message.getPayload();
        Message messageObj = objectMapper.readValue(payload, Message.class);

        // Verifica se a ação é de "chat"
        if ("chat".equals(messageObj.getAction())) {
            String recipient = messageObj.getRecipient();
            String sender = messageObj.getSender();
            String textMessage = messageObj.getMessage();

            // Se o destinatário existir na lista de sessões, encaminha a mensagem
            WebSocketSession recipientSession = sessions.get(recipient);
            if (recipientSession != null) {
                // Cria a mensagem a ser enviada para o destinatário (sem o "recipient")
                Message responseMessage = new Message();
                responseMessage.setAction("chat");
                responseMessage.setSender(sender);
                responseMessage.setMessage(textMessage);
                responseMessage.setRecipient(recipient);

                // Converte a mensagem para JSON e envia ao destinatário
                String responsePayload = objectMapper.writeValueAsString(responseMessage);
                recipientSession.sendMessage(new TextMessage(responsePayload));

                System.out.println("Mensagem enviada de " + sender + " para " + recipient);
            } else {
                System.out.println("Usuário " + recipient + " não está conectado. Os" + 
                sessions.keySet() + " estão.");
            }
        } else {
            System.out.println("Ação desconhecida: " + messageObj.getAction());
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String username = getUsernameFromSession(session);
        if (username != null) {
            sessions.remove(username);
            System.out.println("Conexão fechada com " + username);
        }
    }

    private String getUsernameFromSession(WebSocketSession session) {
        String query = session.getUri().getQuery();
        if (query != null && query.contains("username=")) {
            String[] params = query.split("&");
            for (String param : params) {
                if (param.startsWith("username=")) {
                    return param.split("=")[1];
                }
            }
        }
        return null;
    }

    private String getTokenFromSession(WebSocketSession session) {
        HttpHeaders headers = session.getHandshakeHeaders();
        List<String> authorization = headers.get(HttpHeaders.AUTHORIZATION);
        if (authorization != null && !authorization.isEmpty()) {
            return authorization.get(0).replace("Bearer ", "");
        }
        return null;
    }

    private boolean authenticateToken(String token) {
        try {
            Jwt jwt = jwtDecoder.decode(token);
            System.out.println("authenticated Token" + jwt.toString());
            return jwt != null;
        } catch (Exception e) {
            System.out.println("Falha ao autenticar o token: " + e.getMessage());
            return false;
        }
    }

    // Classe auxiliar para representar a estrutura da mensagem
    private static class Message {
        private String action;
        private String sender;
        private String recipient;
        private String message;

        public String getAction() {
            return action;
        }

        public void setAction(String action) {
            this.action = action;
        }

        public String getSender() {
            return sender;
        }

        public void setSender(String sender) {
            this.sender = sender;
        }

        public String getRecipient() {
            return recipient;
        }

        public void setRecipient(String recipient) {
            this.recipient = recipient;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
