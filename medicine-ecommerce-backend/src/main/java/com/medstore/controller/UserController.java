package com.medstore.controller;

import com.medstore.constants.ResponseCodes;
import com.medstore.dto.ApiResponse;
import com.medstore.dto.JwtResponse;
import com.medstore.dto.LoginRequest;
import com.medstore.dto.RegisterRequest;
import com.medstore.model.User;
import com.medstore.service.MessageResolver;
import com.medstore.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private MessageResolver messageResolver;

    private String getMessage(String code) {
        return messageResolver.getMessage(code);
    }
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> registerUser(@RequestBody RegisterRequest request) {
        logger.info("Registering user: {}", request.getEmail());
        User user = userService.registerUser(request);
        logger.info("User registered successfully");
        return ResponseEntity.ok(ApiResponse.success(user, getMessage(ResponseCodes.REGISTER_SUCCESS)));
    }
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtResponse>> loginUser(@RequestBody LoginRequest request) {
        logger.info("Login attempt for user: {}", request.getEmail());
        JwtResponse response = userService.loginUser(request);
        logger.info("User logged in successfully");
        return ResponseEntity.ok(ApiResponse.success(response, getMessage(ResponseCodes.LOGIN_SUCCESS)));
    }
    
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<User>> getUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        logger.info("Fetching profile for user: {}", email);
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(ApiResponse.success(user, getMessage(ResponseCodes.USER_PROFILE_RETRIEVED)));
    }

    @PostMapping("/timezone")
    public ResponseEntity<ApiResponse<User>> updateTimezone(@RequestBody Map<String, String> request) {
        String timezone = request.get("timezone");
        if (timezone == null || timezone.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error(getMessage(ResponseCodes.VALIDATION_FAILED)));
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        logger.info("Updating timezone for user: {} to {}", email, timezone);
        User user = userService.updateTimezone(email, timezone);
        logger.info("Timezone updated successfully");
        return ResponseEntity.ok(ApiResponse.success(user, getMessage(ResponseCodes.TIMEZONE_UPDATED)));
    }
}
