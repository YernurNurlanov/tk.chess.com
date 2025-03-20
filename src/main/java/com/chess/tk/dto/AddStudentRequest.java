package com.chess.tk.dto;

import com.chess.tk.db.entities.Student;
import com.chess.tk.db.entities.User;
import lombok.Data;

@Data
public class AddStudentRequest {
    private User user;
    private Student student;
}
