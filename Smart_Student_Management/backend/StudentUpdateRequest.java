package com.edutrack.dto;

import com.edutrack.enums.ExamType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarksRequest {

    @NotBlank(message = "Subject is required")
    private String subject;

    @Min(value = 0, message = "Internal marks cannot be negative")
    @Max(value = 100, message = "Internal marks cannot exceed 100")
    private Integer internalMarks;

    @Min(value = 0, message = "External marks cannot be negative")
    @Max(value = 100, message = "External marks cannot exceed 100")
    private Integer externalMarks;

    @NotNull(message = "Semester is required")
    @Min(value = 1, message = "Semester must be at least 1")
    @Max(value = 8, message = "Semester cannot exceed 8")
    private Integer semester;

    @NotNull(message = "Exam type is required")
    private ExamType examType;
}
