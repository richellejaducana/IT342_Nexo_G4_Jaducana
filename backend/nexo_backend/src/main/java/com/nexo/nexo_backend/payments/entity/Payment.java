package com.nexo.nexo_backend.payments.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.nexo.nexo_backend.registration.entity.Registration;
import com.nexo.nexo_backend.auth.entity.UserEntity;
import com.nexo.nexo_backend.payments.entity.PaymentStatus; 

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "registration_id", nullable = false)
    private Registration registration;

    @Column(nullable = false)
    private String paymentMethod; // GCASH, MAYA, BANK_TRANSFER

    @Column(nullable = false)
    private String referenceNumber;

    @Column(columnDefinition = "TEXT")
    private String paymentProofUrl; // URL to uploaded screenshot

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(length = 500)
    private String remarks; // Admin remarks for rejection

    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;

    @ManyToOne
    @JoinColumn(name = "reviewed_by")
    private UserEntity reviewedBy; // Admin who reviewed

    public Payment() {}

    public Payment(Registration registration, String paymentMethod, String referenceNumber, String paymentProofUrl) {
        this.registration = registration;
        this.paymentMethod = paymentMethod;
        this.referenceNumber = referenceNumber;
        this.paymentProofUrl = paymentProofUrl;
        this.submittedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Registration getRegistration() { return registration; }
    public void setRegistration(Registration registration) { this.registration = registration; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getReferenceNumber() { return referenceNumber; }
    public void setReferenceNumber(String referenceNumber) { this.referenceNumber = referenceNumber; }

    public String getPaymentProofUrl() { return paymentProofUrl; }
    public void setPaymentProofUrl(String paymentProofUrl) { this.paymentProofUrl = paymentProofUrl; }

    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }

    public UserEntity getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(UserEntity reviewedBy) { this.reviewedBy = reviewedBy; }
}