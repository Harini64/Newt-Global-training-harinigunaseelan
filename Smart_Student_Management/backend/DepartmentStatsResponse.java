package com.edutrack.controller;

import com.edutrack.dto.StudentRequest;
import com.edutrack.dto.StudentResponse;
import com.edutrack.dto.StudentUpdateRequest;
import com.edutrack.enums.Role;
import com.edutrack.security.CustomUserDetails;
import com.edutrack.service.StudentService;
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

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService studentService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentResponse> createStudent(
            @Valid @RequestBody StudentRequest studentRequest,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        StudentResponse response = studentService.createStudent(studentRequest, userDetails.getUserId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/register-number/{registerNumber}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentResponse> getStudentByRegisterNumber(@PathVariable String registerNumber) {
        StudentResponse response = studentService.getStudentByRegisterNumber(registerNumber);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentResponse> getCurrentStudent(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        StudentResponse response = studentService.getStudentByUserId(userDetails.getUserId());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<StudentResponse>> getAllStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<StudentResponse> response = studentService.getAllStudents(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<StudentResponse>> searchStudents(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<StudentResponse> response = studentService.searchStudents(keyword, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/department/{department}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<StudentResponse>> getStudentsByDepartment(
            @PathVariable String department,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<StudentResponse> response = studentService.getStudentsByDepartment(department, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/year/{year}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<StudentResponse>> getStudentsByYear(
            @PathVariable Integer year,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<StudentResponse> response = studentService.getStudentsByYear(year, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/filter")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<StudentResponse>> getStudentsByDepartmentAndYear(
            @RequestParam String department,
            @RequestParam Integer year,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<StudentResponse> response = studentService.getStudentsByDepartmentAndYear(department, year, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentResponse> getStudentById(@PathVariable Long id) {
        StudentResponse response = studentService.getStudentById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentResponse> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentUpdateRequest studentUpdateRequest) {
        StudentResponse response = studentService.updateStudent(id, studentUpdateRequest);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
}
