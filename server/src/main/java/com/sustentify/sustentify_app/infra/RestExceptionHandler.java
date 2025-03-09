package com.sustentify.sustentify_app.infra;

import com.sustentify.sustentify_app.exceptions.CompanyAlreadyExistsException;
import com.sustentify.sustentify_app.exceptions.CompanyNotFoundException;
import com.sustentify.sustentify_app.exceptions.CompanyPasswordInvalidException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(CompanyNotFoundException.class)
    private ResponseEntity<ResponseError> companyNotFoundHandler(CompanyNotFoundException exception) {
        ResponseError responseError = new ResponseError(HttpStatus.NOT_FOUND, exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(responseError);
    }

    @ExceptionHandler(CompanyAlreadyExistsException.class)
    private ResponseEntity<ResponseError> companyAlreadyExistsHandler(CompanyAlreadyExistsException exception) {
        ResponseError responseError = new ResponseError(HttpStatus.CONFLICT, exception.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(responseError);
    }

    @ExceptionHandler(CompanyPasswordInvalidException.class)
    private ResponseEntity<ResponseError> companyPasswordInvalidHandler(CompanyPasswordInvalidException exception) {
        ResponseError responseError = new ResponseError(HttpStatus.BAD_REQUEST, exception.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseError);
    }
}
