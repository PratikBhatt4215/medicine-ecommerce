package com.medstore.service;

import com.medstore.constants.ResponseCodes;
import com.medstore.exception.BusinessException;
import com.medstore.exception.ResourceNotFoundException;
import com.medstore.model.Medicine;
import com.medstore.model.User;
import com.medstore.model.Wishlist;
import com.medstore.repository.WishlistRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WishlistService {
    
    @Autowired
    private WishlistRepository wishlistRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private MedicineService medicineService;
    
    public List<Wishlist> getUserWishlist(String email) {
        User user = userService.getUserByEmail(email);
        return wishlistRepository.findByUserId(user.getId());
    }
    
    public Wishlist addToWishlist(String email, Long medicineId) {
        User user = userService.getUserByEmail(email);
        Medicine medicine = medicineService.getMedicineById(medicineId);
        
        // Check if already in wishlist
        if (wishlistRepository.findByUserIdAndMedicineId(user.getId(), medicineId).isPresent()) {
            throw new BusinessException(ResponseCodes.WISHLIST_EXISTS);
        }
        
        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setMedicine(medicine);
        return wishlistRepository.save(wishlist);
    }
    
    @Transactional
    public void removeFromWishlist(String email, Long medicineId) {
        User user = userService.getUserByEmail(email);
        wishlistRepository.deleteByUserIdAndMedicineId(user.getId(), medicineId);
    }
}
