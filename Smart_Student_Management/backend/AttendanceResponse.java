package com.edutrack.controller;

import com.edutrack.dto.*;
import com.edutrack.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        DashboardStatsResponse response = analyticsService.getDashboardStats();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/top-students")
    public ResponseEntity<List<TopperResponse>> getTopStudents(
            @RequestParam(defaultValue = "10") Integer limit) {
        List<TopperResponse> response = analyticsService.getTopStudents(limit);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/top-students/department/{department}")
    public ResponseEntity<List<TopperResponse>> getTopStudentsByDepartment(
            @PathVariable String department,
            @RequestParam(defaultValue = "10") Integer limit) {
        List<TopperResponse> response = analyticsService.getTopStudentsByDepartment(department, limit);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/departments")
    public ResponseEntity<List<DepartmentStatsResponse>> getDepartmentStats() {
        List<DepartmentStatsResponse> response = analyticsService.getDepartmentStats();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/subjects")
    public ResponseEntity<List<SubjectStatsResponse>> getSubjectStats() {
        List<SubjectStatsResponse> response = analyticsService.getSubjectStats();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/performance/{studentId}")
    public ResponseEntity<PerformanceInsightResponse> getPerformanceInsights(
            @PathVariable Long studentId) {
        PerformanceInsightResponse response = analyticsService.getPerformanceInsights(studentId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/performance/all")
    public ResponseEntity<List<PerformanceInsightResponse>> getAllPerformanceInsights() {
        List<PerformanceInsightResponse> response = analyticsService.getAllPerformanceInsights();
        return ResponseEntity.ok(response);
    }
}
