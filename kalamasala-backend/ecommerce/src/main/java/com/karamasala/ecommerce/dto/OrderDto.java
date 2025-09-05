package com.karamasala.ecommerce.dto;

import java.time.Instant;
import java.util.List;

public record OrderDto(
        Long id,
        Instant createdAt,
        Double total,
        String status,
        List<OrderItemDto> items
) {}
