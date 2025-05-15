package com.sustentify.sustentify_app.app.emails;

import com.sustentify.sustentify_app.app.emails.dtos.EmailDto;
import com.sustentify.sustentify_app.dtos.ResponseDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.thymeleaf.context.Context;

import java.util.Optional;

@RestController
@RequestMapping("/v1/emails")
public class EmailsController {

    @Value("${spring.mail.username}")
    private String sender;

    private final EmailsService emailsService;

    public EmailsController(EmailsService emailsService) {
        this.emailsService = emailsService;
    }

    @PostMapping
    public ResponseEntity<ResponseDto> create(@RequestBody EmailDto emailDto) {

        Context context = new Context();
        context.setVariable("name", emailDto.name());
        context.setVariable("message", emailDto.message());
        context.setVariable("email", emailDto.email());
        context.setVariable("phone", emailDto.phone());
        this.emailsService.sendEmail(emailDto.subject(), sender, EmailTemplate.CONTACT, context, Optional.empty());

        ResponseDto res = new ResponseDto(HttpStatus.OK, "Email sending", true, Optional.empty());

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(res);
    }
}
