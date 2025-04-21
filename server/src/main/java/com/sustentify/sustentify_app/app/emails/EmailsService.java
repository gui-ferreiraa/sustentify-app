package com.sustentify.sustentify_app.app.emails;

import com.sustentify.sustentify_app.app.emails.exceptions.EmailSendingException;
import com.sustentify.sustentify_app.app.cache.CacheService;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.time.Duration;

@Service
public class EmailsService {

    private static final Duration COOLDOWN_EMAIL_DURATION = Duration.ofMinutes(3);
    private static final String COOLDOWN_EMAIL_PREFIX = "email:cooldown:";

    @Value("${spring.mail.username}")
    private String sender;

    @Value("${api.web.domain}")
    private String webDomain;

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;
    private final CacheService cacheService;

    public EmailsService(JavaMailSender mailSender, SpringTemplateEngine templateEngine, CacheService cacheService) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
        this.cacheService = cacheService;
    }

    public void setEmailCooldown(String email) {
        String key = COOLDOWN_EMAIL_PREFIX + email;
        cacheService.put(key, "true", COOLDOWN_EMAIL_DURATION);
    }

    public boolean isEmailCooldownActive(String email) {
        String key = COOLDOWN_EMAIL_PREFIX + email;

        if (cacheService.exists(key)) {
            Duration ttl = cacheService.getRemainingTTL(key);

            return ttl.getSeconds() > 0;
        }

        return false;
    }

    @Transactional
    public void sendEmail(EmailDto dto) {
        String receiver = dto.company().getEmail();
        String subject = dto.subject() + " | Sustentify App";

        if (isEmailCooldownActive(dto.company().getEmail())) {
            throw new EmailSendingException("Please wait a few minutes before requesting another email.");
        }

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            helper.setFrom(sender);
            helper.setSubject(subject);
            helper.setTo(receiver);

            Context context = new Context();
            context.setVariable("subject", subject);
            context.setVariable("company", dto.company());
            context.setVariable("token", dto.token());
            context.setVariable("domain", webDomain);
            String htmlBody = templateEngine.process("recover-password.html", context);

            helper.setText(htmlBody, true);

            mailSender.send(mimeMessage);

            setEmailCooldown(receiver);
        } catch (Exception e) {
            throw new EmailSendingException("An unexpected error occurred while trying to send the email. Please try again later.");
        }
    }
}
