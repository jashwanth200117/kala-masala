package com.karamasala.ecommerce.service;

import com.karamasala.ecommerce.dto.OrderDto;

import java.util.List;

public interface OrderService {
    OrderDto checkout(String email); // simple checkout
    List<OrderDto> myOrders(String email);
    OrderDto getOrder(String email, Long orderId);
}
