package com.chess.tk.dto;

import com.chess.tk.db.entity.CompletedTask;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class StudentLessonInfoDTO extends StudentBaseDTO {
    private boolean attended;

    public StudentLessonInfoDTO(Long studentId, String firstName, String lastName, boolean attended, List<CompletedTask> performance) {
        this.setStudentId(studentId);
        this.setFirstName(firstName);
        this.setLastName(lastName);
        this.attended = attended;
        this.setPerformance(performance);
    }
}
