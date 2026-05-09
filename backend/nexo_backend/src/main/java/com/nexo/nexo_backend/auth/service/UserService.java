package com.nexo.nexo_backend.auth.service;

import com.nexo.nexo_backend.auth.entity.UserEntity;
import com.nexo.nexo_backend.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public String registerUser(String email, String firstname, String lastname, String password) {

        if (userRepository.existsByEmail(email)) {
            return "Email already exists!";
        }

        UserEntity user = UserEntity.builder()
                .email(email)
                .firstname(firstname)
                .lastname(lastname)
                .password(passwordEncoder.encode(password))
                .role("ROLE_USER")
                .build();

        userRepository.save(user);

        return "User registered successfully!";
    }

    public UserEntity loginUser(String email, String password) {
        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty())
            return null;
        var user = userOpt.get();
        if (!passwordEncoder.matches(password, user.getPassword()))
            return null;
        return user;
    }
}