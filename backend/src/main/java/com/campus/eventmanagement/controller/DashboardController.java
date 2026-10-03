package com.campus.eventmanagement.controller;

import com.campus.eventmanagement.dto.AdminDashboardDto;
import com.campus.eventmanagement.dto.StudentDashboardDto;
import com.campus.eventmanagement.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @Autowired
    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/admin")
    public ResponseEntity<AdminDashboardDto> getAdminDashboard() {
        return ResponseEntity.ok(dashboardService.getAdminDashboard());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<StudentDashboardDto> getStudentDashboard(@PathVariable Long studentId) {
        return ResponseEntity.ok(dashboardService.getStudentDashboard(studentId));
    }
}
