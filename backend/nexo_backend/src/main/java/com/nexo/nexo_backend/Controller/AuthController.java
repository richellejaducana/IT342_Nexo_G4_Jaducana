package com.nexo.nexo_backend.Controller;

import com.nexo.nexo_backend.Service.UserService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> register(@RequestBody SignupRequest request) {

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("Passwords do not match!");
        }

        String response = userService.registerUser(
                request.getEmail(),
                request.getUsername(),
                request.getPassword());

        return ResponseEntity.ok(response);
    }
}

@Data
class SignupRequest {
    private String email;
    private String username;
    private String password;
    private String confirmPassword;
}