package com.chess.tk.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AttachStudentRequest {

    @NotNull(message = "Id must not be null")
    @Min(value = 1, message = "Id must be more than 0")
    private Long id;

    @NotNull(message = "Id must not be null")
    @Min(value = 1, message = "Id must be more than 0")
    private Long studentId;
}
