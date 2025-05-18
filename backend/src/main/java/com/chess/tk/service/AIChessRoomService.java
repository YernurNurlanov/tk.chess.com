package com.chess.tk.service;

import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class AIChessRoomService {
    public String createAIRoom(Long userId, int aiLevel, String playerColor) {
        // Generate unique room ID
        String roomId = "ai-" + UUID.randomUUID().toString().substring(0, 8);

        // Here you would typically save the room to database
        // For now we'll just return the generated ID
        return roomId;
    }
}

// todo