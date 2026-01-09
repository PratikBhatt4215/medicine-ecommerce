package com.medstore.controller;

import com.medstore.constants.ResponseCodes;
import com.medstore.dto.ApiResponse;
import com.medstore.dto.CartRequest;
import com.medstore.model.Cart;
import com.medstore.service.CartService;
import com.medstore.service.MessageResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {
    
    private static final Logger logger = LoggerFactory.getLogger(CartController.class);

    @Autowired
    private CartService cartService;

    @Autowired
    private MessageResolver messageResolver;

    private String getMessage(String code) {
        return messageResolver.getMessage(code);
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Cart>>> getUserCart(Authentication authentication) {
        String email = authentication.getName();
        logger.info("Fetching cart for user: {}", email);
        List<Cart> cart = cartService.getUserCart(email);
        return ResponseEntity.ok(ApiResponse.success(cart, getMessage(ResponseCodes.CART_RETRIEVED)));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Cart>> addToCart(@RequestBody CartRequest request, Authentication authentication) {
        String email = authentication.getName();
        logger.info("Adding item to cart for user: {}", email);
        Cart cartItem = cartService.addToCart(email, request);
        logger.info("Item added to cart successfully");
        return ResponseEntity.ok(ApiResponse.success(cartItem, getMessage(ResponseCodes.CART_ADDED)));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Cart>> updateCartItem(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        logger.info("Updating cart item ID: {}", id);
        Cart updated = cartService.updateCartItem(id, body.get("quantity"));
        logger.info("Cart item updated successfully");
        return ResponseEntity.ok(ApiResponse.success(updated, getMessage(ResponseCodes.CART_UPDATED)));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> removeFromCart(@PathVariable Long id) {
        logger.info("Removing cart item ID: {}", id);
        cartService.removeFromCart(id);
        logger.info("Item removed from cart");
        return ResponseEntity.ok(ApiResponse.success(null, getMessage(ResponseCodes.CART_REMOVED)));
    }
    
    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Void>> clearCart(Authentication authentication) {
        String email = authentication.getName();
        logger.info("Clearing cart for user: {}", email);
        cartService.clearCart(email);
        logger.info("Cart cleared successfully");
        return ResponseEntity.ok(ApiResponse.success(null, getMessage(ResponseCodes.CART_CLEARED)));
    }
}
