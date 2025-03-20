package com.chess.tk.dto;

import com.chess.tk.db.entities.Teacher;
import com.chess.tk.db.entities.User;
import lombok.Data;

@Data
public class AddTeacherRequest {
    private User user;
    private Teacher teacher;
}
