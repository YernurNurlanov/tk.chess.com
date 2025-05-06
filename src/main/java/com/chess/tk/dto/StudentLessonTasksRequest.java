package com.chess.tk.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StudentLessonTasksRequest {

    @NotNull(message = "Id must not be null")
    @Min(value = 1, message = "Id must be more than 0")
    Long studentId;

    @NotNull(message = "Id must not be null")
    @Min(value = 1, message = "Id must be more than 0")
    Long lessonId;
}
