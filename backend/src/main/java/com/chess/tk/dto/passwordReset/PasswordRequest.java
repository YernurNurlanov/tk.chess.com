package com.chess.tk.dto.passwordReset;

import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class PasswordRequest {

    @Length(min = 8, max = 50, message = "Password must consist 8-50 characters")
    private String password;
}
