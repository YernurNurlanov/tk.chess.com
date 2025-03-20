package com.chess.tk.controller;

import com.chess.tk.service.AuthenticationService;
import com.chess.tk.dto.SignInRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/")
    public ResponseEntity<?> signIn(@RequestBody @Valid SignInRequest signInRequest, BindingResult bindingResult, HttpServletResponse response) {

        if (bindingResult.hasErrors()) {
            List<String> errors = bindingResult.getAllErrors().stream()
                    .map(DefaultMessageSourceResolvable::getDefaultMessage)
                    .collect(Collectors.toList());
            return ResponseEntity.badRequest().body(errors);
        }
        response.addCookie(authenticationService.signIn(signInRequest));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/")
    public String loginPage() {
        return "login";
    }
}
