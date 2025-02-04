package com.chess.tk.db.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Setter
@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Size(min = 5, max = 50, message = "Name must contain from 5 to 50 characters")
    @NotBlank(message = "Full name can not be empty")
    @Column(nullable = false, unique = true, name = "full_name")
    private String fullName;

    @Size(min = 10, max = 100, message = "Email must contain from 10 to 100 characters")
    @NotBlank(message = "Email can not be empty")
    @Email(message = "Email must be in the format user@example.com")
    @Column(nullable = false, unique = true)
    private String email;

    @Pattern(regexp = "^87[0-9]{9}$", message = "Phone number must be valid")
    @NotBlank(message = "Phone number cannot be empty")
    @Column(nullable = false, unique = true)
    private String phone;

    @Size(min = 8, max = 100, message = "Length of password contain from 8 to 100 characters")
    @NotBlank(message = "Password can not be empty")
    @Column(nullable = false)
    private String password;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "last_payment")
    private LocalDateTime lastPayment;

    @Column(name = "hourly_rate")
    private int hourlyRate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }
    @Override
    public String getUsername() {
        return email;
    }
}
