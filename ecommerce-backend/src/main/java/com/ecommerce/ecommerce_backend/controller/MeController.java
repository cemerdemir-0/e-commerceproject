package com.ecommerce.ecommerce_backend.controller;

import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class MeController {

    // Sadece login olmuşsa çalışır (SecurityConfig zaten other requests -> authenticated)
    @GetMapping("/me")
    public Map<String, Object> me(OidcUser user) {
        return Map.of(
                "sub", user.getSubject(),
                "email", user.getEmail(),
                "name", user.getFullName(),
                "picture", user.getPicture()
        );
    }
}
