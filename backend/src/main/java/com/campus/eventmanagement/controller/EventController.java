package com.campus.eventmanagement.controller;

import com.campus.eventmanagement.dto.EventDto;
import com.campus.eventmanagement.dto.EventResponseDto;
import com.campus.eventmanagement.service.EventService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    @Autowired
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<List<EventResponseDto>> getEvents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        if (search != null || category != null || status != null || startDate != null || endDate != null) {
            return ResponseEntity.ok(eventService.searchAndFilterEvents(search, category, status, startDate, endDate));
        }
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResponseDto> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @PostMapping
    public ResponseEntity<EventResponseDto> createEvent(@Valid @RequestBody EventDto dto) {
        EventResponseDto created = eventService.createEvent(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventResponseDto> updateEvent(@PathVariable Long id,
                                                        @Valid @RequestBody EventDto dto) {
        return ResponseEntity.ok(eventService.updateEvent(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(Map.of("message", "Event deleted successfully"));
    }
}
