package com.chess.tk.db.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "lessons")
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String title;

    private Long groupId;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    @ElementCollection
    @CollectionTable(name = "lesson_tasks", joinColumns = @JoinColumn(name = "lesson_id"))
    @Column(name = "task_id")
    private List<Long> taskIds;
}
