package com.edutrack.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {

    private Long totalStudents;
    private Long totalDepartments;
    private Long totalAttendanceRecords;
    private Long totalMarksRecords;
    private Double averageAttendancePercentage;
    private Long lowAttendanceStudents;
    private Long passingStudents;
    private Long failingStudents;
}
