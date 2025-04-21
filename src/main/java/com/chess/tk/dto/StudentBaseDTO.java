package com.chess.tk.dto;

import com.chess.tk.db.entity.CompletedTask;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class StudentBaseDTO {

    private Long studentId;
    private String firstName;
    private String lastName;
    private List<CompletedTask> performance;

    public StudentBaseDTO(Long studentId, String firstName, String lastName, List<CompletedTask> performance) {
        this.studentId = studentId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.performance = performance;
    }
}
