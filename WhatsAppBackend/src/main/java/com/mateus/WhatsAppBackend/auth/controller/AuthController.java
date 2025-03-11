package com.mateus.WhatsAppBackend.auth.controller;

import com.mateus.WhatsAppBackend.auth.dto.AuthRequest;
import com.mateus.WhatsAppBackend.auth.dto.AuthResponse;
import com.mateus.WhatsAppBackend.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public AuthResponse signup(@RequestBody AuthRequest request) {
        return authService.signup(request);
    }

    @PostMapping("/signin")
    public AuthResponse signin(@RequestBody AuthRequest request) {
        return authService.signin(request);
    }
}
