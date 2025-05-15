package com.ecommerce.ecommerce_backend.controller;

import com.ecommerce.ecommerce_backend.model.Product;
import com.ecommerce.ecommerce_backend.repository.ProductRepository;
import com.ecommerce.ecommerce_backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ProductRepository productRepository;

    // Tüm ürünleri getir
    @GetMapping
    public List<Product> getAllProducts(@RequestParam(required = false) String category) {
        if (category != null) {
            return productRepository.findByCategoryIgnoreCase(category);
        }
        return productRepository.findAll();
    }

    // Arama kutusu için (ismi içeren ürünleri getir)
    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }


    @GetMapping("/{id}")
    public Product getProduct(@PathVariable long id) {
        return productRepository.findById(id).get();
    }

    @PostMapping("/add")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<Product> addProduct(@RequestBody Product product,
                                              @RequestHeader("Authorization") String authHeader) {
        String email = extractEmail(authHeader);
        product.setSellerEmail(email);
        Product savedProduct = productRepository.save(product);
        return ResponseEntity.ok(savedProduct);
    }


    @GetMapping("/my-products")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<List<Product>> getSellerProducts(@RequestHeader("Authorization") String authHeader) {
        String email = extractEmail(authHeader);
        return ResponseEntity.ok(productRepository.findBySellerEmail(email));
    }


    private String extractEmail(String authHeader) {
        String token = authHeader.substring(7);
        return jwtUtil.extractEmail(token);
    }



}
