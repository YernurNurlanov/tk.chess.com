package com.chess.tk.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender emailSender;

    @Value("${spring.email.userName}")
    private String userName;

    @Value("${spring.front.url}")
    private String url;

    public EmailService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    public void sendPasswordResetLink(String email, String link) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
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

            emailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public void sendCredentialsEmail(String email, String password) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(userName);
            helper.setTo(email);
            helper.setSubject("tk.chess.school - Your Account Credentials");

            String htmlContent = """
        <p>Hello,</p>
        <p>Your account for <strong>tk.chess.school</strong> has been created.</p>
        <p>Here are your login credentials:</p>
        <ul>
            <li><strong>Login (email):</strong> %s</li>
            <li><strong>Temporary password:</strong> %s</li>
        </ul>
        <p>Please log in and change your password immediately after first login.</p>
        <p><a href="%s/auth" target="_blank">Log In</a></p>
        <br>
        <p>If you have any issues, contact your administrator.</p>
        """.formatted(email, password, url);

            helper.setText(htmlContent, true);

            emailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
