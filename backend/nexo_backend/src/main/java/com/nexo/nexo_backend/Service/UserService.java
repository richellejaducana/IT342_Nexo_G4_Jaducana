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

    public String registerUser(String email, String firstname, String lastname, String password) {

        if (userRepository.existsByEmail(email)) {
            return "Email already exists!";
        }

        UserEntity user = UserEntity.builder()
                .email(email)
                .firstname(firstname)
                .lastname(lastname)
                .password(passwordEncoder.encode(password))
                .build();

        userRepository.save(user);

        return "User registered successfully!";
    }
}