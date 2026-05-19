package com.edutrack.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerformanceInsightResponse {

    private Long studentId;
    private String studentName;
    private String registerNumber;
    private Double overallGPA;
    private String performanceLevel;
    private List<String> strongSubjects;
    private List<String> weakSubjects;
    private String recommendation;
}
