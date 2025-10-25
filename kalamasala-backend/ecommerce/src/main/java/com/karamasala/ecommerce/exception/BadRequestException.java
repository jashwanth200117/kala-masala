package com.karamasala.ecommerce.exception;

/**
 * Thrown when user provides invalid input or request is malformed.
 */
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
