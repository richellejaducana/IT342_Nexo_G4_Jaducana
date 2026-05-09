package com.nexo.nexo_backend.payments.service;

import com.nexo.nexo_backend.payments.entity.*;
import com.nexo.nexo_backend.payments.repository.*;
import com.nexo.nexo_backend.registration.entity.Registration;
import com.nexo.nexo_backend.registration.repository.RegistrationRepository;
import com.nexo.nexo_backend.auth.entity.UserEntity;
import com.nexo.nexo_backend.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final RegistrationRepository registrationRepository;
    private final UserRepository userRepository;

    @Transactional
    public Payment submitPayment(Long registrationId, String paymentMethod, String referenceNumber, String paymentProofUrl, Long userId) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        // Verify the user owns this registration
        if (!registration.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to registration");
        }

        // Check if payment already exists
        if (registration.getPayment() != null) {
            throw new RuntimeException("Payment already submitted for this registration");
        }

        Payment payment = new Payment(registration, paymentMethod, referenceNumber, paymentProofUrl);
        payment = paymentRepository.save(payment);

        // Link payment to registration
        registration.setPayment(payment);
        registrationRepository.save(registration);

        return payment;
    }

    @Transactional
    public Payment resubmitPayment(Long registrationId, String paymentMethod, String referenceNumber, String paymentProofUrl, Long userId) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        // Verify the user owns this registration
        if (!registration.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to registration");
        }

        Payment existingPayment = registration.getPayment();
        if (existingPayment == null) {
            throw new RuntimeException("No payment exists for this registration");
        }

        if (existingPayment.getStatus() != PaymentStatus.REJECTED) {
            throw new RuntimeException("Only rejected payments can be resubmitted");
        }

        existingPayment.setPaymentMethod(paymentMethod);
        existingPayment.setReferenceNumber(referenceNumber);
        existingPayment.setPaymentProofUrl(paymentProofUrl);
        existingPayment.setStatus(PaymentStatus.PENDING);
        existingPayment.setRemarks(null);
        existingPayment.setSubmittedAt(LocalDateTime.now());
        existingPayment.setReviewedAt(null);
        existingPayment.setReviewedBy(null);

        // Reset registration status to pending while payment is under review again
        registration.setPaymentStatus(PaymentStatus.PENDING);
        registrationRepository.save(registration);

        return paymentRepository.save(existingPayment);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public List<Payment> getPaymentsByStatus(PaymentStatus status) {
        return paymentRepository.findByStatus(status);
    }

    @Transactional
    public Payment reviewPayment(Long paymentId, PaymentStatus status, String remarks, Long adminId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        UserEntity admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        payment.setStatus(status);
        payment.setRemarks(remarks);
        payment.setReviewedAt(LocalDateTime.now());
        payment.setReviewedBy(admin);

        // Update registration payment status
        payment.getRegistration().setPaymentStatus(status);

        return paymentRepository.save(payment);
    }

    public Payment getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    public List<Payment> getPaymentsByRegistration(Long registrationId) {
        return paymentRepository.findByRegistrationId(registrationId);
    }
}