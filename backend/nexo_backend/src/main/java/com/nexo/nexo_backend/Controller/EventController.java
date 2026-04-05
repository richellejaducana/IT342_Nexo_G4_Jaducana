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
    
    @GetMapping("/{id}")
public ResponseEntity<?> getEventById(@PathVariable Long id) {
    return eventService.getEventById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
}

@PutMapping("/{id}")
public ResponseEntity<?> updateEvent(@PathVariable Long id, @Valid @RequestBody Event updatedEvent) {
    return eventService.getEventById(id).map(event -> {
        event.setEventName(updatedEvent.getEventName());
        event.setLocationName(updatedEvent.getLocationName());
        event.setAddress(updatedEvent.getAddress());
        event.setCity(updatedEvent.getCity());
        event.setDate(updatedEvent.getDate());
        event.setStartTime(updatedEvent.getStartTime());
        event.setEndTime(updatedEvent.getEndTime());
        event.setTimeZone(updatedEvent.getTimeZone());
        event.setDescription(updatedEvent.getDescription());
        event.setImageUrl(updatedEvent.getImageUrl());

        Event saved = eventService.createEvent(event);
        return ResponseEntity.ok(saved);
    }).orElse(ResponseEntity.notFound().build());
}

@DeleteMapping("/{id}")
public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
    try {
        eventService.deleteEvent(id);
        return ResponseEntity.ok("Event deleted successfully");
    } catch (Exception e) {
        return ResponseEntity.badRequest().body("Delete failed");
    }
}

}
