package com.ecommerce.ecommerce_backend.controller;

import com.ecommerce.ecommerce_backend.model.CartItem;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.checkout.Session;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class StripeController {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;



    @PostMapping("/create-intent")
    public ResponseEntity<String> createPaymentIntent(@RequestBody PaymentRequest paymentRequest) {
        try {
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(paymentRequest.getAmount()) // kuruş cinsinden (100 TL = 10000)
                    .setCurrency("try")
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);
            return ResponseEntity.ok(intent.getClientSecret());
        } catch (StripeException e) {
            return ResponseEntity.status(500).body("Stripe hatası: " + e.getMessage());
        }
    }



    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestBody List<CartItem> items) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        // Ürünleri Stripe için dönüştür (varsayılan örnek)
        List<SessionCreateParams.LineItem> stripeItems = items.stream()
                .map(item -> SessionCreateParams.LineItem.builder()
                        .setQuantity((long) item.getQuantity())
                        .setPriceData(
                                SessionCreateParams.LineItem.PriceData.builder()
                                        .setCurrency("try")
                                        .setUnitAmount((long) (item.getProduct().getPrice() * 100)) // kuruş cinsinden
                                        .setProductData(
                                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                        .setName(item.getProduct().getName())
                                                        .build()
                                        )
                                        .build()
                        )
                        .build()
                ).toList();

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:4200/success") // ödemeden sonra
                .setCancelUrl("http://localhost:4200/failure")   // iptal ederse
                .addAllLineItem(stripeItems)
                .build();

        Session session = Session.create(params);

        // ✅ BURASI ÖNEMLİ!
        Map<String, String> response = new HashMap<>();
        response.put("sessionId", session.getId()); // 🔥 stripe.redirectToCheckout için bu lazım!
        return ResponseEntity.ok(response);
    }


    // Test amaçlı sınıf
    public static class PaymentRequest {
        private Long amount;

        public Long getAmount() { return amount; }
        public void setAmount(Long amount) { this.amount = amount; }
    }




}
