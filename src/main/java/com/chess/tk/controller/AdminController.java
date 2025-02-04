package com.chess.tk.controller;

import com.chess.tk.db.entities.User;
import com.chess.tk.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        return adminService.deleteUser(id);
    }

    @PostMapping("/")
    public ResponseEntity<String> addUser(@RequestBody @Valid User user) {
        return adminService.addUser(user);
    }

    @PutMapping("/")
    public ResponseEntity<String> updateUser(@RequestBody @Valid User user) {
        return adminService.updateUser(user);
    }
}
