package com.chess.tk.dto;

import com.chess.tk.db.enums.TaskLevel;
import lombok.Data;

import java.util.List;

@Data
public class LevelTasksDTO {

    private TaskLevel level;

    private List<TopicTasksDTO> topics;

    public LevelTasksDTO(TaskLevel level, List<TopicTasksDTO> topics) {
        this.level = level;
        this.topics = topics;
    }
}
