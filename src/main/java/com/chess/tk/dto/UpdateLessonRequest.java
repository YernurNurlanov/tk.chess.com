package com.chess.tk.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UpdateLessonRequest {

    @NotNull(message = "Id must not be null")
    @Min(value = 1, message = "Id must be more than 0")
    private Long lessonId;

    @NotNull(message = "Start time must not be null")
    private LocalDateTime startTime;

    @NotNull(message = "End ime must not be null")
    private LocalDateTime endTime;

    @NotNull(message = "Id must not be null")
    @Min(value = 1, message = "Id must be more than 0")
    private Long groupId;
}
