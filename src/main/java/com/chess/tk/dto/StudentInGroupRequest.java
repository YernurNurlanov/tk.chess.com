package com.chess.tk.dto;

import jakarta.persistence.Id;
import lombok.Data;

@Data
public class StudentInGroupRequest {
    @Id
    private Long groupId;

    @Id
    private Long studentId;
}
