package com.chess.tk.dto.updateUser;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserDTO {

    private Long id;

    @Size(min = 2, max = 20, message = "Name must contain from 2 to 20 characters")
    @NotBlank(message = "Firstname can not be empty")
    @Column(nullable = false, name = "first_name")
    private String firstName;

    @Size(min = 2, max = 20, message = "Name must contain from 2 to 20 characters")
    @NotBlank(message = "Lastname can not be empty")
    @Column(nullable = false, name = "last_name")
    private String lastName;

    @Size(min = 10, max = 100, message = "Email must contain from 10 to 100 characters")
    @NotBlank(message = "Email can not be empty")
    @Email(message = "Email must be in the format user@example.com")
    @Column(nullable = false, unique = true)
    private String email;

    @Pattern(regexp = "^87[0-9]{9}$", message = "Phone number must be valid")
    @NotBlank(message = "Phone number cannot be empty")
    @Column(nullable = false, unique = true)
    private String phone;
}
