package com.karamasala.ecommerce.dto;

import java.util.List;

public record CartItemDto(
        Long id,
        Long productId,
        String productName,
        String imageUrl,
        Double unitPrice,
        Integer quantity,
        Double lineTotal
) {}

