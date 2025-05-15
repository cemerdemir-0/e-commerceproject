package com.ecommerce.ecommerce_backend.controller;

import com.ecommerce.ecommerce_backend.model.*;
import com.ecommerce.ecommerce_backend.repository.*;
import com.ecommerce.ecommerce_backend.security.JwtUtil;
import com.ecommerce.ecommerce_backend.service.OrderService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderService orderService;



    // SİPARİŞ VER
    @Transactional
    @PostMapping("/checkout")
    public ResponseEntity<String> placeOrder(@RequestHeader("Authorization") String authHeader,
                                             @RequestBody String address) {

        String email = extractEmail(authHeader);
        if (address == null || address.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Adres boş olamaz.");
        }

        List<CartItem> cartItems = cartItemRepository.findByUserEmail(email);
        if (cartItems.isEmpty()) {
            return ResponseEntity.badRequest().body("Sepetiniz boş.");
        }

        // Siparişi başlat
        Order order = new Order();
        order.setUserEmail(email);
        order.setAddress(address);
        order.setCreatedAt(LocalDateTime.now()); // Sipariş zamanı
        order = orderRepository.save(order); // ID oluşsun

        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();

            // Stok kontrolü
            if (product.getStock() < cartItem.getQuantity()) {
                return ResponseEntity.badRequest().body("Yetersiz stok: " + product.getName());
            }

            // OrderItem oluştur
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(cartItem.getQuantity());
            orderItems.add(item);

            // Stok azalt
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
        }

        // Sipariş ürünlerini kaydet
        orderItemRepository.saveAll(orderItems);

        // Sepeti temizle
        cartItemRepository.deleteAll(cartItems);

        return ResponseEntity.ok("✅ Sipariş başarıyla oluşturuldu.");
    }


    // TÜM SİPARİŞLERİ GETİR (Giriş yapan kullanıcıya ait)
    @GetMapping(path="")
    public List<Order> getUserOrders(@RequestHeader("Authorization") String authHeader) {
        String email = extractEmail(authHeader);
        return orderRepository.findByUserEmail(email);
    }

    // JWT'den e-posta çıkarma
    private String extractEmail(String authHeader) {
        String token = authHeader.substring(7);
        return jwtUtil.extractEmail(token);
    }

    @PostMapping("/confirm")
    public ResponseEntity<String> confirmOrder(@RequestHeader("Authorization") String authHeader,
                                               @RequestBody String address) {
        String email = extractEmail(authHeader);
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) return ResponseEntity.status(404).body("Kullanıcı bulunamadı.");

        List<CartItem> cartItems = cartItemRepository.findByUser(user.get());
        if (cartItems.isEmpty()) return ResponseEntity.badRequest().body("Sepetiniz boş.");

        // Siparişi oluştur
        Order order = new Order();
        order.setUserEmail(email);
        order.setAddress(address);
        order.setCreatedAt(LocalDateTime.now());
        order = orderRepository.save(order);

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(cartItem.getQuantity());
            orderItems.add(item);
        }

        orderItemRepository.saveAll(orderItems);
        cartItemRepository.deleteAll(cartItems);

        return ResponseEntity.ok("Sipariş başarıyla tamamlandı.");
    }

    @PutMapping("/cancel/{id}")
    @PreAuthorize("hasRole('USER')")
    @Transactional
    public ResponseEntity<String> cancelOrder(@PathVariable Long id, Principal principal) {
        return orderService.cancelOrderByUser(id, principal.getName());
    }

    @PutMapping("/cancel-admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<String> cancelOrderByAdmin(@PathVariable Long id, Principal principal) {
        return orderService.cancelOrderByAdmin(id);
    }

    @GetMapping("/seller-orders")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<List<Order>> getOrdersForSeller(@RequestHeader("Authorization") String authHeader) {
        String sellerEmail = extractEmail(authHeader);
        List<Order> allOrders = orderRepository.findAll();

        // Sadece seller'a ait ürünlerin olduğu siparişleri filtrele
        List<Order> sellerOrders = allOrders.stream()
                .filter(order -> order.getItems().stream()
                        .anyMatch(item -> item.getProduct().getSellerEmail().equals(sellerEmail)))
                .collect(Collectors.toList());

        return ResponseEntity.ok(sellerOrders);
    }




}
