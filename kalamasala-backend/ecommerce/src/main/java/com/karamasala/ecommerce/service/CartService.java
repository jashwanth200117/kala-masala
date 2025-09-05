package com.karamasala.ecommerce.service;

import com.karamasala.ecommerce.dto.CartDto;

public interface CartService {
    CartDto getMyCart(String email);
    CartDto addItem(String email, Long productId, int quantity);
    CartDto updateItem(String email, Long productId, int quantity);
    CartDto removeItem(String email, Long productId);
    CartDto clear(String email);
}
