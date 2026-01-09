package com.medstore.service;

import com.medstore.constants.ResponseCodes;
import com.medstore.dto.CartRequest;
import com.medstore.exception.ResourceNotFoundException;
import com.medstore.model.Cart;
import com.medstore.model.Medicine;
import com.medstore.model.User;
import com.medstore.repository.CartRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private MedicineService medicineService;
    
    public List<Cart> getUserCart(String email) {
        User user = userService.getUserByEmail(email);
        return cartRepository.findByUserId(user.getId());
    }
    
    public Cart addToCart(String email, CartRequest request) {
        User user = userService.getUserByEmail(email);
        Medicine medicine = medicineService.getMedicineById(request.getMedicineId());
        
        // Check if item already exists in cart
        return cartRepository.findByUserIdAndMedicineId(user.getId(), medicine.getId())
                .map(cart -> {
                    cart.setQuantity(cart.getQuantity() + request.getQuantity());
                    return cartRepository.save(cart);
                })
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUser(user);
                    cart.setMedicine(medicine);
                    cart.setQuantity(request.getQuantity());
                    return cartRepository.save(cart);
                });
    }
    
    public Cart updateCartItem(Long id, Integer quantity) {
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ResponseCodes.CART_ITEM_NOT_FOUND));
        cart.setQuantity(quantity);
        return cartRepository.save(cart);
    }
    
    public void removeFromCart(Long id) {
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ResponseCodes.CART_ITEM_NOT_FOUND));
        cartRepository.delete(cart);
    }
    
    @Transactional
    public void clearCart(String email) {
        User user = userService.getUserByEmail(email);
        cartRepository.deleteByUserId(user.getId());
    }
}
