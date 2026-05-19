package com.edutrack.repository;

import com.edutrack.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByRegisterNumber(String registerNumber);

    boolean existsByRegisterNumber(String registerNumber);

    Page<Student> findByDepartment(String department, Pageable pageable);

    Page<Student> findByYear(Integer year, Pageable pageable);

    Page<Student> findByDepartmentAndYear(String department, Integer year, Pageable pageable);

    @Query("SELECT s FROM Student s WHERE " +
           "LOWER(s.registerNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.user.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.department) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Student> searchStudents(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT s FROM Student s WHERE s.user.id = :userId")
    Optional<Student> findByUserId(@Param("userId") Long userId);
}
