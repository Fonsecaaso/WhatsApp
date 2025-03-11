package com.mateus.WhatsAppBackend.user.repository;

import com.mateus.WhatsAppBackend.auth.model.User; // Aqui você usa o modelo User que já existe no seu projeto
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u.username FROM User u")
    List<String> findAllUsernames();

    Optional<User> findByUsername(String username);
}
