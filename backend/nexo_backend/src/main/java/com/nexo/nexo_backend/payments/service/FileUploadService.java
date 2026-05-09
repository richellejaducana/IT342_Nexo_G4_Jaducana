package com.nexo.nexo_backend.payments.service;

import com.nexo.nexo_backend.auth.config.SupabaseConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileUploadService {

    private final SupabaseConfig supabaseConfig;

    public String uploadPaymentProof(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        // Validate file size (max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("File size must be less than 5MB");
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
            ? originalFilename.substring(originalFilename.lastIndexOf("."))
            : ".jpg";
        String uniqueFilename = "payment-proof-" + UUID.randomUUID() + extension;

        // Upload to Supabase storage
        // Note: This is a placeholder. You'll need to implement the actual Supabase upload logic
        // using the Supabase JavaScript SDK or REST API

        // For now, return a placeholder URL
        return "https://your-supabase-url.supabase.co/storage/v1/object/public/payment-proofs/" + uniqueFilename;
    }
}