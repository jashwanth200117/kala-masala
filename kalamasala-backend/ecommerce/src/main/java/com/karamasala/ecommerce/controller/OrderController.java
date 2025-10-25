package com.karamasala.ecommerce.controller;

import com.karamasala.ecommerce.dto.OrderDto;
import com.karamasala.ecommerce.exception.ResourceNotFoundException;
import com.karamasala.ecommerce.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orders;

    public OrderController(OrderService orders) {
        this.orders = orders;
    }

    @PostMapping("/checkout")
    public ResponseEntity<OrderDto> checkout(@AuthenticationPrincipal UserDetails principal) {
        if (principal == null) {
            throw new ResourceNotFoundException("User not authenticated");
        }
        String email = principal.getUsername();
        return ResponseEntity.ok(orders.checkout(email));
    }

    @GetMapping
    public ResponseEntity<List<OrderDto>> myOrders(@AuthenticationPrincipal UserDetails principal) {
        if (principal == null) {
            throw new ResourceNotFoundException("User not authenticated");
        }
        String email = principal.getUsername();
        return ResponseEntity.ok(orders.myOrders(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> get(@AuthenticationPrincipal UserDetails principal,
                                        @PathVariable Long id) {
        if (principal == null) {
            throw new ResourceNotFoundException("User not authenticated");
        }
        String email = principal.getUsername();
        return ResponseEntity.ok(orders.getOrder(email, id));
    }
}
