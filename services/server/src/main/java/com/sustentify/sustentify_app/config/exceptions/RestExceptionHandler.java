package com.sustentify.sustentify_app.config.exceptions;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import com.sustentify.sustentify_app.app.companies.exceptions.CompanyValidationException;
import com.sustentify.sustentify_app.app.emails.exceptions.EmailSendingException;
import com.sustentify.sustentify_app.app.upload.exceptions.UploadInvalidException;
import com.sustentify.sustentify_app.app.auth.jwt.exceptions.TokenValidationException;
import com.sustentify.sustentify_app.app.companies.exceptions.CompanyAlreadyExistsException;
import com.sustentify.sustentify_app.app.companies.exceptions.CompanyNotFoundException;
import com.sustentify.sustentify_app.app.companies.exceptions.CompanyPasswordInvalidException;
import com.sustentify.sustentify_app.app.interestedProducts.exceptions.InterestedProductsInvalidException;
import com.sustentify.sustentify_app.app.interestedProducts.exceptions.InterestedProductsNotFoundException;
import com.sustentify.sustentify_app.app.products.exceptions.ProductAlreadyExistsException;
import com.sustentify.sustentify_app.app.products.exceptions.ProductInvalidException;
import com.sustentify.sustentify_app.app.products.exceptions.ProductNotFoundException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@ControllerAdvice
public class RestExceptionHandler {

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

    @ExceptionHandler(TokenValidationException.class)
    private ResponseEntity<ResponseError> tokenValidationHandler(TokenValidationException exception) {
        ResponseError responseError = new ResponseError(HttpStatus.UNAUTHORIZED, exception.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseError);
    }

    @ExceptionHandler(ProductAlreadyExistsException.class)
    private ResponseEntity<ResponseError> productAlreadyExistsHandler(ProductAlreadyExistsException exception) {
        ResponseError responseError = new ResponseError(HttpStatus.CONFLICT, exception.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(responseError);
    }

    @ExceptionHandler(ProductInvalidException.class)
    private ResponseEntity<ResponseError> productInvalidHandler(ProductInvalidException exception) {
        ResponseError responseError = new ResponseError(HttpStatus.CONFLICT, exception.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(responseError);
    }

    @ExceptionHandler(ProductNotFoundException.class)
    private ResponseEntity<ResponseError> productNotFoundHandler(ProductNotFoundException exception) {
        ResponseError responseError = new ResponseError(HttpStatus.NOT_FOUND, exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(responseError);
    }

    @ExceptionHandler(InterestedProductsNotFoundException.class)
    private ResponseEntity<ResponseError> interestedProductsNotFoundHandler(InterestedProductsNotFoundException exception) {
        ResponseError responseError = new ResponseError(HttpStatus.NOT_FOUND, exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(responseError);
    }

    @ExceptionHandler(InterestedProductsInvalidException.class)
    private ResponseEntity<ResponseError> interestedProductsInvalidHandler(InterestedProductsInvalidException exception) {
        ResponseError responseError = new ResponseError(HttpStatus.CONFLICT, exception.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(responseError);
    }

    @ExceptionHandler({
            ConstraintViolationException.class,
            HttpMessageNotReadableException.class,
            MethodArgumentNotValidException.class,
            TransactionSystemException.class
    })
    public ResponseEntity<ResponseError> constraintViolationHandler(Exception exception) {
        if (exception instanceof ConstraintViolationException) {
            List<String> errors = ((ConstraintViolationException) exception).getConstraintViolations()
                    .stream()
                    .map(ConstraintViolation::getMessage)
                    .toList();

            ResponseError responseError = new ResponseError(HttpStatus.BAD_REQUEST, "Validation failed", errors);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseError);
        }

        if (exception instanceof HttpMessageNotReadableException) {
            InvalidFormatException invalidFormatException = (InvalidFormatException) exception.getCause();
            String fieldName = invalidFormatException.getPath().get(0).getFieldName();
            String invalidValue = invalidFormatException.getValue().toString();
            String message = String.format("Invalid value '%s' for field '%s'. Accepted values: %s",
                    invalidValue, fieldName, Arrays.toString(invalidFormatException.getTargetType().getEnumConstants()));

            ResponseError responseError = new ResponseError(HttpStatus.BAD_REQUEST, message);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseError);
        }

        if (exception instanceof MethodArgumentNotValidException methodArgumentNotValidException) {

            List<String> errors = methodArgumentNotValidException.getBindingResult().getFieldErrors()
                    .stream()
                    .map(fieldError -> fieldError.getField() + " " + fieldError.getDefaultMessage())
                    .collect(Collectors.toList());

            ResponseError responseError = new ResponseError(HttpStatus.BAD_REQUEST, "Validation failed", errors);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseError);
        }

        ResponseError genericError = new ResponseError(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", List.of("An unexpected error occurred"));
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(genericError);
    }

    @ExceptionHandler(UploadInvalidException.class)
    public ResponseEntity<ResponseError> uploadInvalidHandler(UploadInvalidException exception) {
        ResponseError responseError = new ResponseError(HttpStatus.BAD_REQUEST, exception.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseError);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ResponseError> maxUploadSizeExceededHandler(MaxUploadSizeExceededException exception) {
        ResponseError responseError = new ResponseError(HttpStatus.BAD_REQUEST, exception.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseError);
    }

    @ExceptionHandler(EmailSendingException.class)
    public ResponseEntity<ResponseError> emailSendingHandler(EmailSendingException exception) {
        ResponseError responseError = new ResponseError(HttpStatus.BAD_REQUEST, exception.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseError);
    }

    @ExceptionHandler(CompanyValidationException.class)
    public ResponseEntity<ResponseError> companyValidationHandler(CompanyValidationException exception) {
        ResponseError responseError = new ResponseError(exception.getStatus(), exception.getMessage());
        return ResponseEntity.status(exception.getStatus()).body(responseError);
    }
}
