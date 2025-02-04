package com.chess.tk.db.repositories;

import com.chess.tk.db.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByFullName(String fullName);
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
}
