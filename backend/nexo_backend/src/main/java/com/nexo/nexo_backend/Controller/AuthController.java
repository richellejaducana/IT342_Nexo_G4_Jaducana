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
                request.getFirstname(),
                request.getLastname(),
                request.getPassword());

        return ResponseEntity.ok(java.util.Map.of("message", response));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        var user = userService.loginUser(request.getEmail(), request.getPassword());
        if (user == null) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        return ResponseEntity.ok(new UserInfoResponse( user.getId(),user.getFirstname(), user.getLastname(), user.getEmail(),user.getRole()));
    }
}

@Data
class SignupRequest {
    private String email;
    private String firstname;
    private String lastname;
    private String password;
    private String confirmPassword;
}

@Data
class LoginRequest {
    private String email;
    private String password;
}

@Data
@lombok.AllArgsConstructor
class UserInfoResponse {
     private Long id; // ✅ ADD THIS
    private String firstname;
    private String lastname;
    private String email;
    private String role;
}