package com.nexo.nexo_backend.Service;

import com.nexo.nexo_backend.Entity.*;
import com.nexo.nexo_backend.Repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public Registration register(Long eventId, Long userId, Integer slots) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Registration registration = new Registration(event, user, slots);

        return registrationRepository.save(registration);
    }
}