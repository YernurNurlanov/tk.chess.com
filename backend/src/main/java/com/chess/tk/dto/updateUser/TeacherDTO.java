package com.chess.tk.dto.updateUser;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TeacherDTO {
    @Min(value = 1000, message = "Hourly rate must be more than 1000")
    @Max(value = 100000, message = "Hourly rate must be less than 100000")
    @NotNull(message = "Hourly rate can not be empty")
    @Column(name = "hourly_rate", nullable = false)
    private int hourlyRate;

    @Column(nullable = false)
    private String schedule;

    @Column(nullable = false)
    private String bio;

    @Min(value = 0, message = "Experience years must be more than 0")
    @Max(value = 50, message = "Experience years must be less than 50")
    @NotNull(message = "Experience years can not be empty")
    @Column(name = "experience_years", nullable = false)
    private int experienceYears;

    @Min(value = 1000, message = "Chess rating must be more than 1000")
    @Max(value = 3500, message = "Chess rating must be less than 3500")
    @NotNull(message = "Chess rating can not be empty")
    @Column(name = "chess_rating", nullable = false)
    private int chessRating;
}
