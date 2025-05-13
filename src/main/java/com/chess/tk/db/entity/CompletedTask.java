package com.chess.tk.db.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "completed_tasks", uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "task_id", "attempt_number"}))
public class CompletedTask {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "student_id")
    private Long studentId;

    @Column(name = "task_id")
    private Long taskId;

    @Min(0)
    @Max(3)
    @Column(name = "attempt_number")
    private int attemptNumber;

    private boolean completed = Boolean.FALSE;

    @Column(name = "completed_at")
    private LocalDateTime completedAt = LocalDateTime.now();
}
