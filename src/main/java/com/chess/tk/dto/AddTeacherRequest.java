package com.chess.tk.dto;

import com.chess.tk.db.entity.Teacher;
import com.chess.tk.db.entity.User;
import jakarta.validation.Valid;
import lombok.Data;

@Data
public class AddTeacherRequest {
    @Valid
    private User user;

    @Valid
    private Teacher teacher;
}
