package com.campus.eventmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String eventName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String category; // Technical, Cultural, Sports, Workshop, Seminar, Hackathon, Club Activity, Other

    @Column(nullable = false)
    private LocalDate eventDate;

    @Column(nullable = false)
    private String startTime;

    private String endTime;

    @Column(nullable = false)
    private String venue;

    @Column(nullable = false)
    private String organizerName;

    @Column(nullable = false)
    private Integer maxParticipants;

    @Column(nullable = false)
    private Integer currentRegisteredCount = 0;

    @Column(nullable = false)
    private LocalDate registrationDeadline;

    @Column(nullable = false)
    private String status = "UPCOMING"; // UPCOMING, ONGOING, COMPLETED, CANCELLED

    private LocalDate createdDate = LocalDate.now();

    public Event() {
    }

    public Event(String eventName, String description, String category, LocalDate eventDate,
                 String startTime, String endTime, String venue, String organizerName,
                 Integer maxParticipants, LocalDate registrationDeadline) {
        this.eventName = eventName;
        this.description = description;
        this.category = category;
        this.eventDate = eventDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.venue = venue;
        this.organizerName = organizerName;
        this.maxParticipants = maxParticipants;
        this.currentRegisteredCount = 0;
        this.registrationDeadline = registrationDeadline;
        this.status = "UPCOMING";
        this.createdDate = LocalDate.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public String getOrganizerName() {
        return organizerName;
    }

    public void setOrganizerName(String organizerName) {
        this.organizerName = organizerName;
    }

    public Integer getMaxParticipants() {
        return maxParticipants;
    }

    public void setMaxParticipants(Integer maxParticipants) {
        this.maxParticipants = maxParticipants;
    }

    public Integer getCurrentRegisteredCount() {
        return currentRegisteredCount;
    }

    public void setCurrentRegisteredCount(Integer currentRegisteredCount) {
        this.currentRegisteredCount = currentRegisteredCount;
    }

    public LocalDate getRegistrationDeadline() {
        return registrationDeadline;
    }

    public void setRegistrationDeadline(LocalDate registrationDeadline) {
        this.registrationDeadline = registrationDeadline;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }
}
