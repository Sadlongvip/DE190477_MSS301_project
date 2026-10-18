package com.fuwork.paymentservice.service;

import com.fuwork.paymentservice.dto.PaymentRequestDTO;
import com.fuwork.paymentservice.dto.PaymentResponseDTO;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

public interface PaymentService {

    PaymentResponseDTO createPayment(PaymentRequestDTO request, HttpServletRequest httpRequest);

    Map<String, String> processVNPayIpn(Map<String, String> params);

    PaymentResponseDTO getPaymentStatusByOrderCode(String orderCode);
}
