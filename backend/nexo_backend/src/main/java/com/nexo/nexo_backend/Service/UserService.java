package com.nexo.nexo_backend.Service;

import com.nexo.nexo_backend.Entity.UserEntity;
import com.nexo.nexo_backend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public String registerUser(String email, String username, String password) {

        if (userRepository.existsByEmail(email)) {
            return "Email already exists!";
        }

        if (userRepository.existsByUsername(username)) {
            return "Username already exists!";
        }

        UserEntity user = User.builder()
                .email(email)
                .username(username)
                .password(passwordEncoder.encode(password))
                .build();

        userRepository.save(user);

        return "User registered successfully!";
    }
}