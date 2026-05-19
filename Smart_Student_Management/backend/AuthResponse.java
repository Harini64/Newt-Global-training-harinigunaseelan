package com.edutrack.controller;

import com.edutrack.dto.AttendancePercentageResponse;
import com.edutrack.dto.AttendanceRequest;
import com.edutrack.dto.AttendanceResponse;
import com.edutrack.entity.Student;
import com.edutrack.repository.StudentRepository;
import com.edutrack.security.CustomUserDetails;
import com.edutrack.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final StudentRepository studentRepository;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AttendanceResponse> markAttendance(
            @Valid @RequestBody AttendanceRequest attendanceRequest,
            @RequestParam Long studentId) {
        AttendanceResponse response = attendanceService.markAttendance(attendanceRequest, studentId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AttendanceResponse> getAttendanceById(@PathVariable Long id) {
        AttendanceResponse response = attendanceService.getAttendanceById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<AttendanceResponse>> getAttendanceByStudentId(
            @PathVariable Long studentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "attendanceDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<AttendanceResponse> response = attendanceService.getAttendanceByStudentId(studentId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/student/{studentId}/date-range")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AttendanceResponse>> getAttendanceByStudentIdAndDateRange(
            @PathVariable Long studentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<AttendanceResponse> response = attendanceService.getAttendanceByStudentIdAndDateRange(
                studentId, startDate, endDate);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/student/{studentId}/percentage")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AttendancePercentageResponse> getAttendancePercentage(
            @PathVariable Long studentId) {
        AttendancePercentageResponse response = attendanceService.getAttendancePercentage(studentId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/student/{studentId}/percentage/date-range")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AttendancePercentageResponse> getAttendancePercentageByDateRange(
            @PathVariable Long studentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        AttendancePercentageResponse response = attendanceService.getAttendancePercentageByDateRange(
                studentId, startDate, endDate);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/student/{studentId}/subject/{subject}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AttendanceResponse>> getAttendanceByStudentIdAndSubject(
            @PathVariable Long studentId,
            @PathVariable String subject) {
        List<AttendanceResponse> response = attendanceService.getAttendanceByStudentIdAndSubject(
                studentId, subject);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-attendance")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Page<AttendanceResponse>> getMyAttendance(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "attendanceDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Student student = studentRepository.findByUserId(userDetails.getUserId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<AttendanceResponse> response = attendanceService.getAttendanceByStudentId(student.getId(), pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-attendance/percentage")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<AttendancePercentageResponse> getMyAttendancePercentage(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Student student = studentRepository.findByUserId(userDetails.getUserId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        AttendancePercentageResponse response = attendanceService.getAttendancePercentage(student.getId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAttendance(@PathVariable Long id) {
        attendanceService.deleteAttendance(id);
        return ResponseEntity.noContent().build();
    }
}
