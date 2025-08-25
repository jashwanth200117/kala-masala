package com.karamasala.ecommerce.service.impl;

import com.karamasala.ecommerce.model.CartItem;
import com.karamasala.ecommerce.repository.CartItemRepository;
import com.karamasala.ecommerce.service.CartService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    private final CartItemRepository cartItemRepository;

    public CartServiceImpl(CartItemRepository cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
    }

    @Override
    public List<CartItem> getCartItems() {
        return cartItemRepository.findAll();
    }

    @Override
    public CartItem addCartItem(CartItem cartItem) {
        return cartItemRepository.save(cartItem);
    }

    @Override
    public void removeCartItem(Long productId) {
        cartItemRepository.deleteAll(
                cartItemRepository.findAll()
                        .stream()
                        .filter(item -> item.getProduct().getId().equals(productId))
                        .toList()
        );
    }

    @Override
    public void clearCart() {
        cartItemRepository.deleteAll();
    }
}
