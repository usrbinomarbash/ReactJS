package com.petstore.backend.controller;

import com.petstore.backend.model.Booking;
import com.petstore.backend.request.BookingRequest;
import com.petstore.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173") 
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    public List<Booking> getAllBookings() {
        System.out.println("GET /api/bookings called");
        return bookingService.getAllBookings();
    }

    @PostMapping
    public Booking createBooking(@RequestBody BookingRequest request) {
        System.out.println("POST /api/bookings called with: " + request);
        return bookingService.createBooking(request);
    }

    @PutMapping("/{id}")
    public Booking updateBooking(
            @PathVariable Long id,
            @RequestBody BookingRequest request) {
        System.out.println("PUT /api/bookings/" + id + " called");
        return bookingService.updateBooking(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable Long id) {
        System.out.println("DELETE /api/bookings/" + id + " called");
        bookingService.deleteBooking(id);
    }
}