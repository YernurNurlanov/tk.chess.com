package com.chess.tk.dto;

import com.chess.tk.db.entities.Student;
import com.chess.tk.db.entities.User;
import jakarta.validation.Valid;
import lombok.Data;

@Data
public class AddStudentRequest {
    @Valid
    private User user;

    @Valid
    private Student student;
}
