package com.chess.tk.db.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Setter
@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "groups")
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Long teacherId;

    @ElementCollection
    @CollectionTable(name = "group_students", joinColumns = @JoinColumn(name = "group_id"))
    @Column(name = "student_id")
    private List<Long> studentIds;
}
