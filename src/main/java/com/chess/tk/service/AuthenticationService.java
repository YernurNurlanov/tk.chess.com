package com.chess.tk.service;

import com.chess.tk.db.entities.User;
import com.chess.tk.db.repositories.UserRepository;
import com.chess.tk.dto.SignInRequest;
import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepo;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public Cookie signIn(SignInRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
        ));
        User user = userRepo.findByEmail(request.getEmail()).orElseThrow();

        var jwt = jwtService.generateToken(user);

        Cookie jwtCookie = new Cookie("jwt", jwt);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(24 * 60 * 60);

        return jwtCookie;
    }
}
