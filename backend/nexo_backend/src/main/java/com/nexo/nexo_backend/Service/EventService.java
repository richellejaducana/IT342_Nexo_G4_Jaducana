package com.nexo.nexo_backend.Service;

import com.nexo.nexo_backend.Entity.Event;
import com.nexo.nexo_backend.Repository.EventRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
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

    public Optional<Event> getEventById(Long id) {
    return eventRepository.findById(id);
}

public void deleteEvent(Long id) {
    eventRepository.deleteById(id);
}

}
