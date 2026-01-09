package com.medstore.service;

import com.medstore.constants.ResponseCodes;
import com.medstore.dto.JwtResponse;
import com.medstore.dto.LoginRequest;
import com.medstore.dto.RegisterRequest;
import com.medstore.exception.BusinessException;
import com.medstore.exception.ResourceNotFoundException;
import com.medstore.model.User;
import com.medstore.repository.UserRepository;
import com.medstore.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    public User registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(ResponseCodes.EMAIL_EXISTS);
        }
        
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException(ResponseCodes.USERNAME_EXISTS);
        }
        
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.CUSTOMER);
        
        return userRepository.save(user);
    }
    
    public JwtResponse loginUser(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (Exception e) {
             throw new BusinessException(ResponseCodes.BAD_CREDENTIALS);
        }
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException(ResponseCodes.USER_NOT_FOUND));
        
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        
        return new JwtResponse(token, user.getId(), user.getUsername(), user.getEmail(), user.getRole().name(), user.getCreatedAt().toString());
    }
    
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ResponseCodes.USER_NOT_FOUND));
    }

    public User updateTimezone(String email, String timezone) {
        User user = getUserByEmail(email);
        user.setTimezone(timezone);
        return userRepository.save(user);
    }
}
