package com.nexo.nexo_backend.Entity;

import jakarta.persistence.*;

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

    public Registration() {}

    public Registration(Event event, UserEntity user, Integer slots) {
        this.event = event;
        this.user = user;
        this.slots = slots;
    }

    public Long getId() { return id; }

    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }

    public UserEntity getUser() { return user; }
    public void setUser(UserEntity user) { this.user = user; }

    public Integer getSlots() { return slots; }
    public void setSlots(Integer slots) { this.slots = slots; }
}