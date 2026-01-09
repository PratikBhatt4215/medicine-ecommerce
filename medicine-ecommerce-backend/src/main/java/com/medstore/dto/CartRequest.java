package com.medstore.dto;

import jakarta.validation.constraints.NotNull;

import java.util.Objects;

public class CartRequest {
    
    @NotNull(message = "Medicine ID is required")
    private Long medicineId;
    
    @NotNull(message = "Quantity is required")
    private Integer quantity;

    public CartRequest() {
    }

    public CartRequest(Long medicineId, Integer quantity) {
        this.medicineId = medicineId;
        this.quantity = quantity;
    }

    public Long getMedicineId() {
        return medicineId;
    }

    public void setMedicineId(Long medicineId) {
        this.medicineId = medicineId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CartRequest that = (CartRequest) o;
        return Objects.equals(medicineId, that.medicineId) && Objects.equals(quantity, that.quantity);
    }

    @Override
    public int hashCode() {
        return Objects.hash(medicineId, quantity);
    }

    @Override
    public String toString() {
        return "CartRequest{" +
                "medicineId=" + medicineId +
                ", quantity=" + quantity +
                '}';
    }
}
