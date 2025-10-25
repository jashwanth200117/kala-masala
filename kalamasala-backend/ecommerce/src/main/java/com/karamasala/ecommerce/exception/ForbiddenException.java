package com.karamasala.ecommerce.exception;

/**
 * Thrown when logged-in user lacks permission to perform an action.
 */
public class ForbiddenException extends RuntimeException {
    public ForbiddenException(String message) {
        super(message);
    }
}
