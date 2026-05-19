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
public class DepartmentStatsResponse {

    private String department;
    private Long totalStudents;
    private Double averageAttendance;
    private Double averageGPA;
    private Long passingStudents;
    private Long failingStudents;
    private Map<String, Double> subjectAverages;
}
