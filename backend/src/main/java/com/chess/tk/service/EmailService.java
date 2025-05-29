package com.chess.tk.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.email.userName}")
    private String userName;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetLink(String email, String link) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(userName);
            helper.setTo(email);
            helper.setSubject("tk.chess.school - Password Reset");

            String htmlContent = """
            <p>Hello,</p>
            <p>You requested to reset your password for <strong>tk.chess.school</strong>.</p>
            <p>Click the link below to reset your password:</p>
            <p><a href="%s" target="_blank">Reset Password</a></p>
            <br>
            <p>If you did not request this, please ignore this email.</p>
            """.formatted(link);

            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
