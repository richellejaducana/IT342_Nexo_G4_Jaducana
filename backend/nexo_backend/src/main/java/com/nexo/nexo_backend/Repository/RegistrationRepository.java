package com.nexo.nexo_backend.Repository;

import com.nexo.nexo_backend.Entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
}