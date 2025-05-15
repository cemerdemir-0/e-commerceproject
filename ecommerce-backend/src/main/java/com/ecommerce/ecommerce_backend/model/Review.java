package com.ecommerce.ecommerce_backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;

    @ManyToOne
    private Product product;

    private int rating;

    private String comment;

    private LocalDateTime createdAt = LocalDateTime.now();

    // Getter - Setter
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getUserEmail() { return userEmail; }

    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public Product getProduct() { return product; }

    public void setProduct(Product product) { this.product = product; }

    public int getRating() { return rating; }

    public void setRating(int rating) { this.rating = rating; }

    public String getComment() { return comment; }

    public void setComment(String comment) { this.comment = comment; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
