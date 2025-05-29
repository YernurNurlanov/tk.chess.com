package com.chess.tk.dto.passwordReset;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class EmailRequest {

    @Email(message = "incorrect email")
    private String email;
}
