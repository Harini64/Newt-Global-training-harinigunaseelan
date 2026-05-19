package com.edutrack.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class StudentRequest {

    @NotBlank(message = "Register number is required")
    @Pattern(regexp = "^[A-Za-z0-9]+$", message = "Register number must be alphanumeric")
    private String registerNumber;

    @NotBlank(message = "Department is required")
    @Size(min = 2, max = 100, message = "Department must be between 2 and 100 characters")
    private String department;

    @NotNull(message = "Year is required")
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

    /**
     * When set together, a new {@link com.edutrack.entity.User} with role STUDENT is created
     * and linked to this student record (required for admin "add student" flow).
     */
    private String studentName;

    private String studentEmail;

    private String studentPassword;
}
