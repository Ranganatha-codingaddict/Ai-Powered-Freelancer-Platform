package com.freelanceplatform.controller;

import com.freelanceplatform.services.PaymentService;
import com.stripe.model.Charge;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    @Autowired
    private PaymentService paymentService;

    @PostMapping("/charge")
    public Charge createCharge(@RequestParam int amount, @RequestParam String currency, @RequestParam String source) throws Exception {
        return paymentService.createCharge(amount, currency, source);
    }
}