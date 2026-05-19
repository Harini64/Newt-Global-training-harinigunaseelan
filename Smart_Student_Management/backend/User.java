package com.edutrack.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentUpdateRequest {

    private String department;

    private Integer year;

    private String section;

    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
    private String phone;

    @Size(max = 255, message = "Address must not exceed 255 characters")
    private String address;

    private String gender;

    private String dateOfBirth;

    private Integer admissionYear;

    private String profileImage;
}
