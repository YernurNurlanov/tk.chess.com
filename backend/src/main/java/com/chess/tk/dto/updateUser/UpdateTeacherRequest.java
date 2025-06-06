package com.chess.tk.dto.updateUser;

import jakarta.validation.Valid;
import lombok.Data;

@Data
public class UpdateTeacherRequest {
    @Valid
    private UserDTO user;

    @Valid
    private TeacherDTO teacher;
}
