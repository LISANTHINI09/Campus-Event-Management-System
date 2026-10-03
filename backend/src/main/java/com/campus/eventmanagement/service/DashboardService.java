package com.campus.eventmanagement.service;

import com.campus.eventmanagement.dto.AdminDashboardDto;
import com.campus.eventmanagement.dto.EventResponseDto;
import com.campus.eventmanagement.dto.RegistrationResponseDto;
import com.campus.eventmanagement.dto.StudentDashboardDto;
import com.campus.eventmanagement.entity.Event;
import com.campus.eventmanagement.entity.Registration;
import com.campus.eventmanagement.entity.Student;
import com.campus.eventmanagement.exception.ResourceNotFoundException;
import com.campus.eventmanagement.repository.EventRepository;
import com.campus.eventmanagement.repository.RegistrationRepository;
import com.campus.eventmanagement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final EventRepository eventRepository;
    private final StudentRepository studentRepository;
    private final RegistrationRepository registrationRepository;
    private final EventService eventService;
    private final RegistrationService registrationService;

    @Autowired
    public DashboardService(EventRepository eventRepository,
                            StudentRepository studentRepository,
                            RegistrationRepository registrationRepository,
                            EventService eventService,
                            RegistrationService registrationService) {
        this.eventRepository = eventRepository;
        this.studentRepository = studentRepository;
        this.registrationRepository = registrationRepository;
        this.eventService = eventService;
        this.registrationService = registrationService;
    }

    public AdminDashboardDto getAdminDashboard() {
        AdminDashboardDto dto = new AdminDashboardDto();

        List<Event> allEvents = eventRepository.findAll();
        dto.setTotalEvents(allEvents.size());
        dto.setUpcomingEvents(allEvents.stream().filter(e -> "UPCOMING".equalsIgnoreCase(e.getStatus())).count());
        dto.setCompletedEvents(allEvents.stream().filter(e -> "COMPLETED".equalsIgnoreCase(e.getStatus())).count());
        dto.setTotalStudents(studentRepository.countByRole("STUDENT"));
        dto.setTotalRegistrations(registrationRepository.countByStatus("REGISTERED"));

        // Recent 5 events
        List<EventResponseDto> recent = eventRepository.findTop5ByOrderByCreatedDateDesc().stream()
                .map(eventService::mapToResponseDto)
                .collect(Collectors.toList());
        dto.setRecentEvents(recent);

        // Upcoming 5 events
        List<EventResponseDto> upcoming = eventRepository.findTop5ByStatusOrderByEventDateAsc("UPCOMING").stream()
                .map(eventService::mapToResponseDto)
                .collect(Collectors.toList());
        dto.setUpcomingEventsList(upcoming);

        // Category breakdown
        Map<String, Long> categoryMap = new HashMap<>();
        for (Event e : allEvents) {
            String cat = e.getCategory();
            categoryMap.put(cat, categoryMap.getOrDefault(cat, 0L) + 1);
        }
        dto.setCategoryWiseEvents(categoryMap);

        return dto;
    }

    public StudentDashboardDto getStudentDashboard(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));

        StudentDashboardDto dto = new StudentDashboardDto();
        dto.setStudentId(student.getId());
        dto.setStudentName(student.getName());

        List<Registration> studentRegistrations = registrationRepository.findByStudentIdOrderByRegistrationDateDesc(studentId);

        long activeRegistrations = studentRegistrations.stream()
                .filter(r -> "REGISTERED".equalsIgnoreCase(r.getStatus()))
                .count();
        dto.setTotalRegisteredEvents(activeRegistrations);

        long upcomingCount = studentRegistrations.stream()
                .filter(r -> "REGISTERED".equalsIgnoreCase(r.getStatus()) 
                        && r.getEvent().getEventDate().isAfter(LocalDate.now().minusDays(1)))
                .count();
        dto.setUpcomingRegisteredEvents(upcomingCount);

        // Upcoming registered events
        List<RegistrationResponseDto> upcomingRegs = studentRegistrations.stream()
                .filter(r -> "REGISTERED".equalsIgnoreCase(r.getStatus()) 
                        && r.getEvent().getEventDate().isAfter(LocalDate.now().minusDays(1)))
                .limit(5)
                .map(registrationService::mapToResponseDto)
                .collect(Collectors.toList());
        dto.setMyUpcomingRegistrations(upcomingRegs);

        // Recent 5 registrations
        List<RegistrationResponseDto> recent = studentRegistrations.stream()
                .limit(5)
                .map(registrationService::mapToResponseDto)
                .collect(Collectors.toList());
        dto.setRecentRegistrations(recent);

        // Recommended / upcoming general events (limit 4)
        List<EventResponseDto> recommended = eventRepository.findByStatusOrderByEventDateAsc("UPCOMING").stream()
                .limit(4)
                .map(eventService::mapToResponseDto)
                .collect(Collectors.toList());
        dto.setRecommendedEvents(recommended);

        return dto;
    }
}
