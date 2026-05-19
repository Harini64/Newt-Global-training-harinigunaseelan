package com.edutrack.entity;

import com.edutrack.enums.ExamType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "marks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Marks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String subject;

    @Column(name = "internal_marks")
    private Integer internalMarks;

    @Column(name = "external_marks")
    private Integer externalMarks;

    @Column(name = "total_marks")
    private Integer totalMarks;

    @Column
    private String grade;

    @Column(nullable = false)
    private Integer semester;

    @Enumerated(EnumType.STRING)
    @Column(name = "exam_type", nullable = false)
    private ExamType examType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
