package com.edutrack.dto;

import com.edutrack.enums.AttendanceStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRequest {

    @NotNull(message = "Attendance date is required")
    private LocalDate attendanceDate;

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotNull(message = "Status is required")
    private AttendanceStatus status;

    private String remarks;
}
