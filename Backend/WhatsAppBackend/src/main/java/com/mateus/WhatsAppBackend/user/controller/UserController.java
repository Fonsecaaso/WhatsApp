package com.mateus.WhatsAppBackend.user.controller;

import com.mateus.WhatsAppBackend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @CrossOrigin(origins = "http://localhost:4200", allowedHeaders = {"Authorization", "*"}, allowCredentials = "true")
    @GetMapping
    public List<String> getAllUsernames() {
        return userService.getAllUsernames();
    }
}
