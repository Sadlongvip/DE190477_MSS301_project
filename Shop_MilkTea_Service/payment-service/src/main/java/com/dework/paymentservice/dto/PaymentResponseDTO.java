package com.fuwork.paymentservice.dto;

import com.fuwork.paymentservice.model.PaymentMethod;
import com.fuwork.paymentservice.model.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponseDTO {

    private String transactionCode;
    private String orderCode;
    private double amount;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;
    private String paymentUrl;
    private String message;
}
