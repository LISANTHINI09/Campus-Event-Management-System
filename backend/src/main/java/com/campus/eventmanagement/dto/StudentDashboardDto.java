package com.campus.eventmanagement.dto;

import java.util.List;

public class StudentDashboardDto {
    private Long studentId;
    private String studentName;
    private long totalRegisteredEvents;
    private long upcomingRegisteredEvents;

    private List<RegistrationResponseDto> myUpcomingRegistrations;
    private List<RegistrationResponseDto> recentRegistrations;
    private List<EventResponseDto> recommendedEvents;

    public StudentDashboardDto() {}

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public long getTotalRegisteredEvents() {
        return totalRegisteredEvents;
    }

    public void setTotalRegisteredEvents(long totalRegisteredEvents) {
        this.totalRegisteredEvents = totalRegisteredEvents;
    }

    public long getUpcomingRegisteredEvents() {
        return upcomingRegisteredEvents;
    }

    public void setUpcomingRegisteredEvents(long upcomingRegisteredEvents) {
        this.upcomingRegisteredEvents = upcomingRegisteredEvents;
    }

    public List<RegistrationResponseDto> getMyUpcomingRegistrations() {
        return myUpcomingRegistrations;
    }

    public void setMyUpcomingRegistrations(List<RegistrationResponseDto> myUpcomingRegistrations) {
        this.myUpcomingRegistrations = myUpcomingRegistrations;
    }

    public List<RegistrationResponseDto> getRecentRegistrations() {
        return recentRegistrations;
    }

    public void setRecentRegistrations(List<RegistrationResponseDto> recentRegistrations) {
        this.recentRegistrations = recentRegistrations;
    }

    public List<EventResponseDto> getRecommendedEvents() {
        return recommendedEvents;
    }

    public void setRecommendedEvents(List<EventResponseDto> recommendedEvents) {
        this.recommendedEvents = recommendedEvents;
    }
}
