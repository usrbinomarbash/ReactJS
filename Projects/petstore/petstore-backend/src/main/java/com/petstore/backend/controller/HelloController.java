package com.petstore.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/")
    public String home() {
        return " PetStore Backend is running!";
    }

    @GetMapping("/api/test")
    public String test() {
        return "API/test endpoint connection is working fine";
    }
}