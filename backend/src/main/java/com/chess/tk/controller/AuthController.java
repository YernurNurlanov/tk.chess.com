package com.chess.tk.controller;

import com.chess.tk.dto.GoogleLoginRequest;
import com.chess.tk.dto.SignInRequest;
import com.chess.tk.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/")
    public ResponseEntity<?> signIn(@RequestBody @Valid SignInRequest signInRequest) {
        return authService.signIn(signInRequest);
    }

    @PostMapping("/google")
    public ResponseEntity<?> loginWithGoogle(@RequestBody GoogleLoginRequest request) {
        return authService.loginWithGoogle(request.getIdToken());
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logout() {
        return authService.logout();
    }
}
