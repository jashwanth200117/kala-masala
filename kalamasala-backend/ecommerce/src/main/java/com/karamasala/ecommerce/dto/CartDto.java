package com.karamasala.ecommerce.dto;

import java.util.List;

public record CartDto(
        Long id,
        List<CartItemDto> items,
        Double subtotal
) {}
