package com.campus.eventmanagement.repository;

import com.campus.eventmanagement.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByStatusOrderByEventDateAsc(String status);

    List<Event> findByCategoryIgnoreCaseOrderByEventDateAsc(String category);

    @Query("SELECT e FROM Event e WHERE " +
           "(:search IS NULL OR LOWER(e.eventName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(e.description) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(e.organizerName) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:category IS NULL OR :category = '' OR LOWER(e.category) = LOWER(:category)) AND " +
           "(:status IS NULL OR :status = '' OR e.status = :status) AND " +
           "(:startDate IS NULL OR e.eventDate >= :startDate) AND " +
           "(:endDate IS NULL OR e.eventDate <= :endDate) " +
           "ORDER BY e.eventDate ASC")
    List<Event> searchAndFilterEvents(@Param("search") String search,
                                      @Param("category") String category,
                                      @Param("status") String status,
                                      @Param("startDate") LocalDate startDate,
                                      @Param("endDate") LocalDate endDate);

    List<Event> findTop5ByOrderByCreatedDateDesc();

    List<Event> findTop5ByStatusOrderByEventDateAsc(String status);

    long countByStatus(String status);
}
