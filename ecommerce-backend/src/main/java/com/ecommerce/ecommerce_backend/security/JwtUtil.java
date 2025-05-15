package com.ecommerce.ecommerce_backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // Sabit secret key
    private final Key secretKey = Keys.hmacShaKeyFor("secret123secret123secret123secret123".getBytes());

    // Token oluşturma (generateToken)
    public String generateToken(String email, String role) {
        long nowMillis = System.currentTimeMillis();
        long expMillis = nowMillis + (24 * 60 * 60 * 1000); // 24 saat geçerli olacak

        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date(nowMillis))
                .setExpiration(new Date(expMillis))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    // Token içinden Email (Subject) alma
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    // Token içinden Role alma
    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    // Token geçerli mi?
    public boolean isTokenValid(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            System.out.println("Token geçersiz: " + e.getMessage());
            return false;
        }
    }

    // Claims çıkaran method (token'ı parse eden yer)
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // (İstersen test için) Token'ı detaylı yazdıran method
    public void testDecode(String token) {
        try {
            Claims claims = extractAllClaims(token);
            System.out.println("Subject: " + claims.getSubject());
            System.out.println("Role: " + claims.get("role"));
            System.out.println("Expiration: " + claims.getExpiration());
        } catch (Exception e) {
            System.out.println("Decode Error: " + e.getMessage());
        }
    }
}
