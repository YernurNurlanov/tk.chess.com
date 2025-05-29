package com.chess.tk.controller;

import com.chess.tk.dto.passwordReset.EmailRequest;
import com.chess.tk.dto.passwordReset.PasswordRequest;
import com.chess.tk.service.PasswordResetService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth/password-reset")
public class PasswordResetController {

    private final PasswordResetService resetService;

    public PasswordResetController(PasswordResetService resetService) {
        this.resetService = resetService;
    }

    @PostMapping("/request")
    public ResponseEntity<?> requestReset(@Valid @RequestBody EmailRequest request) {
        return resetService.createPasswordResetToken(request.getEmail());
    }

    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(@RequestParam("token") String token, @Valid @RequestBody PasswordRequest request) {
        return resetService.resetPassword(token, request.getPassword());
    }
}
