package com.ecommerce.ecommerce_backend.controller;

import com.ecommerce.ecommerce_backend.model.CartItem;
import com.ecommerce.ecommerce_backend.model.Product;
import com.ecommerce.ecommerce_backend.model.User;
import com.ecommerce.ecommerce_backend.repository.CartItemRepository;
import com.ecommerce.ecommerce_backend.repository.ProductRepository;
import com.ecommerce.ecommerce_backend.repository.UserRepository;
import com.ecommerce.ecommerce_backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;


    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(@RequestHeader("Authorization") String authHeader) {
        String email = extractEmail(authHeader);
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isEmpty()) {
            return ResponseEntity.status(404).build();
        }

        List<CartItem> cartItems = cartItemRepository.findByUser(user.get());
        return ResponseEntity.ok(cartItems);
    }

    @PostMapping("/add/{productId}")
    public ResponseEntity<Map<String, String>> addToCart(@PathVariable Long productId,
                                                         @RequestHeader("Authorization") String authHeader) {

        String email = extractEmail(authHeader);
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Kullanıcı bulunamadı.");
            return ResponseEntity.status(404).body(error);
        }

        Optional<Product> optionalProduct = productRepository.findById(productId);
        if (optionalProduct.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Ürün bulunamadı.");
            return ResponseEntity.badRequest().body(error);
        }

        Product product = optionalProduct.get();

        Optional<CartItem> existingItem = cartItemRepository.findByUserAndProduct(user.get(), product);

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + 1);
            cartItemRepository.save(item);
        } else {
            CartItem item = new CartItem();
            item.setUser(user.get());
            item.setProduct(product);
            item.setQuantity(1);
            cartItemRepository.save(item);
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", "Ürün sepete eklendi.");
        return ResponseEntity.ok(response);
    }



    // Sepetten ürün çıkar (Direkt sil)
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Map<String, String>> removeFromCart(@PathVariable Long productId,
                                                              @RequestHeader("Authorization") String authHeader) {

        String email = extractEmail(authHeader);
        Optional<User> user = userRepository.findByEmail(email);
        Map<String, String> response = new HashMap<>();

        if (user.isEmpty()) {
            response.put("message", "Kullanıcı bulunamadı.");
            return ResponseEntity.status(404).body(response);
        }

        Optional<Product> optionalProduct = productRepository.findById(productId);
        if (optionalProduct.isEmpty()) {
            response.put("message", "Ürün bulunamadı.");
            return ResponseEntity.badRequest().body(response);
        }

        Optional<CartItem> item = cartItemRepository.findByUserAndProduct(user.get(), optionalProduct.get());
        if (item.isPresent()) {
            cartItemRepository.delete(item.get());
            response.put("message", "Ürün sepetten çıkarıldı.");
            return ResponseEntity.ok(response);
        }

        response.put("message", "Ürün sepette bulunamadı.");
        return ResponseEntity.badRequest().body(response);
    }



    // Yardımcı method – Token'dan email çıkar
    private String extractEmail(String authHeader) {
        String token = authHeader.substring(7);
        return jwtUtil.extractEmail(token);
    }

    @PutMapping("/decrease/{productId}")
    public ResponseEntity<Map<String, String>> decreaseFromCart(@PathVariable Long productId,
                                                                @RequestHeader("Authorization") String authHeader) {

        String email = extractEmail(authHeader);
        Optional<User> user = userRepository.findByEmail(email);
        Map<String, String> response = new HashMap<>();

        if (user.isEmpty()) {
            response.put("message", "Kullanıcı bulunamadı.");
            return ResponseEntity.status(404).body(response);
        }

        Optional<Product> optionalProduct = productRepository.findById(productId);
        if (optionalProduct.isEmpty()) {
            response.put("message", "Ürün bulunamadı.");
            return ResponseEntity.badRequest().body(response);
        }

        Product product = optionalProduct.get();
        Optional<CartItem> item = cartItemRepository.findByUserAndProduct(user.get(), product);

        if (item.isPresent()) {
            CartItem cartItem = item.get();
            if (cartItem.getQuantity() > 1) {
                cartItem.setQuantity(cartItem.getQuantity() - 1);
                cartItemRepository.save(cartItem);
                response.put("message", "Ürün miktarı azaltıldı.");
            } else {
                cartItemRepository.delete(cartItem);
                response.put("message", "Ürün sepetten çıkarıldı.");
            }
            return ResponseEntity.ok(response);
        }

        response.put("message", "Ürün sepette bulunamadı.");
        return ResponseEntity.badRequest().body(response);
    }

    @PutMapping("/increase/{productId}")
    public ResponseEntity<Map<String, String>> increaseFromCart(@PathVariable Long productId,
                                                                @RequestHeader("Authorization") String authHeader) {

        String email = extractEmail(authHeader);
        Optional<User> user = userRepository.findByEmail(email);
        Map<String, String> response = new HashMap<>();

        if (user.isEmpty()) {
            response.put("message", "Kullanıcı bulunamadı.");
            return ResponseEntity.status(404).body(response);
        }

        Optional<Product> optionalProduct = productRepository.findById(productId);
        if (optionalProduct.isEmpty()) {
            response.put("message", "Ürün bulunamadı.");
            return ResponseEntity.badRequest().body(response);
        }

        Product product = optionalProduct.get();
        Optional<CartItem> item = cartItemRepository.findByUserAndProduct(user.get(), product);

        if (item.isPresent()) {
            CartItem cartItem = item.get();
            cartItem.setQuantity(cartItem.getQuantity() + 1);
            cartItemRepository.save(cartItem);
            response.put("message", "Ürün miktarı artırıldı.");
            return ResponseEntity.ok(response);
        }

        response.put("message", "Ürün sepette bulunamadı.");
        return ResponseEntity.badRequest().body(response);
    }


}
