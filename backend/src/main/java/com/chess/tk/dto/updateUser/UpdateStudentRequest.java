package com.chess.tk.dto.updateUser;

import jakarta.validation.Valid;
import lombok.Data;

@Data
public class UpdateStudentRequest {
    @Valid
    private UserDTO user;

    @Valid
    private StudentDTO student;
}
