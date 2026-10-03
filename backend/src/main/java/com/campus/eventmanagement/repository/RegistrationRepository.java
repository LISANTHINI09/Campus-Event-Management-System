package com.campus.eventmanagement.repository;

import com.campus.eventmanagement.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    List<Registration> findByStudentIdOrderByRegistrationDateDesc(Long studentId);

    List<Registration> findByEventIdOrderByRegistrationDateDesc(Long eventId);

    Optional<Registration> findByStudentIdAndEventId(Long studentId, Long eventId);

    boolean existsByStudentIdAndEventIdAndStatus(Long studentId, Long eventId, String status);

    long countByStatus(String status);

    List<Registration> findTop5ByOrderByRegistrationDateDesc();

    List<Registration> findTop5ByStudentIdOrderByRegistrationDateDesc(Long studentId);
}
