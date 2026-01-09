package com.medstore.exception;

import com.medstore.constants.ResponseCodes;
import com.medstore.dto.ApiResponse;
import com.medstore.service.MessageResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @Autowired
    private MessageResolver messageResolver;

    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleResourceNotFoundException(ResourceNotFoundException ex) {
        String messageKey = ex.getError();
        String message = getMessage(messageKey, ex.getArgs());
        if (message.equals(messageKey)) {
             // Fallback if key not found, or if created with legacy string constructor
             message = ex.getMessage();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(message));
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Object>> handleBusinessException(BusinessException ex) {
        String messageKey = ex.getError();
        String message = getMessage(messageKey, ex.getArgs());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(message));
    }
    
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Object>> handleBadCredentialsException(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(getMessage(ResponseCodes.BAD_CREDENTIALS, null)));
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getAllErrors().stream()
                .map(error -> ((FieldError) error).getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(getMessage(ResponseCodes.VALIDATION_FAILED, null) + ": " + errorMessage));
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGlobalException(Exception ex) {
        ex.printStackTrace(); // Simple logging for now, or use Logger
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(getMessage(ResponseCodes.INTERNAL_SERVER_ERROR, null) + " Error: " + ex.getMessage()));
    }

    private String getMessage(String code, Object[] args) {
         return messageResolver.getMessage(code, args);
    }
}
