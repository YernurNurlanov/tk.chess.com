package com.chess.tk.controller;

import com.chess.tk.db.entity.Student;
import com.chess.tk.db.entity.User;
import com.chess.tk.dto.LevelTasksDTO;
import com.chess.tk.dto.passwordReset.PasswordRequest;
import com.chess.tk.service.GeneralService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class GeneralController {
    private final GeneralService generalService;

    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    @GetMapping("/{id}/students")
    public List<Student> getStudentsByTeacherId(@PathVariable Long id) {
        return generalService.getStudentsByTeacherId(id);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER') or hasRole('STUDENT')")
    @GetMapping("/tasks")
    public List<LevelTasksDTO> getTasks() {
        return generalService.getTasks();
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER') or hasRole('STUDENT')")
    @GetMapping("/me")
    public User getCurrentUser(@CookieValue("jwt") String jwt) {
        return generalService.getCurrentUser(jwt);
    }

    @PreAuthorize("hasRole('TEACHER') or hasRole('STUDENT')")
    @PutMapping("/me/change-password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordRequest request, Authentication authentication) {
        return generalService.changePassword(authentication.getName(), request.getPassword());
    }
}
