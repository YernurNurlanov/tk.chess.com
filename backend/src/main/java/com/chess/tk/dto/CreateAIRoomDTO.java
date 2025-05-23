package com.chess.tk.dto;

import lombok.Data;

@Data
public class CreateAIRoomDTO {
    private Long userId;
    private int aiLevel;
    private String playerColor; // "white" or "black"
}