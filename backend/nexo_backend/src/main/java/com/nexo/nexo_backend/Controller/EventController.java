package com.nexo.nexo_backend.Controller;

import com.nexo.nexo_backend.Entity.Event;
import com.nexo.nexo_backend.Service.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/events")

public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

   @PostMapping
public ResponseEntity<?> createEvent(@Valid @RequestBody Event event) {
    try {
        System.out.println("EVENT RECEIVED: " + event);
Event saved = eventService.createEvent(event);
System.out.println("EVENT SAVED: " + saved);
        return ResponseEntity.ok(saved);
    } catch (Exception e) {
        e.printStackTrace(); // 🔥 VERY IMPORTANT
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
    @GetMapping
    public ResponseEntity<?> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }
}
