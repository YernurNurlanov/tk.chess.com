package com.chess.tk.dto.gameWithAI;

import lombok.Data;

@Data
public class CreateGameRequest {
    private Long userId;
    private String playerColor;
}
