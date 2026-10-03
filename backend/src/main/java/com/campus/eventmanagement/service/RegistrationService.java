package com.campus.eventmanagement.service;

import com.campus.eventmanagement.dto.RegistrationRequestDto;
import com.campus.eventmanagement.dto.RegistrationResponseDto;
import com.campus.eventmanagement.entity.Event;
import com.campus.eventmanagement.entity.Registration;
import com.campus.eventmanagement.entity.Student;
import com.campus.eventmanagement.exception.BadRequestException;
import com.campus.eventmanagement.exception.ResourceNotFoundException;
import com.campus.eventmanagement.repository.EventRepository;
import com.campus.eventmanagement.repository.RegistrationRepository;
import com.campus.eventmanagement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final StudentRepository studentRepository;

    @Autowired
    public RegistrationService(RegistrationRepository registrationRepository,
                               EventRepository eventRepository,
                               StudentRepository studentRepository) {
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
        this.studentRepository = studentRepository;
    }

    @Transactional
    public RegistrationResponseDto registerForEvent(RegistrationRequestDto request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + request.getStudentId()));

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + request.getEventId()));

        // Business Rule 1: Check event status
        if ("CANCELLED".equalsIgnoreCase(event.getStatus())) {
            throw new BadRequestException("Registration failed: This event has been cancelled");
        }
        if ("COMPLETED".equalsIgnoreCase(event.getStatus())) {
            throw new BadRequestException("Registration failed: This event has already taken place");
        }

        // Business Rule 2: Registration deadline
        if (LocalDate.now().isAfter(event.getRegistrationDeadline())) {
            throw new BadRequestException("Registration failed: The registration deadline was " + event.getRegistrationDeadline());
        }

        // Business Rule 3: Payment validation for paid events
        boolean isPaidEvent = event.getRegistrationFee() != null && event.getRegistrationFee().compareTo(BigDecimal.ZERO) > 0;
        String finalPaymentStatus = "NOT_REQUIRED";
        String finalPaymentReference = null;
        if (isPaidEvent) {
            if (!"PAID".equalsIgnoreCase(request.getPaymentStatus()) || request.getPaymentReference() == null || request.getPaymentReference().trim().isEmpty()) {
                throw new BadRequestException("Registration failed: Payment must be completed before final registration for paid events");
            }
            finalPaymentStatus = "PAID";
            finalPaymentReference = request.getPaymentReference().trim();
        }

        // Resolve participant details with fallbacks to student profile
        String fullName = (request.getFullName() != null && !request.getFullName().trim().isEmpty())
                ? request.getFullName().trim() : student.getName();
        String email = (request.getEmail() != null && !request.getEmail().trim().isEmpty())
                ? request.getEmail().trim() : student.getEmail();
        String phoneNumber = (request.getPhoneNumber() != null && !request.getPhoneNumber().trim().isEmpty())
                ? request.getPhoneNumber().trim() : student.getPhoneNumber();
        String department = (request.getDepartment() != null && !request.getDepartment().trim().isEmpty())
                ? request.getDepartment().trim() : student.getDepartment();
        String year = (request.getYear() != null && !request.getYear().trim().isEmpty())
                ? request.getYear().trim() : student.getYear();
        String collegeName = (request.getCollegeName() != null && !request.getCollegeName().trim().isEmpty())
                ? request.getCollegeName().trim() : (student.getCollegeName() != null ? student.getCollegeName() : "Campus University");
        String rollNumber = request.getRollNumber() != null ? request.getRollNumber().trim() : "";

        // Business Rule 4: Check duplicate registration or reactivate cancelled one
        Optional<Registration> existingOpt = registrationRepository.findByStudentIdAndEventId(student.getId(), event.getId());
        if (existingOpt.isPresent()) {
            Registration existing = existingOpt.get();
            if ("REGISTERED".equalsIgnoreCase(existing.getStatus()) || "ATTENDED".equalsIgnoreCase(existing.getStatus())) {
                throw new BadRequestException("You are already registered for this event");
            } else if ("CANCELLED".equalsIgnoreCase(existing.getStatus())) {
                // Check capacity before reactivating
                if (event.getCurrentRegisteredCount() >= event.getMaxParticipants()) {
                    throw new BadRequestException("Registration failed: Event has reached maximum capacity of " + event.getMaxParticipants() + " attendees");
                }
                existing.setStatus("REGISTERED");
                existing.setRegistrationDate(LocalDateTime.now());
                existing.setFullName(fullName);
                existing.setEmail(email);
                existing.setPhoneNumber(phoneNumber);
                existing.setDepartment(department);
                existing.setYear(year);
                existing.setCollegeName(collegeName);
                existing.setRollNumber(rollNumber);
                existing.setPaymentStatus(finalPaymentStatus);
                existing.setPaymentReference(finalPaymentReference);

                event.setCurrentRegisteredCount(event.getCurrentRegisteredCount() + 1);
                eventRepository.save(event);
                Registration saved = registrationRepository.save(existing);
                return mapToResponseDto(saved);
            }
        }

        // Business Rule 5: Maximum capacity
        if (event.getCurrentRegisteredCount() >= event.getMaxParticipants()) {
            throw new BadRequestException("Registration failed: Event has reached maximum capacity of " + event.getMaxParticipants() + " attendees");
        }

        // Create new registration with participant snapshot and payment details
        Registration registration = new Registration(
                student,
                event,
                LocalDateTime.now(),
                "REGISTERED",
                fullName,
                email,
                phoneNumber,
                department,
                year,
                collegeName,
                rollNumber,
                finalPaymentStatus,
                finalPaymentReference
        );
        event.setCurrentRegisteredCount(event.getCurrentRegisteredCount() + 1);
        eventRepository.save(event);

        Registration saved = registrationRepository.save(registration);
        return mapToResponseDto(saved);
    }

    public List<RegistrationResponseDto> getRegistrationsByStudent(Long studentId) {
        return registrationRepository.findByStudentIdOrderByRegistrationDateDesc(studentId).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public List<RegistrationResponseDto> getRegistrationsByEvent(Long eventId) {
        return registrationRepository.findByEventIdOrderByRegistrationDateDesc(eventId).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public List<RegistrationResponseDto> getAllRegistrations() {
        return registrationRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public RegistrationResponseDto cancelRegistration(Long registrationId) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with ID: " + registrationId));

        if ("CANCELLED".equalsIgnoreCase(registration.getStatus())) {
            throw new BadRequestException("Registration is already cancelled");
        }

        registration.setStatus("CANCELLED");

        // Free up slot
        Event event = registration.getEvent();
        if (event.getCurrentRegisteredCount() > 0) {
            event.setCurrentRegisteredCount(event.getCurrentRegisteredCount() - 1);
            eventRepository.save(event);
        }

        Registration updated = registrationRepository.save(registration);
        return mapToResponseDto(updated);
    }

    @Transactional
    public RegistrationResponseDto updateRegistrationStatus(Long registrationId, String newStatus) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with ID: " + registrationId));

        String oldStatus = registration.getStatus();
        if (oldStatus.equalsIgnoreCase(newStatus)) {
            return mapToResponseDto(registration);
        }

        Event event = registration.getEvent();

        if ("CANCELLED".equalsIgnoreCase(newStatus) && !"CANCELLED".equalsIgnoreCase(oldStatus)) {
            if (event.getCurrentRegisteredCount() > 0) {
                event.setCurrentRegisteredCount(event.getCurrentRegisteredCount() - 1);
                eventRepository.save(event);
            }
        } else if ("REGISTERED".equalsIgnoreCase(newStatus) && "CANCELLED".equalsIgnoreCase(oldStatus)) {
            if (event.getCurrentRegisteredCount() >= event.getMaxParticipants()) {
                throw new BadRequestException("Cannot reactivate registration: Event is at maximum capacity");
            }
            event.setCurrentRegisteredCount(event.getCurrentRegisteredCount() + 1);
            eventRepository.save(event);
        }

        registration.setStatus(newStatus.toUpperCase());
        Registration saved = registrationRepository.save(registration);
        return mapToResponseDto(saved);
    }

    public RegistrationResponseDto mapToResponseDto(Registration reg) {
        RegistrationResponseDto dto = new RegistrationResponseDto();
        dto.setId(reg.getId());

        // Resolve participant information (snapshot from registration or fallback to student profile)
        String participantName = reg.getFullName() != null && !reg.getFullName().isEmpty()
                ? reg.getFullName()
                : (reg.getStudent() != null ? reg.getStudent().getName() : null);
        String participantEmail = reg.getEmail() != null && !reg.getEmail().isEmpty()
                ? reg.getEmail()
                : (reg.getStudent() != null ? reg.getStudent().getEmail() : null);
        String participantPhone = reg.getPhoneNumber() != null && !reg.getPhoneNumber().isEmpty()
                ? reg.getPhoneNumber()
                : (reg.getStudent() != null ? reg.getStudent().getPhoneNumber() : null);
        String participantDept = reg.getDepartment() != null && !reg.getDepartment().isEmpty()
                ? reg.getDepartment()
                : (reg.getStudent() != null ? reg.getStudent().getDepartment() : null);
        String participantYear = reg.getYear() != null && !reg.getYear().isEmpty()
                ? reg.getYear()
                : (reg.getStudent() != null ? reg.getStudent().getYear() : null);
        String participantCollege = reg.getCollegeName() != null && !reg.getCollegeName().isEmpty()
                ? reg.getCollegeName()
                : (reg.getStudent() != null ? reg.getStudent().getCollegeName() : null);

        dto.setFullName(participantName);
        dto.setEmail(participantEmail);
        dto.setPhoneNumber(participantPhone);
        dto.setDepartment(participantDept);
        dto.setYear(participantYear);
        dto.setCollegeName(participantCollege);
        dto.setRollNumber(reg.getRollNumber() != null ? reg.getRollNumber() : "");

        dto.setPaymentStatus(reg.getPaymentStatus() != null ? reg.getPaymentStatus() : "NOT_REQUIRED");
        dto.setPaymentReference(reg.getPaymentReference());

        if (reg.getStudent() != null) {
            dto.setStudentId(reg.getStudent().getId());
            dto.setStudentName(participantName);
            dto.setStudentEmail(participantEmail);
            dto.setStudentDepartment(participantDept);
            dto.setStudentYear(participantYear);
            dto.setStudentPhone(participantPhone);
        }

        if (reg.getEvent() != null) {
            dto.setEventId(reg.getEvent().getId());
            dto.setEventName(reg.getEvent().getEventName());
            dto.setEventCategory(reg.getEvent().getCategory());
            dto.setEventDate(reg.getEvent().getEventDate());
            dto.setEventStartTime(reg.getEvent().getStartTime());
            dto.setEventVenue(reg.getEvent().getVenue());
            dto.setRegistrationFee(reg.getEvent().getRegistrationFee() != null ? reg.getEvent().getRegistrationFee() : BigDecimal.ZERO);
        } else {
            dto.setRegistrationFee(BigDecimal.ZERO);
        }

        dto.setRegistrationDate(reg.getRegistrationDate());
        dto.setStatus(reg.getStatus());
        return dto;
    }
}
