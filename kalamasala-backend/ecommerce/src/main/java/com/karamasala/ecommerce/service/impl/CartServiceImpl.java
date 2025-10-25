package com.karamasala.ecommerce.service.impl;

import com.karamasala.ecommerce.dto.CartDto;
import com.karamasala.ecommerce.dto.CartItemDto;
import com.karamasala.ecommerce.exception.BadRequestException;
import com.karamasala.ecommerce.exception.ResourceNotFoundException;
import com.karamasala.ecommerce.model.Cart;
import com.karamasala.ecommerce.model.CartItem;
import com.karamasala.ecommerce.model.Product;
import com.karamasala.ecommerce.model.User;
import com.karamasala.ecommerce.repository.CartRepository;
import com.karamasala.ecommerce.repository.ProductRepository;
import com.karamasala.ecommerce.repository.UserRepository;
import com.karamasala.ecommerce.service.CartService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository carts;
    private final UserRepository users;
    private final ProductRepository products;

    public CartServiceImpl(CartRepository carts, UserRepository users, ProductRepository products) {
        this.carts = carts;
        this.users = users;
        this.products = products;
    }

    @Override
    public CartDto getMyCart(String email) {
        Cart cart = getOrCreateCart(email);
        return map(cart);
    }

    @Override
    public CartDto addItem(String email, Long productId, int quantity) {
        if (quantity <= 0) {
            throw new BadRequestException("Quantity must be at least 1");
        }

        Cart cart = getOrCreateCart(email);
        CartItem existing = cart.getItems().stream()
                .filter(ci -> ci.getProductId().equals(productId))
                .findFirst().orElse(null);

        Product p = products.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + productId));

        if (existing == null) {
            CartItem ci = CartItem.builder()
                    .productId(productId)
                    .quantity(quantity)
                    .unitPrice(p.getPrice())
                    .productName(p.getName())
                    .imageUrl(p.getImageUrl())
                    .build();
            cart.addItem(ci);
        } else {
            existing.setQuantity(existing.getQuantity() + quantity);
            existing.setUnitPrice(p.getPrice());
            existing.setProductName(p.getName());
            existing.setImageUrl(p.getImageUrl());
        }

        carts.save(cart);
        return map(cart);
    }

    @Override
    public CartDto updateItem(String email, Long productId, int quantity) {
        Cart cart = getOrCreateCart(email);
        CartItem ci = cart.getItems().stream()
                .filter(x -> x.getProductId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Item not in cart"));

        if (quantity <= 0) {
            cart.removeItem(ci);
        } else {
            ci.setQuantity(quantity);
        }
        carts.save(cart);
        return map(cart);
    }

    @Override
    public CartDto removeItem(String email, Long productId) {
        Cart cart = getOrCreateCart(email);
        boolean removed = cart.getItems().removeIf(ci -> ci.getProductId().equals(productId));

        if (!removed) {
            throw new ResourceNotFoundException("Item not found in cart");
        }

        carts.save(cart);
        return map(cart);
    }

    @Override
    public CartDto clear(String email) {
        Cart cart = getOrCreateCart(email);
        cart.getItems().clear();
        carts.save(cart);
        return map(cart);
    }

    private Cart getOrCreateCart(String email) {
        User u = users.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return carts.findByUser(u).orElseGet(() -> carts.save(Cart.builder().user(u).build()));
    }

    private CartDto map(Cart cart) {
        List<CartItemDto> items = cart.getItems().stream().map(ci ->
                new CartItemDto(
                        ci.getId(),
                        ci.getProductId(),
                        ci.getProductName(),
                        ci.getImageUrl(),
                        ci.getUnitPrice(),
                        ci.getQuantity(),
                        ci.getUnitPrice() * ci.getQuantity()
                )
        ).toList();

        double subtotal = items.stream().mapToDouble(CartItemDto::lineTotal).sum();
        return new CartDto(cart.getId(), items, subtotal);
    }
}
