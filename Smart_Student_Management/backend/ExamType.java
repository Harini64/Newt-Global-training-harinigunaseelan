package com.edutrack.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopperResponse {

    private Long studentId;
    private String studentName;
    private String registerNumber;
    private String department;
    private Integer year;
    private Double totalMarks;
    private Double averageMarks;
    private Double gpa;
    private Integer rank;
}
