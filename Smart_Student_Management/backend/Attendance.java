package com.edutrack.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SemesterSummaryResponse {

    private Long studentId;
    private String studentName;
    private String registerNumber;
    private Integer semester;
    private Double totalMarks;
    private Double averageMarks;
    private Double semesterGPA;
    private String overallGrade;
    private Integer totalSubjects;
    private Integer passedSubjects;
    private Integer failedSubjects;
    private List<MarksResponse> marksList;
    private Map<String, String> subjectGrades;
    private String weakSubjects;
}
