package com.medstore.controller;

import com.medstore.constants.ResponseCodes;
import com.medstore.dto.ApiResponse;
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
