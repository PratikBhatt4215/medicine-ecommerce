package com.medstore.dto;

import lombok.Data;

public class PaymentDTO {
    private Long amount; // in cents
    private String currency; // e.g., "usd", "inr"
	public Long getAmount() {
		return amount;
	}
	public void setAmount(Long amount) {
		this.amount = amount;
	}
	public String getCurrency() {
		return currency;
	}
	public void setCurrency(String currency) {
		this.currency = currency;
	}
}
