package com.ecommerce.ecommerce_backend.controller;

import com.ecommerce.ecommerce_backend.model.*;
import com.ecommerce.ecommerce_backend.repository.*;
import com.ecommerce.ecommerce_backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // Ürüne yorum yap
    @PostMapping("/{productId}")
    public ResponseEntity<String> addReview(@PathVariable Long productId,
                                            @RequestBody Review reviewRequest,
                                            @RequestHeader("Authorization") String authHeader) {

        String email = extractEmail(authHeader);

        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Ürün bulunamadı.");
        }
        Product product = productOpt.get();

        // Kullanıcının bu ürünü sipariş edip etmediğini kontrol et
        List<Order> orders = orderRepository.findByUserEmail(email);
        boolean purchased = orders.stream()
                .flatMap(order -> order.getItems().stream())
                .anyMatch(item -> item.getProduct().getId().equals(productId));

        if (!purchased) {
            return ResponseEntity.status(403).body("Bu ürünü sipariş etmeden yorum yapamazsınız.");
        }

        // Yorum oluştur
        Review review = new Review();
        review.setUserEmail(email);
        review.setProduct(product);
        review.setRating(reviewRequest.getRating());
        review.setComment(reviewRequest.getComment());
        review.setCreatedAt(LocalDateTime.now());
        reviewRepository.save(review);

        return ResponseEntity.ok("Yorum başarıyla kaydedildi.");
    }

    // Ürünün yorumlarını getir
    @GetMapping("/{productId}")
    public ResponseEntity<List<Review>> getReviews(@PathVariable Long productId) {
        Optional<Product> productOpt = productRepository.findById(productId);
        return productOpt
                .map(product -> ResponseEntity.ok(reviewRepository.findByProduct(product)))
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    private String extractEmail(String authHeader) {
        String token = authHeader.substring(7);
        return jwtUtil.extractEmail(token);
    }
}
