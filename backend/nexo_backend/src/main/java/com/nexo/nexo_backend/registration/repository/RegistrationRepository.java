package com.nexo.nexo_backend.registration.repository;

import com.nexo.nexo_backend.registration.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByEventId(Long eventId);
    Optional<Registration> findByEventIdAndUserId(Long eventId, Long userId);
}