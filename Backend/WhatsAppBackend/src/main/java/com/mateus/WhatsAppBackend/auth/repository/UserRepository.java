package com.mateus.WhatsAppBackend.auth.repository;

import com.mateus.WhatsAppBackend.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
