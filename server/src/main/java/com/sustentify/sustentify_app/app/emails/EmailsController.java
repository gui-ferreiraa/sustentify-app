package com.sustentify.sustentify_app.app.emails;

import com.sustentify.sustentify_app.app.emails.dtos.EmailDto;
import com.sustentify.sustentify_app.dtos.ResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/v1/emails")
public class EmailsController {

    private final EmailsService emailsService;

    public EmailsController(EmailsService emailsService) {
        this.emailsService = emailsService;
    }

    @PostMapping
    public ResponseEntity<ResponseDto> create(@RequestBody EmailDto emailDto) {
        this.emailsService.sendEmailContact(emailDto);
        ResponseDto res = new ResponseDto(HttpStatus.OK, "Email sending", true, Optional.empty());

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(res);
    }
}
