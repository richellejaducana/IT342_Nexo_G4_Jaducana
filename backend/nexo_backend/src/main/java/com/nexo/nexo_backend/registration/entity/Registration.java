package com.nexo.nexo_backend.registration.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import java.time.LocalDate;
import com.nexo.nexo_backend.events.entity.Event;
import com.nexo.nexo_backend.auth.entity.UserEntity;
import com.nexo.nexo_backend.payments.entity.PaymentStatus;
import com.nexo.nexo_backend.payments.entity.Payment;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Entity
@Table(name = "registrations")
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ MANY registrations → ONE event
    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    // ✅ MANY registrations → ONE user
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    private Integer slots;

    //edited fields for easier access to event details in registration
    private String eventName;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate eventDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    private String eventTime;
    private String locationName;
    private String address;
    private String city;
    private Double eventPrice;
    private String paymentType;
    private String eventType;
    private String recurrenceDays;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @OneToOne(mappedBy = "registration", cascade = CascadeType.ALL)
    private Payment payment;

    public Registration() {}

    public Registration(Event event, UserEntity user, Integer slots) {
        this.event = event;
        this.user = user;
        this.slots = slots;
        this.eventName = event.getEventName();
        this.eventDate = event.getDate();
        this.startDate = event.getStartDate();
        this.endDate = event.getEndDate();
        this.eventTime = createEventTime(event);
        this.locationName = event.getLocationName();
        this.address = event.getAddress();
        this.city = event.getCity();
        this.eventPrice = event.getEventPrice();
        this.paymentType = event.getPaymentType();
        this.eventType = event.getEventType();
        this.recurrenceDays = event.getRecurrenceDays();
        this.imageUrl = event.getImageUrl();

        // Set payment status based on payment type
        if ("FREE".equals(event.getPaymentType())) {
            this.paymentStatus = PaymentStatus.APPROVED;
        }
    }

    private String createEventTime(Event event) {
        if (event.getStartTime() != null && event.getEndTime() != null) {
            return String.format("%s - %s", event.getStartTime().toString(), event.getEndTime().toString());
        }
        return null;
    }

    public Long getId() { return id; }

    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }

    public UserEntity getUser() { return user; }
    public void setUser(UserEntity user) { this.user = user; }

    public Integer getSlots() { return slots; }
    public void setSlots(Integer slots) { this.slots = slots; }

    public String getEventName() { return eventName; }
    public void setEventName(String eventName) { this.eventName = eventName; }

    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getEventTime() { return eventTime; }
    public void setEventTime(String eventTime) { this.eventTime = eventTime; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Double getEventPrice() { return eventPrice; }
    public void setEventPrice(Double eventPrice) { this.eventPrice = eventPrice; }

    public String getPaymentType() { return paymentType; }
    public void setPaymentType(String paymentType) { this.paymentType = paymentType; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getRecurrenceDays() { return recurrenceDays; }
    public void setRecurrenceDays(String recurrenceDays) { this.recurrenceDays = recurrenceDays; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public Payment getPayment() { return payment; }
    public void setPayment(Payment payment) { this.payment = payment; }
}