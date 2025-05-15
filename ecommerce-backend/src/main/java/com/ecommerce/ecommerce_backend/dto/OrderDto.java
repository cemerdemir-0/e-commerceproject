package com.ecommerce.ecommerce_backend.dto;

import com.ecommerce.ecommerce_backend.model.OrderStatus;

import java.util.List;

public class OrderDto {
    private Long orderId;
    private String address;
    private double totalPrice;
    private OrderStatus status;
    private List<OrderItemDto> items;

    public OrderDto() {
    }

    public OrderDto(Long orderId, String address, double totalPrice, OrderStatus status, List<OrderItemDto> items) {
        this.orderId = orderId;
        this.address = address;
        this.totalPrice = totalPrice;
        this.status = status;
        this.items = items;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public List<OrderItemDto> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDto> items) {
        this.items = items;
    }
}
