package com.karamasala.ecommerce.service.impl;

import com.karamasala.ecommerce.dto.OrderDto;
import com.karamasala.ecommerce.dto.OrderItemDto;
import com.karamasala.ecommerce.model.*;
import com.karamasala.ecommerce.repository.CartRepository;
import com.karamasala.ecommerce.repository.OrderRepository;
import com.karamasala.ecommerce.repository.ProductRepository;
import com.karamasala.ecommerce.repository.UserRepository;
import com.karamasala.ecommerce.service.OrderService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private final UserRepository users;
    private final CartRepository carts;
    private final ProductRepository products;
    private final OrderRepository orders;

    public OrderServiceImpl(UserRepository users, CartRepository carts,
                            ProductRepository products, OrderRepository orders) {
        this.users = users;
        this.carts = carts;
        this.products = products;
        this.orders = orders;
    }

    @Override
    public OrderDto checkout(String email) {
        User u = users.findByEmail(email).orElseThrow();
        Cart cart = carts.findByUser(u).orElseThrow(() -> new IllegalStateException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }

        Order order = Order.builder()
                .user(u)
                .status(OrderStatus.CREATED)
                .total(0.0)
                .build();

        double total = 0.0;
        List<OrderItem> oiList = new ArrayList<>();

        for (CartItem ci : cart.getItems()) {
            // re-read product for current price
            Product p = products.findById(ci.getProductId()).orElseThrow();
            double unit = p.getPrice();
            int qty = ci.getQuantity();
            double line = unit * qty;

            OrderItem oi = OrderItem.builder()
                    .order(order)
                    .productId(p.getId())
                    .productName(p.getName())
                    .unitPrice(unit)
                    .quantity(qty)
                    .imageUrl(p.getImageUrl())
                    .lineTotal(line)
                    .build();
            oiList.add(oi);
            total += line;
        }

        order.setItems(oiList);
        order.setTotal(total);

        orders.save(order);

        // clear cart after successful order creation
        cart.getItems().clear();
        carts.save(cart);

        return map(order);
    }

    @Override
    public List<OrderDto> myOrders(String email) {
        User u = users.findByEmail(email).orElseThrow();
        return orders.findByUserOrderByCreatedAtDesc(u).stream().map(this::map).toList();
    }

    @Override
    public OrderDto getOrder(String email, Long orderId) {
        User u = users.findByEmail(email).orElseThrow();
        Order o = orders.findById(orderId).orElseThrow();
        if (!o.getUser().getId().equals(u.getId())) {
            throw new SecurityException("Not your order");
        }
        return map(o);
    }

    private OrderDto map(Order o) {
        List<OrderItemDto> items = o.getItems().stream().map(i ->
                new OrderItemDto(
                        i.getProductId(),
                        i.getProductName(),
                        i.getImageUrl(),
                        i.getUnitPrice(),
                        i.getQuantity(),
                        i.getLineTotal()
                )
        ).toList();
        return new OrderDto(o.getId(), o.getCreatedAt(), o.getTotal(), o.getStatus().name(), items);
    }
}
