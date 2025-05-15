package com.ecommerce.ecommerce_backend.controller;

import com.ecommerce.ecommerce_backend.model.User;
import com.ecommerce.ecommerce_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PutMapping("/disable/{email}")
    public ResponseEntity<String> disableUser(@PathVariable String email) {
        Optional<User> optional = userRepository.findByEmail(email);
        if (optional.isEmpty()) {
            return ResponseEntity.badRequest().body("Kullanıcı bulunamadı.");
        }

        User user = optional.get();
        user.setEnabled(false);
        userRepository.save(user);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/enable/{email}")
    public ResponseEntity<String> enableUser(@PathVariable String email) {
        Optional<User> optional = userRepository.findByEmail(email);
        if (optional.isEmpty()) {
            return ResponseEntity.badRequest().body("Kullanıcı bulunamadı.");
        }

        User user = optional.get();
        user.setEnabled(true);
        userRepository.save(user);

        return ResponseEntity.ok().build();
    }
}
