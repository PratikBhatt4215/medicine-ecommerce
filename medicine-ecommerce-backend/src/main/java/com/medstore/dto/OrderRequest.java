package com.medstore.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;
import java.util.Objects;

public class OrderRequest {
    
    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;
    
    private List<Long> cartItemIds;

    private String paymentId;

    public OrderRequest() {
    }

    public OrderRequest(String shippingAddress, List<Long> cartItemIds) {
        this.shippingAddress = shippingAddress;
        this.cartItemIds = cartItemIds;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public List<Long> getCartItemIds() {
        return cartItemIds;
    }

    public void setCartItemIds(List<Long> cartItemIds) {
        this.cartItemIds = cartItemIds;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OrderRequest that = (OrderRequest) o;
        return Objects.equals(shippingAddress, that.shippingAddress) && Objects.equals(cartItemIds, that.cartItemIds);
    }

    @Override
    public int hashCode() {
        return Objects.hash(shippingAddress, cartItemIds);
    }

    @Override
    public String toString() {
        return "OrderRequest{" +
                "shippingAddress='" + shippingAddress + '\'' +
                ", cartItemIds=" + cartItemIds +
                '}';
    }
}
