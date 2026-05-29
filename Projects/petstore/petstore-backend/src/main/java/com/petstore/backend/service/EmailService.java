package com.petstore.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOrderConfirmation(String toEmail, String customerName, Long orderId, Double total, String paymentMethod) {
        if (toEmail == null || toEmail.isBlank()) return;
        send(
            toEmail,
            "Order Confirmation #" + orderId + " - PetStore",
            buildOrderEmail(customerName, orderId, total, paymentMethod)
        );
    }

    public void sendBookingConfirmation(String toEmail, String customerName, LocalDate date, String serviceType, String petName) {
        if (toEmail == null || toEmail.isBlank()) return;
        send(
            toEmail,
            "Booking Confirmed: " + serviceType + " on " + date,
            buildBookingEmail(customerName, date, serviceType, petName)
        );
    }

    private void send(String to, String subject, String html) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(message);
            log.info("Email sent to {}: {}", to, subject);
        } catch (MessagingException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error sending email to {}: {}", to, e.getMessage());
        }
    }

    private String buildOrderEmail(String customerName, Long orderId, Double total, String paymentMethod) {
        return """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
              <div style="background: #1976D2; padding: 24px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">🐾 PetStore</h1>
              </div>
              <div style="padding: 32px; background: #fafafa;">
                <h2 style="color: #1976D2; margin-top: 0;">Order Confirmed!</h2>
                <p style="color: #555;">Hi <strong>%s</strong>,</p>
                <p style="color: #555;">Your order has been placed successfully. Here are your details:</p>
                <table style="width: 100%%; border-collapse: collapse; margin: 20px 0; background: white; border-radius: 6px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <tr style="background: #e3f2fd;">
                    <td style="padding: 14px 16px; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #333; width: 40%%;">Order ID</td>
                    <td style="padding: 14px 16px; border-bottom: 1px solid #e0e0e0; color: #555;">#%d</td>
                  </tr>
                  <tr>
                    <td style="padding: 14px 16px; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #333;">Total</td>
                    <td style="padding: 14px 16px; border-bottom: 1px solid #e0e0e0; color: #1976D2; font-weight: bold; font-size: 16px;">%.2f MAD</td>
                  </tr>
                  <tr style="background: #e3f2fd;">
                    <td style="padding: 14px 16px; font-weight: bold; color: #333;">Payment Method</td>
                    <td style="padding: 14px 16px; color: #555;">%s</td>
                  </tr>
                </table>
                <p style="color: #555;">Thank you for shopping with us! If you have any questions, feel free to contact us.</p>
              </div>
              <div style="background: #333; padding: 16px; text-align: center;">
                <p style="color: #aaa; margin: 0; font-size: 13px;">© 2025 PetStore. All rights reserved.</p>
              </div>
            </div>
            """.formatted(
                customerName,
                orderId,
                total != null ? total : 0.0,
                paymentMethod != null ? paymentMethod : "N/A"
            );
    }

    private String buildBookingEmail(String customerName, LocalDate date, String serviceType, String petName) {
        String formattedDate = date.format(DateTimeFormatter.ofPattern("MMMM dd, yyyy"));
        return """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
              <div style="background: #1976D2; padding: 24px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">🐾 PetStore</h1>
              </div>
              <div style="padding: 32px; background: #fafafa;">
                <h2 style="color: #1976D2; margin-top: 0;">Appointment Confirmed!</h2>
                <p style="color: #555;">Hi <strong>%s</strong>,</p>
                <p style="color: #555;">Your appointment has been booked. Here are the details:</p>
                <table style="width: 100%%; border-collapse: collapse; margin: 20px 0; background: white; border-radius: 6px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <tr style="background: #e3f2fd;">
                    <td style="padding: 14px 16px; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #333; width: 40%%;">Service</td>
                    <td style="padding: 14px 16px; border-bottom: 1px solid #e0e0e0; color: #555;">%s</td>
                  </tr>
                  <tr>
                    <td style="padding: 14px 16px; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #333;">Pet</td>
                    <td style="padding: 14px 16px; border-bottom: 1px solid #e0e0e0; color: #555;">%s</td>
                  </tr>
                  <tr style="background: #e3f2fd;">
                    <td style="padding: 14px 16px; font-weight: bold; color: #333;">Date</td>
                    <td style="padding: 14px 16px; color: #1976D2; font-weight: bold;">%s</td>
                  </tr>
                </table>
                <p style="color: #555;">We look forward to seeing you and <strong>%s</strong>! Please arrive 5 minutes early.</p>
              </div>
              <div style="background: #333; padding: 16px; text-align: center;">
                <p style="color: #aaa; margin: 0; font-size: 13px;">© 2025 PetStore. All rights reserved.</p>
              </div>
            </div>
            """.formatted(customerName, serviceType, petName, formattedDate, petName);
    }
}
