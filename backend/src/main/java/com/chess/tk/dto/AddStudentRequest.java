package com.chess.tk.dto;

import com.chess.tk.db.entity.Student;
import com.chess.tk.db.entity.User;
import jakarta.validation.Valid;
import lombok.Data;

@Data
public class AddStudentRequest {
    @Valid
    private User user;

    @Valid
    private Student student;
}
