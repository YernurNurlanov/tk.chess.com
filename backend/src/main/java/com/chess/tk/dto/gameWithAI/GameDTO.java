package com.chess.tk.dto.gameWithAI;

import com.chess.tk.db.enums.GameResult;
import lombok.Data;

@Data
public class GameDTO {
    private GameResult result;
}
