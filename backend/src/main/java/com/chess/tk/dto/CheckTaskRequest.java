package com.chess.tk.dto;

import lombok.Data;

@Data
public class CheckTaskRequest {
    private Long userId;
    private Long taskId;
    private boolean completed;
}
