package com.ecommerce.ecommerce_backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/hello")
    public String hello() {
        return "✅ JWT ile korunan sayfaya başarıyla eriştin!";
    }
}
