package com.nexo.nexo_backend.Controller;

import com.nexo.nexo_backend.Entity.Payment;
import com.nexo.nexo_backend.Entity.PaymentStatus;
import com.nexo.nexo_backend.Service.FileUploadService;
import com.nexo.nexo_backend.Service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final PaymentService paymentService;
    private final FileUploadService fileUploadService;

    @PostMapping("/submit")
    public Payment submitPayment(
            @RequestParam("registrationId") Long registrationId,
            @RequestParam("paymentMethod") String paymentMethod,
            @RequestParam("referenceNumber") String referenceNumber,
            @RequestParam("paymentProof") MultipartFile paymentProof,
            @RequestParam("userId") Long userId) throws IOException {

        // Upload payment proof to secure storage
        String paymentProofUrl = fileUploadService.uploadPaymentProof(paymentProof);

        return paymentService.submitPayment(registrationId, paymentMethod, referenceNumber, paymentProofUrl, userId);
    }

    @PostMapping("/resubmit")
    public Payment resubmitPayment(
            @RequestParam("registrationId") Long registrationId,
            @RequestParam("paymentMethod") String paymentMethod,
            @RequestParam("referenceNumber") String referenceNumber,
            @RequestParam("paymentProof") MultipartFile paymentProof,
            @RequestParam("userId") Long userId) throws IOException {

        String paymentProofUrl = fileUploadService.uploadPaymentProof(paymentProof);

        return paymentService.resubmitPayment(registrationId, paymentMethod, referenceNumber, paymentProofUrl, userId);
    }

    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @GetMapping("/status/{status}")
    public List<Payment> getPaymentsByStatus(@PathVariable PaymentStatus status) {
        return paymentService.getPaymentsByStatus(status);
    }

    @PostMapping("/{paymentId}/review")
    public Payment reviewPayment(
            @PathVariable Long paymentId,
            @RequestBody ReviewRequest request) {
        return paymentService.reviewPayment(paymentId, request.getStatus(), request.getRemarks(), request.getAdminId());
    }

    @GetMapping("/{paymentId}")
    public Payment getPaymentById(@PathVariable Long paymentId) {
        return paymentService.getPaymentById(paymentId);
    }

    @GetMapping("/registration/{registrationId}")
    public List<Payment> getPaymentsByRegistration(@PathVariable Long registrationId) {
        return paymentService.getPaymentsByRegistration(registrationId);
    }
}

class ReviewRequest {
    private PaymentStatus status;
    private String remarks;
    private Long adminId;

    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public Long getAdminId() { return adminId; }
    public void setAdminId(Long adminId) { this.adminId = adminId; }
}