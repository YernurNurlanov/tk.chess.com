package com.chess.tk.dto;

import com.chess.tk.db.entity.Lesson;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AllLessonsDTO {
    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String groupName;

    public AllLessonsDTO(Lesson lesson) {
        this.id = lesson.getId();
        this.startTime = lesson.getStartTime();
        this.endTime = lesson.getEndTime();
        this.groupName = lesson.getGroup().getGroupName();
    }
}
