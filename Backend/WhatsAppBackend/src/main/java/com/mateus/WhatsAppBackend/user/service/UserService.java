package com.mateus.WhatsAppBackend.user.service;

import com.mateus.WhatsAppBackend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<String> getAllUsernames() {
        return userRepository.findAllUsernames();
    }
}
