package com.ecommerce.ecommerce_backend.config;

import com.ecommerce.ecommerce_backend.security.JwtFilter;
import org.springframework.security.config.Customizer;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()                      // Giriş ve kayıt serbest
                        .requestMatchers("/api/products/**").permitAll()                 // 🟢 Ürün listeleme gibi şeyler herkese açık
                        .requestMatchers("/api/products", "/api/products/search").permitAll()  // (isteğe bağlı ek koruma)
                        .requestMatchers("/api/admin/**").hasAuthority("ADMIN")          // Admin panel sadece admin'e açık
                        .requestMatchers("/api/orders/**").authenticated()
                        .requestMatchers("/api/reviews/**").permitAll() // yorumları tüm kullanıcılar görebilsin
                        .requestMatchers("/api/products/add").hasAuthority("SELLER")
                        .requestMatchers("/api/products/my-products").hasAuthority("SELLER")
                        .requestMatchers("/api/orders/seller-orders").hasAuthority("SELLER")
                        .anyRequest().authenticated()                                    // Diğer her şey token ister
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }



}
