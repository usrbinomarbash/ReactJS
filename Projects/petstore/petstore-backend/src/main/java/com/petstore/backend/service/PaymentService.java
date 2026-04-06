package com.petstore.backend.service;

import com.petstore.backend.exception.ResourceNotFoundException;
import com.petstore.backend.model.Payment;
import com.petstore.backend.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);
    
    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public List<Payment> getAllPayments() {
        log.debug("Fetching all payments");
        return paymentRepository.findAll();
    }

    public Payment getPaymentById(Long id) {
        log.debug("Fetching payment with ID: {}", id);
        return paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));
    }

    public Payment getPaymentByOrderId(Long orderId) {
        log.debug("Fetching payment for order ID: {}", orderId);
        return paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "orderId", orderId));
    }

    public List<Payment> getPaymentsByStatus(String status) {
        log.debug("Fetching payments with status: {}", status);
        return paymentRepository.findByStatus(status);
    }

    public Payment createPayment(Payment payment) {
        log.info("Creating payment for order ID: {}", payment.getOrderId());
        Payment saved = paymentRepository.save(payment);
        log.info("Payment created with ID: {}", saved.getPaymentId());
        return saved;
    }

    public Payment updatePayment(Long id, Payment updatedPayment) {
        log.info("Updating payment with ID: {}", id);
        
        Payment existing = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));
        
        existing.setAmount(updatedPayment.getAmount());
        existing.setPaymentMethod(updatedPayment.getPaymentMethod());
        existing.setStatus(updatedPayment.getStatus());
        existing.setPaymentDate(updatedPayment.getPaymentDate());
        
        Payment saved = paymentRepository.save(existing);
        log.info("Payment updated successfully");
        return saved;
    }

    public void deletePayment(Long id) {
        log.info("Deleting payment with ID: {}", id);
        
        if (!paymentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Payment", "id", id);
        }
        
        paymentRepository.deleteById(id);
        log.info("Payment deleted successfully");
    }
}