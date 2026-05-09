package com.nexo.nexo_backend.registration.service;

import com.nexo.nexo_backend.registration.entity.*;
import com.nexo.nexo_backend.registration.repository.*;
import com.nexo.nexo_backend.events.entity.Event;
import com.nexo.nexo_backend.events.repository.EventRepository;
import com.nexo.nexo_backend.auth.entity.UserEntity;
import com.nexo.nexo_backend.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public Registration register(Long eventId, Long userId, Integer slots) {
        // Check for duplicate registration
        Optional<Registration> existingRegistration = registrationRepository.findByEventIdAndUserId(eventId, userId);
        if (existingRegistration.isPresent()) {
            throw new RuntimeException("User is already registered for this event");
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Registration registration = new Registration(event, user, slots);
        return registrationRepository.save(registration);
    }

    public List<Registration> getRegistrationsByEvent(Long eventId) {
        return registrationRepository.findByEventId(eventId);
    }

    public List<Registration> getRegistrationsByUser(Long userId) {
        return registrationRepository.findAll().stream()
                .filter(reg -> reg.getUser().getId().equals(userId))
                .toList();
    }

    public Registration getRegistrationById(Long registrationId) {
        return registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));
    }
}