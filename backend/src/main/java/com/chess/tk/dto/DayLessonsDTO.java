package com.chess.tk.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class DayLessonsDTO {
    private LocalDate date;
    private List<AllLessonsDTO> lessons;

    public DayLessonsDTO(LocalDate date, List<AllLessonsDTO> lessons) {
        this.date = date;
        this.lessons = lessons;
    }
}