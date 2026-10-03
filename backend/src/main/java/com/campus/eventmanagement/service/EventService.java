package com.campus.eventmanagement.service;

import com.campus.eventmanagement.dto.EventDto;
import com.campus.eventmanagement.dto.EventResponseDto;
import com.campus.eventmanagement.entity.Event;
import com.campus.eventmanagement.exception.BadRequestException;
import com.campus.eventmanagement.exception.ResourceNotFoundException;
import com.campus.eventmanagement.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;

    @Autowired
    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<EventResponseDto> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public EventResponseDto getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));
        return mapToResponseDto(event);
    }

    public EventResponseDto createEvent(EventDto dto) {
        if (dto.getRegistrationDeadline().isAfter(dto.getEventDate())) {
            throw new BadRequestException("Registration deadline cannot be after the event date");
        }

        Event event = new Event();
        event.setEventName(dto.getEventName().trim());
        event.setDescription(dto.getDescription());
        event.setCategory(dto.getCategory());
        event.setEventDate(dto.getEventDate());
        event.setStartTime(dto.getStartTime());
        event.setEndTime(dto.getEndTime());
        event.setVenue(dto.getVenue().trim());
        event.setOrganizerName(dto.getOrganizerName().trim());
        event.setMaxParticipants(dto.getMaxParticipants());
        event.setCurrentRegisteredCount(0);
        event.setRegistrationDeadline(dto.getRegistrationDeadline());
        event.setStatus(dto.getStatus() != null && !dto.getStatus().isEmpty() ? dto.getStatus() : "UPCOMING");
        event.setRegistrationFee(dto.getRegistrationFee() != null ? dto.getRegistrationFee() : BigDecimal.ZERO);
        event.setCreatedDate(LocalDate.now());

        Event saved = eventRepository.save(event);
        return mapToResponseDto(saved);
    }

    public EventResponseDto updateEvent(Long id, EventDto dto) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        if (dto.getRegistrationDeadline().isAfter(dto.getEventDate())) {
            throw new BadRequestException("Registration deadline cannot be after the event date");
        }

        if (dto.getMaxParticipants() < event.getCurrentRegisteredCount()) {
            throw new BadRequestException("Maximum participants cannot be less than current registered count (" 
                    + event.getCurrentRegisteredCount() + ")");
        }

        event.setEventName(dto.getEventName().trim());
        event.setDescription(dto.getDescription());
        event.setCategory(dto.getCategory());
        event.setEventDate(dto.getEventDate());
        event.setStartTime(dto.getStartTime());
        event.setEndTime(dto.getEndTime());
        event.setVenue(dto.getVenue().trim());
        event.setOrganizerName(dto.getOrganizerName().trim());
        event.setMaxParticipants(dto.getMaxParticipants());
        event.setRegistrationDeadline(dto.getRegistrationDeadline());
        if (dto.getRegistrationFee() != null) {
            event.setRegistrationFee(dto.getRegistrationFee());
        }

        if (dto.getStatus() != null && !dto.getStatus().isEmpty()) {
            event.setStatus(dto.getStatus());
        }

        Event updated = eventRepository.save(event);
        return mapToResponseDto(updated);
    }

    public void deleteEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));
        eventRepository.delete(event);
    }

    public List<EventResponseDto> searchAndFilterEvents(String search, String category, String status, LocalDate startDate, LocalDate endDate) {
        return eventRepository.searchAndFilterEvents(
                (search != null && !search.trim().isEmpty()) ? search.trim() : null,
                (category != null && !category.trim().isEmpty()) ? category.trim() : null,
                (status != null && !status.trim().isEmpty()) ? status.trim() : null,
                startDate,
                endDate
        ).stream().map(this::mapToResponseDto).collect(Collectors.toList());
    }

    public EventResponseDto mapToResponseDto(Event event) {
        EventResponseDto dto = new EventResponseDto();
        dto.setId(event.getId());
        dto.setEventName(event.getEventName());
        dto.setDescription(event.getDescription());
        dto.setCategory(event.getCategory());
        dto.setEventDate(event.getEventDate());
        dto.setStartTime(event.getStartTime());
        dto.setEndTime(event.getEndTime());
        dto.setVenue(event.getVenue());
        dto.setOrganizerName(event.getOrganizerName());
        dto.setMaxParticipants(event.getMaxParticipants());
        dto.setCurrentRegisteredCount(event.getCurrentRegisteredCount());

        int available = Math.max(0, event.getMaxParticipants() - event.getCurrentRegisteredCount());
        dto.setAvailableSeats(available);
        dto.setRegistrationDeadline(event.getRegistrationDeadline());
        dto.setStatus(event.getStatus());
        dto.setCreatedDate(event.getCreatedDate());
        dto.setRegistrationFee(event.getRegistrationFee() != null ? event.getRegistrationFee() : BigDecimal.ZERO);

        boolean closed = LocalDate.now().isAfter(event.getRegistrationDeadline())
                || event.getCurrentRegisteredCount() >= event.getMaxParticipants()
                || "COMPLETED".equalsIgnoreCase(event.getStatus())
                || "CANCELLED".equalsIgnoreCase(event.getStatus());
        dto.setRegistrationClosed(closed);

        return dto;
    }
}
