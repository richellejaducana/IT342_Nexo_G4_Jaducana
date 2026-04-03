package com.nexo.nexo_backend.Service;

import com.nexo.nexo_backend.Entity.Event;
import com.nexo.nexo_backend.Repository.EventRepository;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }
}
