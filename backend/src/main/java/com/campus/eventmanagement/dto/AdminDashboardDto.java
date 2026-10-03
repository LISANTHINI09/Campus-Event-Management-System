package com.campus.eventmanagement.dto;

import java.util.List;
import java.util.Map;

public class AdminDashboardDto {
    private long totalEvents;
    private long upcomingEvents;
    private long completedEvents;
    private long totalStudents;
    private long totalRegistrations;

    private List<EventResponseDto> recentEvents;
    private List<EventResponseDto> upcomingEventsList;
    private Map<String, Long> categoryWiseEvents;

    public AdminDashboardDto() {}

    public long getTotalEvents() {
        return totalEvents;
    }

    public void setTotalEvents(long totalEvents) {
        this.totalEvents = totalEvents;
    }

    public long getUpcomingEvents() {
        return upcomingEvents;
    }

    public void setUpcomingEvents(long upcomingEvents) {
        this.upcomingEvents = upcomingEvents;
    }

    public long getCompletedEvents() {
        return completedEvents;
    }

    public void setCompletedEvents(long completedEvents) {
        this.completedEvents = completedEvents;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalRegistrations() {
        return totalRegistrations;
    }

    public void setTotalRegistrations(long totalRegistrations) {
        this.totalRegistrations = totalRegistrations;
    }

    public List<EventResponseDto> getRecentEvents() {
        return recentEvents;
    }

    public void setRecentEvents(List<EventResponseDto> recentEvents) {
        this.recentEvents = recentEvents;
    }

    public List<EventResponseDto> getUpcomingEventsList() {
        return upcomingEventsList;
    }

    public void setUpcomingEventsList(List<EventResponseDto> upcomingEventsList) {
        this.upcomingEventsList = upcomingEventsList;
    }

    public Map<String, Long> getCategoryWiseEvents() {
        return categoryWiseEvents;
    }

    public void setCategoryWiseEvents(Map<String, Long> categoryWiseEvents) {
        this.categoryWiseEvents = categoryWiseEvents;
    }
}
