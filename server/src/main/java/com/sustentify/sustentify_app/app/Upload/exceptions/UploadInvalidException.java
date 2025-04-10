package com.sustentify.sustentify_app.app.Upload.exceptions;

public class UploadInvalidException extends RuntimeException {
    public UploadInvalidException(String message) {
        super(message);
    }

    public UploadInvalidException(String message, Throwable cause) {
        super(message, cause);
    }

    public UploadInvalidException() {
        super("Upload invalid image");
    }
}
