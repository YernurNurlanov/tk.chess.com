package com.chess.tk.dto;

import com.chess.tk.db.entity.Lesson;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class MarkAttendanceRequest {

    @NotNull(message = "Id must not be null")
    @Min(value = 1, message = "Id must be more than 0")
    private Long lessonId;

    private List<Long> studentIds;

    public MarkAttendanceRequest() {

    }

    public MarkAttendanceRequest(Lesson lesson) {
        this.lessonId = lesson.getId();
        this.studentIds = lesson.getPresentStudentIds();
    }
}
