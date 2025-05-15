package com.chess.tk.dto;

import com.chess.tk.db.entity.Task;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class LessonDTO {
    private Long id;
    private String groupName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private List<Task> tasks;
    private List<StudentLessonInfoDTO> studentInfoDTOs;

    public LessonDTO() {

    }
}
