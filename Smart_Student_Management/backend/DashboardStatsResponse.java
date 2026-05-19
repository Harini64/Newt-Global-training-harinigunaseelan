package com.edutrack.controller;

import com.edutrack.dto.MarksRequest;
import com.edutrack.dto.MarksResponse;
import com.edutrack.dto.MarksUpdateRequest;
import com.edutrack.dto.SemesterSummaryResponse;
import com.edutrack.entity.Student;
import com.edutrack.repository.StudentRepository;
import com.edutrack.security.CustomUserDetails;
import com.edutrack.service.MarksService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MarksController {

    private final MarksService marksService;
    private final StudentRepository studentRepository;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MarksResponse> addMarks(
            @Valid @RequestBody MarksRequest marksRequest,
            @RequestParam Long studentId) {
        MarksResponse response = marksService.addMarks(marksRequest, studentId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MarksResponse> updateMarks(
            @PathVariable Long id,
            @Valid @RequestBody MarksUpdateRequest marksUpdateRequest) {
        MarksResponse response = marksService.updateMarks(id, marksUpdateRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MarksResponse> getMarksById(@PathVariable Long id) {
        MarksResponse response = marksService.getMarksById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<MarksResponse>> getMarksByStudentId(
            @PathVariable Long studentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "semester") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<MarksResponse> response = marksService.getMarksByStudentId(studentId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/student/{studentId}/semester/{semester}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MarksResponse>> getMarksByStudentIdAndSemester(
            @PathVariable Long studentId,
            @PathVariable Integer semester) {
        List<MarksResponse> response = marksService.getMarksByStudentIdAndSemester(studentId, semester);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/student/{studentId}/semester/{semester}/summary")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SemesterSummaryResponse> getSemesterSummary(
            @PathVariable Long studentId,
            @PathVariable Integer semester) {
        SemesterSummaryResponse response = marksService.getSemesterSummary(studentId, semester);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/student/{studentId}/all-summaries")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SemesterSummaryResponse>> getAllSemesterSummaries(
            @PathVariable Long studentId) {
        List<SemesterSummaryResponse> response = marksService.getAllSemesterSummaries(studentId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-marks")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Page<MarksResponse>> getMyMarks(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "semester") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Student student = studentRepository.findByUserId(userDetails.getUserId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<MarksResponse> response = marksService.getMarksByStudentId(student.getId(), pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-marks/semester/{semester}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<MarksResponse>> getMyMarksBySemester(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Integer semester) {
        Student student = studentRepository.findByUserId(userDetails.getUserId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        List<MarksResponse> response = marksService.getMarksByStudentIdAndSemester(student.getId(), semester);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-marks/semester/{semester}/summary")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<SemesterSummaryResponse> getMySemesterSummary(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Integer semester) {
        Student student = studentRepository.findByUserId(userDetails.getUserId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        SemesterSummaryResponse response = marksService.getSemesterSummary(student.getId(), semester);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-marks/all-summaries")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<SemesterSummaryResponse>> getMyAllSemesterSummaries(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Student student = studentRepository.findByUserId(userDetails.getUserId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        List<SemesterSummaryResponse> response = marksService.getAllSemesterSummaries(student.getId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMarks(@PathVariable Long id) {
        marksService.deleteMarks(id);
        return ResponseEntity.noContent().build();
    }
}
