package com.medstore.controller;

import com.medstore.dto.PaymentDTO;
import com.medstore.service.PaymentService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:5173") // Adjust port if needed for frontend
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-payment-intent")
    public ResponseEntity<String> createPaymentIntent(@RequestBody PaymentDTO paymentInfo) throws StripeException {
        PaymentIntent paymentIntent = paymentService.createPaymentIntent(paymentInfo);
        return new ResponseEntity<>(paymentIntent.toJson(), HttpStatus.OK);
    }
}
