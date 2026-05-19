package com.edutrack.dto;

import com.edutrack.enums.ExamType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarksUpdateRequest {

    private String subject;

    @Min(value = 0, message = "Internal marks cannot be negative")
    @Max(value = 100, message = "Internal marks cannot exceed 100")
    private Integer internalMarks;

    @Min(value = 0, message = "External marks cannot be negative")
    @Max(value = 100, message = "External marks cannot exceed 100")
    private Integer externalMarks;

    private Integer semester;

    private ExamType examType;
}
