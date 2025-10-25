package com.karamasala.ecommerce.controller;

import com.karamasala.ecommerce.dto.AddCartItemRequest;
import com.karamasala.ecommerce.dto.CartDto;
import com.karamasala.ecommerce.dto.UpdateCartItemRequest;
import com.karamasala.ecommerce.exception.ResourceNotFoundException;
import com.karamasala.ecommerce.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService carts;

    public CartController(CartService carts) {
        this.carts = carts;
    }

    @GetMapping
    public ResponseEntity<CartDto> get(@AuthenticationPrincipal UserDetails principal) {
        if (principal == null) {
            throw new ResourceNotFoundException("User not authenticated");
        }
        String email = principal.getUsername();
        return ResponseEntity.ok(carts.getMyCart(email));
    }

    @PostMapping("/items")
    public ResponseEntity<CartDto> add(@AuthenticationPrincipal UserDetails principal,
                                       @RequestBody AddCartItemRequest req) {
        if (principal == null) {
            throw new ResourceNotFoundException("User not authenticated");
        }
        String email = principal.getUsername();
        return ResponseEntity.ok(carts.addItem(email, req.productId(), req.quantity()));
    }

    @PatchMapping("/items/{productId}")
    public ResponseEntity<CartDto> update(@AuthenticationPrincipal UserDetails principal,
                                          @PathVariable Long productId,
                                          @RequestBody UpdateCartItemRequest req) {
        if (principal == null ) {
            throw new ResourceNotFoundException("User not authenticated");
        }

        String email = principal.getUsername();
        return ResponseEntity.ok(carts.updateItem(email, productId, req.quantity()));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<CartDto> remove(@AuthenticationPrincipal UserDetails principal,
                                          @PathVariable Long productId) {
        if (principal == null) {
            throw new ResourceNotFoundException("User not authenticated");
        }
        String email = principal.getUsername();
        return ResponseEntity.ok(carts.removeItem(email, productId));
    }

    @DeleteMapping("/items")
    public ResponseEntity<CartDto> clear(@AuthenticationPrincipal UserDetails principal) {
        if (principal == null) {
            throw new ResourceNotFoundException("User not authenticated");
        }
        String email = principal.getUsername();
        return ResponseEntity.ok(carts.clear(email));
    }
}
