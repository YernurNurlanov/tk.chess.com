package com.chess.tk.dto;

import com.chess.tk.db.entity.Task;
import lombok.Data;

import java.util.List;

@Data
public class TopicTasksDTO {

    private String topic;

    private List<Task> tasks;

    public TopicTasksDTO(String topic, List<Task> tasks) {
        this.topic = topic;
        this.tasks = tasks;
    }
}
