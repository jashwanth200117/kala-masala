package com.karamasala.ecommerce.dto;

import java.time.Instant;
import java.util.List;

public record OrderItemDto(
        Long productId,
        String productName,
        String imageUrl,
        Double unitPrice,
        Integer quantity,
        Double lineTotal
) {}
