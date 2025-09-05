package com.karamasala.ecommerce.repository;

import com.karamasala.ecommerce.model.Order;
import com.karamasala.ecommerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
}
