package com.medstore.repository;

import com.medstore.model.Medicine;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    
    List<Medicine> findByCategoryId(Long categoryId);
    
    @Query("SELECT m FROM Medicine m WHERE LOWER(m.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(m.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Medicine> searchMedicines(@Param("keyword") String keyword, Pageable pageable);
    
    Page<Medicine> findAll(Pageable pageable);
}
