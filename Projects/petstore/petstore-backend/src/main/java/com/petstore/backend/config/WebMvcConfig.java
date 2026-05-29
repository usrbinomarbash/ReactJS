package com.petstore.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Makes the local /uploads folder accessible over HTTP.
 *
 * After adding this class, both of these work:
 *   • The controller endpoint  GET /api/uploads/{filename}  (from FileUploadController)
 *   • This resource handler    GET /api/uploads/{filename}  (direct static serve fallback)
 *
 * The controller takes priority, so you keep full control (Content-Type,
 * security checks, path-traversal prevention).  The resource handler is a
 * belt-and-suspenders fallback and is useful if you ever remove the controller.
 *
 * Create this file at:
 *   src/main/java/com/petstore/backend/config/WebMvcConfig.java
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Resolve the upload path to an absolute file:// URI so Spring can serve it
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        String resourceLocation = "file:" + uploadPath.toString() + "/";

        registry
            .addResourceHandler("/api/uploads/**")
            .addResourceLocations(resourceLocation);
    }
}