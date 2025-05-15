package com.ecommerce.ecommerce_backend.service;

import com.ecommerce.ecommerce_backend.dto.OrderDto;
import com.ecommerce.ecommerce_backend.dto.OrderItemDto;
import com.ecommerce.ecommerce_backend.model.*;
import com.ecommerce.ecommerce_backend.repository.OrderRepository;
import com.ecommerce.ecommerce_backend.repository.ProductRepository;
import com.ecommerce.ecommerce_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;


    /* public void cancelOrder(Long orderId, String currentEmail) throws AccessDeniedException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Sipariş bulunamadı."));

        // Kullanıcı kendi siparişi değilse ve admin değilse: hata!
        if (!order.getUserEmail().equals(currentEmail) &&
                !isAdmin(currentEmail)) {
            throw new AccessDeniedException("Bu siparişi iptal etme yetkiniz yok.");
        }

        if (order.getStatus() == OrderStatus.IPTAL_EDILDI) {
            throw new RuntimeException("Sipariş zaten iptal edilmiş.");
        }

        // Stokları geri yükle
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }

        // Siparişi iptal et
        order.setStatus(OrderStatus.IPTAL_EDILDI);
        orderRepository.save(order);
    } */

    private boolean isAdmin(String email) {
        return userRepository.findByEmail(email)
                .map(user -> user.getRole().equals("ADMIN"))
                .orElse(false);
    }

    public ResponseEntity<String> cancelOrderByUser(Long orderId, String email) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Sipariş bulunamadı"));

        if (!order.getUserEmail().equals(email)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bu siparişi iptal edemezsiniz.");
        }

        if (order.getStatus() == OrderStatus.IPTAL_EDILDI) {
            return ResponseEntity.badRequest().body("Sipariş zaten iptal edilmiş.");
        }

        order.setStatus(OrderStatus.IPTAL_EDILDI);

        // ✅ Stok geri yükleme
        for (OrderItem item : order.getItems()) {
            Product p = item.getProduct();
            p.setStock(p.getStock() + item.getQuantity());
            productRepository.save(p);
        }

        orderRepository.save(order);
        return ResponseEntity.ok("Sipariş iptal edildi.");
    }

    public ResponseEntity<String> cancelOrderByAdmin(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Sipariş bulunamadı"));

        if (order.getStatus() == OrderStatus.IPTAL_EDILDI) {
            return ResponseEntity.badRequest().body("Sipariş zaten iptal edilmiş.");
        }

        order.setStatus(OrderStatus.IPTAL_EDILDI);

        for (OrderItem item : order.getItems()) {
            Product p = item.getProduct();
            p.setStock(p.getStock() + item.getQuantity());
            productRepository.save(p);
        }

        orderRepository.save(order);
        return ResponseEntity.ok("Sipariş iptal edildi.");
    }




}
