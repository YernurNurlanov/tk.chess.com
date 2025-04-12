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

    @Column(name = "teacher_id")
    private Long teacherId;

    @Column(name = "group_id")
    private Long groupId;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @ElementCollection
    @CollectionTable(name = "lesson_tasks", joinColumns = @JoinColumn(name = "lesson_id"))
    @Column(name = "task_id")
    private List<Long> taskIds;

    @ManyToOne
    @JoinColumn(name = "group_id", insertable = false, updatable = false)
    private Group group;
}
