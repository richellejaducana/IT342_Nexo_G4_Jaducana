package com.nexo.nexo_backend.registration.controller;

import com.nexo.nexo_backend.registration.entity.Registration;
import com.nexo.nexo_backend.registration.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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

    @GetMapping("/event/{eventId}")
    public List<Registration> getRegistrationsByEvent(@PathVariable Long eventId) {
        return registrationService.getRegistrationsByEvent(eventId);
    }

    @GetMapping("/user/{userId}")
    public List<Registration> getRegistrationsByUser(@PathVariable Long userId) {
        return registrationService.getRegistrationsByUser(userId);
    }

    @GetMapping("/{registrationId}")
    public Registration getRegistrationById(@PathVariable Long registrationId) {
        return registrationService.getRegistrationById(registrationId);
    }
}

class RegistrationRequest {
    private Long eventId;
    private Long userId;
    private Integer slots;

    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Integer getSlots() { return slots; }
    public void setSlots(Integer slots) { this.slots = slots; }
}