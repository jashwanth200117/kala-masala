package com.karamasala.ecommerce.exception;

/**
 * Generic catch-all exception for unexpected errors.
 */
public class ApiException extends RuntimeException {
    public ApiException(String message) {
        super(message);
    }
}
