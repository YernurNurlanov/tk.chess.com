package com.chess.tk.db.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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

    @Column(name = "teacher_id", nullable = false)
    private Long teacherId;

    @ElementCollection
    @CollectionTable(name = "group_students", joinColumns = @JoinColumn(name = "group_id"))
    @Column(name = "student_id")
    private List<Long> studentIds;

    @Size(min = 1, max = 100, message = "Group name must contain from 1 to 100 characters")
    @Column(name = "group_name")
    @NotBlank(message = "Group name can not be empty")
    private String groupName;

    @JsonIgnore
    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Lesson> lessons;

    @ManyToOne
    @JoinColumn(name = "teacher_id", insertable = false, updatable = false)
    private Teacher teacher;
}
