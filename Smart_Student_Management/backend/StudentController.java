package com.edutrack.config;

import com.edutrack.entity.User;
import com.edutrack.enums.Role;
import com.edutrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Ensures login-page demo accounts exist when the database is empty.
 * Same PostgreSQL is used regardless of which Vite port (5173, 5175, …) you open.
 */
@Component
@Order(Integer.MAX_VALUE)
@Slf4j
@RequiredArgsConstructor
public class DemoDataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        seedIfMissing("admin@edutrack.com", "admin123", "Admin", Role.ADMIN);
        seedIfMissing("student@edutrack.com", "student123", "Demo Student", Role.STUDENT);
    }

    private void seedIfMissing(String email, String rawPassword, String name, Role role) {
        if (userRepository.existsByEmail(email)) {
            return;
        }
        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(rawPassword))
                .name(name)
                .role(role)
                .build();
        userRepository.save(user);
        log.info("Seeded demo user {}", email);
    }
}
