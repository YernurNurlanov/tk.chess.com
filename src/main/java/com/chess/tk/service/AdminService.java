package com.chess.tk.service;

import com.chess.tk.db.entities.User;
import com.chess.tk.db.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AdminService {
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public AdminService(UserRepository userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    public ResponseEntity<String> addUser(User user) {
        if (userRepo.existsByFullName(user.getFullName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User with this name already exists");
        }
        if (userRepo.existsByEmail(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User with this email already exists");
        }
        user.setCreatedAt(LocalDateTime.now());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepo.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    public ResponseEntity<String> deleteUser(Long id) {
        Optional<User> userOptional = userRepo.findById(id);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with ID " + id + " not found");
        }
        userRepo.delete(userOptional.get());
        return ResponseEntity.status(HttpStatus.OK).body("User with ID " + id + " was deleted");
    }

    public ResponseEntity<String> updateUser(User user) {
        Optional<User> userOptional = userRepo.findById(user.getId());
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with ID " + user.getId() + " not found");
        }
        User userToUpdate = userOptional.get();
        userToUpdate.setFullName(user.getFullName());
        userToUpdate.setEmail(user.getEmail());
        userToUpdate.setPhone(user.getPhone());
        userToUpdate.setPassword(passwordEncoder.encode(user.getPassword()));
        userToUpdate.setLastPayment(user.getLastPayment());
        userToUpdate.setHourlyRate(user.getHourlyRate());
        userToUpdate.setRole(user.getRole());
        userRepo.save(userToUpdate);
        return ResponseEntity.ok("User updated successfully");
    }

    public User getByEmail(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    }

    public UserDetailsService userDetailsService() {
        return this::getByEmail;
    }
}
