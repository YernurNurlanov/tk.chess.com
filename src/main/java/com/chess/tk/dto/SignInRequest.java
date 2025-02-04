package com.chess.tk.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignInRequest {
    @Size(min = 10, max = 100, message = "Email must contain from 10 to 100 characters")
    @NotBlank(message = "Email can not be empty")
    @Email(message = "Email must be in the format user@example.com")
    private String email;

    @Size(min = 8, max = 50, message = "Length of password contain from 8 to 50 characters")
    @NotBlank(message = "Password can not be empty")
    private String password;
}
