package com.edutrack.dto;

import com.edutrack.enums.ExamType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarksResponse {

    private Long id;
    private String subject;
    private Integer internalMarks;
    private Integer externalMarks;
    private Integer totalMarks;
    private String grade;
    private Double gpa;
    private Integer semester;
    private ExamType examType;
    private Long studentId;
    private String studentName;
    private String studentRegisterNumber;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
