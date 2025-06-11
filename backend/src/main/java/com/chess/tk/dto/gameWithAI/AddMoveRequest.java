package com.chess.tk.dto.gameWithAI;

import lombok.Data;

@Data
public class AddMoveRequest {
    private MoveDTO move;
    private MoveAnalysisDTO moveAnalysis;
}
