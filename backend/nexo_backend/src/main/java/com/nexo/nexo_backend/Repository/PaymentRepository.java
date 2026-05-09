package com.nexo.nexo_backend.Repository;

import com.nexo.nexo_backend.Entity.Payment;
import com.nexo.nexo_backend.Entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByStatus(PaymentStatus status);
    List<Payment> findByRegistrationId(Long registrationId);
}