package com.karamasala.ecommerce.exception;

/**
 * Thrown when a resource (e.g. Product, User, Cart) cannot be found.
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
