package com.sustentify.sustentify_app.utils;

import com.sustentify.sustentify_app.app.upload.exceptions.UploadInvalidException;
import org.springframework.web.multipart.MultipartFile;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.UUID;
import java.util.regex.Pattern;

public final class FileUploadUtil {

    private FileUploadUtil() {
    }

    public static final long MAX_FILE_SIZE = 1024 * 1024 * 15; // 15 MB
    public static final long MIN_FILE_SIZE = 1024 * 1024;      // 1 MB

    public static final String DATE_PATTERN = "dd-MM-yyyy";
    public static final String FILE_NAME_FORMAT = "%s_%s_%s";
    private static final Pattern ALLOWED_FILE_PATTERN = Pattern.compile(".*\\.(jpg|png|pdf)$", Pattern.CASE_INSENSITIVE);

    public static boolean isAllowedExtension(final String filename) {
        return ALLOWED_FILE_PATTERN.matcher(filename).matches();
    }

    public static void assertAllowed(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new UploadInvalidException("File is empty");
        }

        final long size = file.getSize();

        if (size > MAX_FILE_SIZE) {
            throw new UploadInvalidException("File is too large");
        }

        final String fileName = file.getOriginalFilename();
        if (fileName == null || !isAllowedExtension(fileName)) {
            throw new UploadInvalidException("File extension not supported");
        }
    }

    public static String getFileName(final String filename) {
        final DateFormat dateFormat = new SimpleDateFormat(DATE_PATTERN);
        final String date = dateFormat.format(System.currentTimeMillis());
        final String uuid = UUID.randomUUID().toString().substring(0, 8);

        String newFileName = filename.substring(0, filename.lastIndexOf('.'));

        return String.format(FILE_NAME_FORMAT, date, removeSpaces(newFileName), uuid);
    }

    private static String removeSpaces(String filename) {
        return filename.replaceAll("\\s+", "_");
    }
}
