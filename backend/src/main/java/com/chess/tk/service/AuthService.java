package com.chess.tk.service;

import com.chess.tk.db.entity.User;
import com.chess.tk.db.repository.UserRepository;
import com.chess.tk.dto.SignInRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;

@Service
public class AuthService {
    private final UserRepository userRepo;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Value("${google.client-id}")
    private String clientId;

    public AuthService(UserRepository userRepo, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userRepo = userRepo;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public ResponseEntity<?> signIn(SignInRequest request) {
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

        return generateToken(user);
    }

    public ResponseEntity<?> loginWithGoogle(String token) {
        var payload = verifyToken(token);

        if (payload == null) {
            return ResponseEntity.status(401).body("Invalid ID token");
        }

        String email = payload.getEmail();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User with email " + email + " not registered"));

        return generateToken(user);
    }

    public ResponseEntity<?> logout() {
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header("Set-Cookie", cookie.toString())
                .body(Map.of("message", "Logged out"));
    }

    public GoogleIdToken.Payload verifyToken(String idTokenString) {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(clientId))
                .build();
        try {
            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                return idToken.getPayload();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public ResponseEntity<?> generateToken(User user) {
        var jwt = jwtService.generateToken(user);

        return ResponseEntity.ok()
                .header("Set-Cookie", "jwt=" + jwt + "; HttpOnly; Path=/; Max-Age=86400; SameSite=None; Secure")
                .body(Map.of(
                        "message", "Successful login",
                        "role", user.getRole()
                ));
    }
}
