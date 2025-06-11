package com.chess.tk.dto.gameWithAI;

import lombok.Data;

@Data
public class SaveGameRequest {
    private GameDTO game;
    private GameAnalysisDTO analysis;
}
