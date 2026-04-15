package com.nexo.nexo_backend.Controller;

import com.nexo.nexo_backend.Entity.Registration;
import com.nexo.nexo_backend.Service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping
    public Registration register(@RequestBody RegistrationRequest request) {
        return registrationService.register(
                request.getEventId(),
                request.getUserId(),
                request.getSlots()
        );
    }
}

class RegistrationRequest {
    private Long eventId;
    private Long userId;
    private Integer slots;

    public Long getEventId() { return eventId; }
    public Long getUserId() { return userId; }
    public Integer getSlots() { return slots; }
}