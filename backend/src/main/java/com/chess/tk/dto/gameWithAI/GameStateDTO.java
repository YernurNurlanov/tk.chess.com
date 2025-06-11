package com.chess.tk.dto.gameWithAI;

import com.chess.tk.db.enums.GameResult;
import lombok.Data;

import java.util.List;

@Data
public class GameStateDTO {
    private String playerColor;
    private GameResult result;
    private List<MoveDTO> moves;
}
