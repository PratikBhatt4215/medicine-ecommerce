package com.medstore.repository;

import com.medstore.model.Cart;
import com.medstore.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    
    List<Cart> findByUserId(Long userId);
    
    Optional<Cart> findByUserIdAndMedicineId(Long userId, Long medicineId);
    
    void deleteByUserId(Long userId);
    
    void deleteByUserIdAndMedicineId(Long userId, Long medicineId);
}
