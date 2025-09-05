package com.karamasala.ecommerce.repository;

import com.karamasala.ecommerce.model.Cart;
import com.karamasala.ecommerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
}
