package com.ecommerce.ecommerce_backend.service;

import com.ecommerce.ecommerce_backend.model.Product;
import com.ecommerce.ecommerce_backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminProductService {

    @Autowired
    private ProductRepository productRepository;

    // Ürün ekle
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    // Ürün güncelle
    public String updateProduct(Long id, Product updatedProduct) {
        Optional<Product> existingOpt = productRepository.findById(id);
        if (existingOpt.isEmpty()) return "Ürün bulunamadı";

        Product existing = existingOpt.get();
        existing.setName(updatedProduct.getName());
        existing.setCategory(updatedProduct.getCategory());
        existing.setDescription(updatedProduct.getDescription());
        existing.setPrice(updatedProduct.getPrice());
        existing.setImageUrl(updatedProduct.getImageUrl());
        existing.setStock(updatedProduct.getStock());
        productRepository.save(existing);

        return "Ürün güncellendi";
    }

    // Ürün sil
    public String deleteProduct(Long id) {
        if (!productRepository.existsById(id)) return "Ürün bulunamadı";
        productRepository.deleteById(id);
        return "Ürün silindi";
    }
}
