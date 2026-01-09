package com.medstore.service;

import com.medstore.dto.PaymentDTO;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {

    @Value("${stripe.api.key}")
    private String secretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }

    public PaymentIntent createPaymentIntent(PaymentDTO paymentInfo) throws StripeException {
        PaymentIntentCreateParams params =
            PaymentIntentCreateParams.builder()
                .setAmount(paymentInfo.getAmount())
                .setCurrency(paymentInfo.getCurrency())
                .setAutomaticPaymentMethods(
                    PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                        .setEnabled(true)
                        .build()
                )
                .build();

        return PaymentIntent.create(params);
    }
}
