package com.edutrack.dto;

import com.edutrack.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentResponse {

    private Long id;
    private String registerNumber;
    private String department;
    private Integer year;
    private String section;
    private String phone;
    private String address;
    private String gender;
    private LocalDate dateOfBirth;
    private Integer admissionYear;
    private String profileImage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Long userId;
    private String userName;
    private String userEmail;
    private Role userRole;
}
