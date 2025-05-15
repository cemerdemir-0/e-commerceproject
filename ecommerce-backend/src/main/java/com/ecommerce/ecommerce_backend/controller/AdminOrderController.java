package com.ecommerce.ecommerce_backend.controller;

import com.ecommerce.ecommerce_backend.model.Order;
import com.ecommerce.ecommerce_backend.model.OrderStatus;
import com.ecommerce.ecommerce_backend.repository.OrderRepository;
import com.ecommerce.ecommerce_backend.service.AdminOrderService;
import com.ecommerce.ecommerce_backend.service.OrderService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private AdminOrderService adminOrderService;


    @Autowired
    private OrderService orderService;


    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            OrderStatus newStatus = OrderStatus.valueOf(body.get("status").toUpperCase());
            adminOrderService.updateOrderStatus(id, newStatus);
            return ResponseEntity.ok("Sipariş durumu güncellendi");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Geçersiz durum: " + body.get("status"));
        }
    }

    @PutMapping("/admin/orders/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<String> cancelOrderByAdmin(@PathVariable Long id) {
        return orderService.cancelOrderByAdmin(id);
    }


}
