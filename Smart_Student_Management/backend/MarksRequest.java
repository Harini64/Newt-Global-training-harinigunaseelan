package com.edutrack.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendancePercentageResponse {

    private Long studentId;
    private String studentName;
    private String registerNumber;
    private Double overallPercentage;
    private Long totalClasses;
    private Long presentClasses;
    private Long absentClasses;
    private Map<String, Double> subjectWisePercentage;
    private Boolean isLowAttendance;
    private String alertMessage;
}
