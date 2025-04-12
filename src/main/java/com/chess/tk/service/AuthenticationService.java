package com.chess.tk.service;

import com.chess.tk.db.entities.User;
import com.chess.tk.db.repositories.UserRepository;
import com.chess.tk.dto.SignInRequest;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepo;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public ResponseEntity<String> signIn(SignInRequest request) {
        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("User with email " + request.getEmail() + " not found"));

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()
            ));
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid email or password");
        }

        var jwt = jwtService.generateToken(user);

        return ResponseEntity.ok()
                .header("Set-Cookie", "jwt=" + jwt + "; HttpOnly; Path=/; Max-Age=86400")
                .body("Successful login");
    }
}
