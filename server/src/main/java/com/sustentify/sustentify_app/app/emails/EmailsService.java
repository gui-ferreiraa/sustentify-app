package com.sustentify.sustentify_app.app.emails;

import com.sustentify.sustentify_app.app.emails.exceptions.EmailSendingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

@Service
public class EmailsService {

    @Value("${spring.mail.username}")
    private String sender;

    @Value("${api.web.domain}")
    private String webDomain;

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;


    public EmailsService(JavaMailSender mailSender, SpringTemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    public void sendEmail(EmailDto dto) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            helper.setFrom(sender);
            helper.setSubject(dto.subject());
            helper.setTo(dto.company().getEmail());

            Context context = new Context();
            context.setVariable("subject", dto.subject());
            context.setVariable("company", dto.company());
            context.setVariable("token", dto.token());
            context.setVariable("domain", webDomain);
            String htmlBody = templateEngine.process("recover-password.html", context);

            helper.setText(htmlBody, true);

            mailSender.send(mimeMessage);

        } catch (Exception e) {
            throw new EmailSendingException("Could not send email");
        }
    }
}
