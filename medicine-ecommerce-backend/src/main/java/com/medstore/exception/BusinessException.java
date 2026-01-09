package com.medstore.exception;

public class BusinessException extends RuntimeException {
    
    private final String error;
    private final Object[] args;

    public BusinessException(String error, Object... args) {
        super(error);
        this.error = error;
        this.args = args;
    }

    public String getError() {
        return error;
    }
    
    public Object[] getArgs() {
        return args;
    }
}
