package com.freelanceplatform.services;

import com.stripe.Stripe;
import com.stripe.model.Charge;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {
    @Value("${stripe.api.key}")
    private String stripeApiKey;

    public PaymentService() {
        Stripe.apiKey = stripeApiKey;
    }

    public Charge createCharge(int amount, String currency, String source) throws Exception {
        Map<String, Object> params = new HashMap<>();
        params.put("amount", amount);
        params.put("currency", currency);
        params.put("source", source);
        return Charge.create(params);
    }
}