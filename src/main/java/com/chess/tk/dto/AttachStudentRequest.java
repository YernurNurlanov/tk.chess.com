package com.chess.tk.dto;

import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class AttachStudentRequest {
    @Id
    private Long id;

    @Id
    private Long studentId;
}
