package com.medstore.exception;

import com.medstore.constants.ResponseCodes;

public class ResourceNotFoundException extends RuntimeException {
    
    private final String error;
    private final Object[] args;

    public ResourceNotFoundException(String error, Object... args) {
        super(error);
        this.error = error;
        this.args = args;
    }
    
    public ResourceNotFoundException(String message) {
        super(message);
        this.error = ResponseCodes.RESOURCE_NOT_FOUND;
        this.args = null;
    }

    public String getError() {
        return error;
    }
    
    public Object[] getArgs() {
        return args;
    }
}
