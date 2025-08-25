package com.karamasala.ecommerce.repository;

import com.karamasala.ecommerce.model.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {}
