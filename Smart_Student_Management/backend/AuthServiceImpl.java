package com.edutrack.repository;

import com.edutrack.entity.Marks;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MarksRepository extends JpaRepository<Marks, Long> {

    List<Marks> findByStudentId(Long studentId);

    Page<Marks> findByStudentId(Long studentId, Pageable pageable);

    List<Marks> findByStudentIdAndSemester(Long studentId, Integer semester);

    Page<Marks> findByStudentIdAndSemester(Long studentId, Integer semester, Pageable pageable);

    @Query("SELECT AVG(m.totalMarks) FROM Marks m WHERE m.subject = :subject")
    Double getAverageBySubject(@Param("subject") String subject);

    @Query("SELECT m FROM Marks m WHERE m.student.id = :studentId AND m.semester = :semester AND m.subject = :subject")
    Optional<Marks> findByStudentIdAndSemesterAndSubject(
            @Param("studentId") Long studentId,
            @Param("semester") Integer semester,
            @Param("subject") String subject);

    @Query("SELECT m FROM Marks m ORDER BY m.totalMarks DESC")
    Page<Marks> findTopScorers(Pageable pageable);
}
