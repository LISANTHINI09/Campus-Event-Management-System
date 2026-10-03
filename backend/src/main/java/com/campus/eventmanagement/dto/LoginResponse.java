package com.campus.eventmanagement.dto;

public class LoginResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String department;
    private String year;
    private String phoneNumber;
    private String message;

    public LoginResponse() {}

    public LoginResponse(Long id, String name, String email, String role, String department, String year, String phoneNumber, String message) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.department = department;
        this.year = year;
        this.phoneNumber = phoneNumber;
        this.message = message;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
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

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
