package com.karamasala.ecommerce.exception;

/**
 * Thrown when user is not logged in but tries to access a protected resource.
 */
public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}
