package com.edutrack.repository;

import com.edutrack.entity.Attendance;
import com.edutrack.enums.AttendanceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByStudentId(Long studentId);

    Page<Attendance> findByStudentId(Long studentId, Pageable pageable);

    List<Attendance> findByStudentIdAndAttendanceDateBetween(
            Long studentId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId AND a.status = :status")
    Long countByStudentIdAndStatus(@Param("studentId") Long studentId, @Param("status") AttendanceStatus status);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId")
    Long countByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT a FROM Attendance a WHERE a.student.id = :studentId AND a.subject = :subject")
    List<Attendance> findByStudentIdAndSubject(@Param("studentId") Long studentId, @Param("subject") String subject);
}
