package com.chess.tk.dto;

import com.chess.tk.db.entities.Teacher;
import com.chess.tk.db.entities.User;
import jakarta.validation.Valid;
import lombok.Data;

@Data
public class AddTeacherRequest {
    @Valid
    private User user;

    @Valid
    private Teacher teacher;
}
