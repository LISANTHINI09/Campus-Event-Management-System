package com.campus.eventmanagement.dto;

import jakarta.validation.constraints.NotNull;

public class RegistrationRequestDto {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Event ID is required")
    private Long eventId;

    public RegistrationRequestDto() {}

    public RegistrationRequestDto(Long studentId, Long eventId) {
        this.studentId = studentId;
        this.eventId = eventId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }
}
