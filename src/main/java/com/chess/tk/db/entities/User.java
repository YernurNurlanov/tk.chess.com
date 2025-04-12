package com.chess.tk.db.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Inheritance(strategy = InheritanceType.JOINED)
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
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

    @Size(min = 8, max = 255, message = "Length of password contain from 8 to 100 characters")
    @NotBlank(message = "Password can not be empty")
    @Column(nullable = false)
    private String password;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @JsonIgnore
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Teacher teacher;

    @JsonIgnore
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Student student;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }
    @Override
    public String getUsername() {
        return email;
    }
}
