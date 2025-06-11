package com.chess.tk.dto.gameWithAI;

import com.chess.tk.db.enums.Category;
import lombok.Data;

@Data
public class MoveAnalysisDTO {
    private String strength;
    private String suggestion;
    private String topSuggestion;
    private Category category;
}

