package com.petstore.backend.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class FileUploadController {

    private static final Logger log = LoggerFactory.getLogger(FileUploadController.class);


    @Value("${app.upload.dir:uploads}")
    private String uploadDir;


    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;


    private static final List<String> ALLOWED_TYPES = Arrays.asList(
        "image/jpeg", "image/png", "image/gif", "image/webp"
    );

    


    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadFile(
            @RequestParam("file") MultipartFile file) throws IOException {


        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "File is empty"));
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Only JPEG, PNG, GIF, and WebP images are allowed"));
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "File size must not exceed 5 MB"));
        }

        String originalName = file.getOriginalFilename();
        String extension    = getExtension(originalName);
        String savedName    = UUID.randomUUID() + "." + extension;

        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        Path targetPath = uploadPath.resolve(savedName);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        log.info("Saved upload: {} ({} bytes)", savedName, file.getSize());



        String fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
            .path("/api/uploads/")
            .path(savedName)
            .toUriString();

        return ResponseEntity.ok(Map.of(
            "url",          fileUrl,
            "filename",     savedName,
            "originalName", originalName != null ? originalName : "unknown",
            "size",         file.getSize()
        ));
    }


    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            // Prevent path traversal: only allow simple filenames
            if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
                return ResponseEntity.badRequest().build();
            }

            Path filePath = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(filename);
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = Files.probeContentType(filePath);
            if (contentType == null) contentType = "application/octet-stream";

            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);

        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            log.error("Could not serve file: {}", filename, e);
            return ResponseEntity.internalServerError().build();
        }
    }



    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "jpg";
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }
}