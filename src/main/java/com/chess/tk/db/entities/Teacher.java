package com.chess.tk.db.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Setter
@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "teachers")
public class Teacher {
    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;

    @Size(min = 8, max = 255, message = "Length of password contain from 8 to 100 characters")
    @NotBlank(message = "Password can not be empty")
    @Column(nullable = false)
    private int hourlyRate;

    @Size(min = 8, max = 255, message = "Length of password contain from 8 to 100 characters")
    @NotBlank(message = "Password can not be empty")
    @Column(nullable = false)
    private String schedule;

    @Size(min = 8, max = 255, message = "Length of password contain from 8 to 100 characters")
    @NotBlank(message = "Password can not be empty")
    @Column(nullable = false)
    private String bio;

    @Size(min = 8, max = 255, message = "Length of password contain from 8 to 100 characters")
    @NotBlank(message = "Password can not be empty")
    @Column(nullable = false)
    private int experienceYears;

    @Size(min = 8, max = 255, message = "Length of password contain from 8 to 100 characters")
    @NotBlank(message = "Password can not be empty")
    @Column(nullable = false)
    private int chessRating;
}
