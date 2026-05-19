package com.edutrack.dto;

import com.edutrack.enums.AttendanceStatus;
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
public class AttendanceResponse {

    private Long id;
    private LocalDate attendanceDate;
    private String subject;
    private AttendanceStatus status;
    private String remarks;
    private Long studentId;
    private String studentName;
    private String studentRegisterNumber;
    private LocalDateTime createdAt;
}
