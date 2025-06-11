package com.chess.tk.dto.gameWithAI;

import lombok.Data;

@Data
public class MoveDTO {
    private String fromSquare;
    private String toSquare;
    private String san;
    private String fenBefore;
    private String fenAfter;
}
