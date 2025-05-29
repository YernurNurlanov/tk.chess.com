package com.chess.tk.service;

import com.chess.tk.db.entity.User;
import com.chess.tk.db.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordResetService {

    private final JwtService jwtService;
    private final EmailService emailService;
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final AdminService adminService;

    @Value("${front.reset-url}")
    private String url;

    public PasswordResetService(JwtService jwtService, EmailService emailService,
                                UserRepository userRepo, PasswordEncoder passwordEncoder, AdminService adminService) {
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.adminService = adminService;
    }

    public ResponseEntity<String> createPasswordResetToken(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User with email " + email + " not found"));

        String token = jwtService.generateResetToken(user.getEmail());
        String link = url + "?token=" + token;


        emailService.sendPasswordResetLink(user.getEmail(), link);
        return ResponseEntity.ok().build();
    }

    public ResponseEntity<String> resetPassword(String token, String newPassword) {
        String email;
        try {
            email = jwtService.extractUserName(token);

            UserDetails userDetails = adminService
                    .userDetailsService()
                    .loadUserByUsername(email);

            boolean expiration = jwtService.isTokenValid(token, userDetails);

            if (!expiration) {
                return ResponseEntity.status(403).body("Token expired");
            }

        } catch (Exception e) {
            return ResponseEntity.status(403).body("Invalid or expired token");
        }

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);

        return ResponseEntity.ok("Password successfully reset");
    }
}
