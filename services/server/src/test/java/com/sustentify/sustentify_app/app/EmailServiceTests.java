package com.sustentify.sustentify_app.app;

import com.sustentify.sustentify_app.app.cache.CacheService;
import com.sustentify.sustentify_app.app.emails.EmailTemplate;
import com.sustentify.sustentify_app.app.emails.EmailsService;
import com.sustentify.sustentify_app.app.emails.exceptions.EmailSendingException;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.test.util.ReflectionTestUtils;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.time.Duration;
import java.util.Optional;

public class EmailServiceTests {
    @Mock
    private JavaMailSender mailSender;

    @Mock
    private SpringTemplateEngine templateEngine;

    @Mock
    private CacheService cacheService;

    @InjectMocks
    private EmailsService emailsService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should setEmailCooldown is Succesfully")
    public void setEmailCooldownCase1() {
        String email = "test@test.com";

        emailsService.setEmailCooldown(email);

        Mockito.verify(cacheService, Mockito.times(1)).put(Mockito.anyString(), Mockito.anyString(), Mockito.any());
    }

    @Test
    @DisplayName("Should isEmailCooldownActive is Succesfully")
    public void isEmailCooldownActiveCase1() {
        String email = "test@test.com";
        String key = "email:cooldown:" + email;
        Mockito.when(cacheService.exists(key)).thenReturn(true);
        Mockito.when(cacheService.getRemainingTTL(key)).thenReturn(Duration.ofMinutes(1));

        boolean active = emailsService.isEmailCooldownActive(email);

        Assertions.assertTrue(active);
        Mockito.verify(cacheService, Mockito.times(1)).exists(key);
        Mockito.verify(cacheService, Mockito.times(1)).getRemainingTTL(key);
    }

    @Test
    @DisplayName("Should isEmailCooldownActive Seconds is False")
    public void isEmailCooldownActiveCase2() {
        String email = "test@test.com";
        String key = "email:cooldown:" + email;

        Mockito.when(cacheService.exists(key)).thenReturn(true);
        Mockito.when(cacheService.getRemainingTTL(key)).thenReturn(Duration.ofSeconds(0));

        boolean active = emailsService.isEmailCooldownActive(email);

        Mockito.verify(cacheService, Mockito.times(1)).exists(key);
        Mockito.verify(cacheService, Mockito.times(1)).getRemainingTTL(key);
        Assertions.assertFalse(active);
    }

    @Test
    @DisplayName("Should isEmailCooldownActive Exists key is False")
    public void isEmailCooldownActiveCase3() {
        String email = "test@test.com";
        String key = "email:cooldown:" + email;

        Mockito.when(cacheService.exists(key)).thenReturn(false);
        Mockito.when(cacheService.getRemainingTTL(key)).thenReturn(Duration.ofSeconds(0));

        boolean active = emailsService.isEmailCooldownActive(email);

        Mockito.verify(cacheService, Mockito.times(1)).exists(key);
        Mockito.verify(cacheService, Mockito.times(0)).getRemainingTTL(key);
        Assertions.assertFalse(active);
    }

    @Test
    @DisplayName("Should sendEmail throws EmailSendingException")
    public void sendEmailCase1() {
        String email = "test@test.com";
        String key = "email:cooldown:" + email;

        Mockito.when(cacheService.exists(key)).thenReturn(true);
        Mockito.when(cacheService.getRemainingTTL(key)).thenReturn(Duration.ofSeconds(30));

        Context context = new Context();
        Assertions.assertThrows(EmailSendingException.class, () -> {
            emailsService.sendEmail("test", email, EmailTemplate.CONTACT, context, Optional.empty());
        });
    }

    @Test
    @DisplayName("Should sendEmail is Successfully")
    public void sendEmailCase2() {
        ReflectionTestUtils.setField(emailsService, "sender", "test@test.com");
        ReflectionTestUtils.setField(emailsService, "webDomain", "http://localhost");

        String email = "test@test.com";
        String key = "email:cooldown:" + email;

        Mockito.when(cacheService.exists(key)).thenReturn(false);
        Mockito.when(cacheService.getRemainingTTL(key)).thenReturn(Duration.ofSeconds(30));

        MimeMessage mimeMessage = new JavaMailSenderImpl().createMimeMessage();
        Mockito.when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        Mockito.when(templateEngine.process(Mockito.anyString(), Mockito.<Context>any())).thenReturn("");

        Context context = new Context();
        emailsService.sendEmail("test", email, EmailTemplate.CONTACT, context, Optional.empty());

        Mockito.verify(mailSender, Mockito.times(1)).send(Mockito.any(MimeMessage.class));
    }
}
