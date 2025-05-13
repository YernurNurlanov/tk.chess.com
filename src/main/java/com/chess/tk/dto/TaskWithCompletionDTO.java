package com.chess.tk.dto;

import com.chess.tk.db.entity.CompletedTask;
import com.chess.tk.db.entity.Task;
import com.chess.tk.db.enums.TaskLevel;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class TaskWithCompletionDTO {
    private Long taskId;
    private String topic;
    private TaskLevel level;
    private String startFin;
    private String endFin;
    private boolean completed;
    private int attemptNumber;
    private LocalDateTime completedAt;

    public TaskWithCompletionDTO(Task task, CompletedTask completedTask) {
        this.taskId = task.getId();
        this.topic = task.getTopic();
        this.level = task.getLevel();
        this.startFin = task.getStartFin();
        this.endFin = task.getEndFin();

        if (completedTask != null) {
            this.completed = completedTask.isCompleted();
            this.attemptNumber = completedTask.getAttemptNumber();
            this.completedAt = completedTask.getCompletedAt();
        } else {
            this.completed = false;
            this.attemptNumber = 0;
            this.completedAt = null;
        }
    }
}
