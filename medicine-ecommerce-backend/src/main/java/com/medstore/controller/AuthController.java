package com.medstore.controller;

import com.medstore.constants.ResponseCodes;
import com.medstore.dto.ApiResponse;
import com.medstore.dto.JwtResponse;
import com.medstore.dto.LoginRequest;
import com.medstore.dto.RegisterRequest;
import com.medstore.model.User;
import com.medstore.service.MessageResolver;
import com.medstore.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UserService userService;

    @Autowired
    private MessageResolver messageResolver;

    private String getMessage(String code) {
        return messageResolver.getMessage(code);
    }
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> register(@Valid @RequestBody RegisterRequest request) {
        User user = userService.registerUser(request);
        return ResponseEntity.ok(ApiResponse.success(user, getMessage(ResponseCodes.REGISTER_SUCCESS)));
    }
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtResponse>> login(@Valid @RequestBody LoginRequest request) {
        JwtResponse response = userService.loginUser(request);
        return ResponseEntity.ok(ApiResponse.success(response, getMessage(ResponseCodes.LOGIN_SUCCESS)));
    }
    
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<User>> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(ApiResponse.success(user, getMessage(ResponseCodes.USER_PROFILE_RETRIEVED)));
    }
}
