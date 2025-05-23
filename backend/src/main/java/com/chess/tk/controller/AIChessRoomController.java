package com.chess.tk.controller;

import com.chess.tk.dto.CreateAIRoomDTO;
import com.chess.tk.service.AIChessRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai-rooms")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AIChessRoomController {
    private final AIChessRoomService aiChessRoomService;

    @PostMapping
    public ResponseEntity<String> createAIRoom(@RequestBody CreateAIRoomDTO request) {
        String roomId = aiChessRoomService.createAIRoom(
                request.getUserId(),
                request.getAiLevel(),
                request.getPlayerColor());
        return ResponseEntity.ok(roomId);
    }
}