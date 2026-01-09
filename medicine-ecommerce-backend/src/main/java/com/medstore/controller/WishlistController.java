package com.medstore.controller;

import com.medstore.constants.ResponseCodes;
import com.medstore.dto.ApiResponse;
import com.medstore.model.Wishlist;
import com.medstore.service.MessageResolver;
import com.medstore.service.WishlistService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*")
public class WishlistController {
    
    private static final Logger logger = LoggerFactory.getLogger(WishlistController.class);

    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private MessageResolver messageResolver;

    private String getMessage(String code) {
        return messageResolver.getMessage(code);
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Wishlist>>> getUserWishlist(Authentication authentication) {
        String email = authentication.getName();
        logger.info("Fetching wishlist for user: {}", email);
        List<Wishlist> wishlist = wishlistService.getUserWishlist(email);
        logger.info("Fetched {} items in wishlist", wishlist.size());
        return ResponseEntity.ok(ApiResponse.success(wishlist, getMessage(ResponseCodes.WISHLIST_RETRIEVED)));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Wishlist>> addToWishlist(@RequestBody Map<String, Long> body, Authentication authentication) {
        String email = authentication.getName();
        Long medicineId = body.get("medicineId");
        logger.info("Adding medicine ID {} to wishlist for user {}", medicineId, email);
        Wishlist item = wishlistService.addToWishlist(email, medicineId);
        logger.info("Item added to wishlist successfully");
        return ResponseEntity.ok(ApiResponse.success(item, getMessage(ResponseCodes.WISHLIST_ADDED)));
    }
    
    @DeleteMapping("/{medicineId}")
    public ResponseEntity<ApiResponse<Void>> removeFromWishlist(@PathVariable Long medicineId, Authentication authentication) {
        String email = authentication.getName();
        logger.info("Removing medicine ID {} from wishlist for user {}", medicineId, email);
        wishlistService.removeFromWishlist(email, medicineId);
        logger.info("Item removed from wishlist");
        return ResponseEntity.ok(ApiResponse.success(null, getMessage(ResponseCodes.WISHLIST_REMOVED)));
    }
}
