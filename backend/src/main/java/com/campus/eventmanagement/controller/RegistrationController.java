package com.campus.eventmanagement.controller;

import com.campus.eventmanagement.dto.RegistrationRequestDto;
import com.campus.eventmanagement.dto.RegistrationResponseDto;
import com.campus.eventmanagement.service.RegistrationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    private final RegistrationService registrationService;

    @Autowired
    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping
    public ResponseEntity<RegistrationResponseDto> register(@Valid @RequestBody RegistrationRequestDto request) {
        RegistrationResponseDto response = registrationService.registerForEvent(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<RegistrationResponseDto>> getAllRegistrations() {
        return ResponseEntity.ok(registrationService.getAllRegistrations());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<RegistrationResponseDto>> getRegistrationsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(registrationService.getRegistrationsByStudent(studentId));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<RegistrationResponseDto>> getRegistrationsByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(registrationService.getRegistrationsByEvent(eventId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<RegistrationResponseDto> cancelRegistration(@PathVariable Long id) {
        RegistrationResponseDto response = registrationService.cancelRegistration(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<RegistrationResponseDto> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusBody) {
        String newStatus = statusBody.get("status");
        RegistrationResponseDto response = registrationService.updateRegistrationStatus(id, newStatus);
        return ResponseEntity.ok(response);
    }
}
