package com.karamasala.ecommerce.service;

import com.karamasala.ecommerce.model.CartItem;
import java.util.List;

public interface CartService {
    List<CartItem> getCartItems();
    CartItem addCartItem(CartItem cartItem);
    void removeCartItem(Long productId);
    void clearCart();
}
