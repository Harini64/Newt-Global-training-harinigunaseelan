package com.edutrack.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubjectStatsResponse {

    private String subject;
    private Double averageMarks;
    private Long totalStudents;
    private Long passingStudents;
    private Long failingStudents;
    private Double passPercentage;
}
