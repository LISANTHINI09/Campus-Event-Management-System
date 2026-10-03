package com.campus.eventmanagement.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RegistrationRequestDto {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Event ID is required")
    private Long eventId;

    @NotBlank(message = "Participant full name is required")
    private String fullName;

    @NotBlank(message = "Participant email is required")
    @Email(message = "Please provide a valid participant email")
    private String email;

    @NotBlank(message = "Participant phone number is required")
    private String phoneNumber;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Year is required")
    private String year;

    @NotBlank(message = "College name is required")
    private String collegeName;

    @NotBlank(message = "Roll / Register number is required")
    private String rollNumber;

    private String paymentStatus; // NOT_REQUIRED, PAID
    private String paymentReference;

    public RegistrationRequestDto() {}

    public RegistrationRequestDto(Long studentId, Long eventId) {
        this.studentId = studentId;
        this.eventId = eventId;
    }

    public RegistrationRequestDto(Long studentId, Long eventId, String fullName, String email,
                                 String phoneNumber, String department, String year,
                                 String collegeName, String rollNumber, String paymentStatus,
                                 String paymentReference) {
        this.studentId = studentId;
        this.eventId = eventId;
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.department = department;
        this.year = year;
        this.collegeName = collegeName;
        this.rollNumber = rollNumber;
        this.paymentStatus = paymentStatus;
        this.paymentReference = paymentReference;
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

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getCollegeName() {
        return collegeName;
    }

    public void setCollegeName(String collegeName) {
        this.collegeName = collegeName;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentReference() {
        return paymentReference;
    }

    public void setPaymentReference(String paymentReference) {
        this.paymentReference = paymentReference;
    }
}
