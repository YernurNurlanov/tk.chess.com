package com.chess.tk.db.entity;

import com.chess.tk.db.enums.TaskLevel;
import jakarta.persistence.*;
import lombok.*;

@Setter
@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskLevel level;

    @Column(nullable = false)
    private String topic;

    @Column(nullable = false)
    private String startFin;

    private String endFin;
}
