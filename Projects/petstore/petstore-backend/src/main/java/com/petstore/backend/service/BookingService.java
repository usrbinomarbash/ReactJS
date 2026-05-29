package com.petstore.backend.service;

import com.petstore.backend.exception.ResourceNotFoundException;
import com.petstore.backend.model.Booking;
import com.petstore.backend.model.Customer;
import com.petstore.backend.model.Pet;
import com.petstore.backend.repository.BookingRepository;
import com.petstore.backend.repository.CustomerRepository;
import com.petstore.backend.repository.PetRepository;
import com.petstore.backend.request.BookingRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BookingService {

    private static final Logger log = LoggerFactory.getLogger(BookingService.class);
    
    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final PetRepository petRepository;
    private final EmailService emailService;

    public BookingService(BookingRepository bookingRepository,
                          CustomerRepository customerRepository,
                          PetRepository petRepository,
                          EmailService emailService) {
        this.bookingRepository = bookingRepository;
        this.customerRepository = customerRepository;
        this.petRepository = petRepository;
        this.emailService = emailService;
    }

    public List<Booking> getAllBookings() {
        log.debug("Fetching all bookings");
        return bookingRepository.findAllBookings();
    }

    public Booking getBookingById(Long id) {
        log.debug("Fetching booking with ID: {}", id);
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));
    }

    public Booking createBooking(BookingRequest req) {
        log.info("Creating booking: date={}, customerId={}, petId={}, service={}", 
                req.getDate(), req.getCustomerId(), req.getPetId(), req.getServiceType());

        // Validate date is not in the past
        LocalDate bookingDate = LocalDate.parse(req.getDate());
        if (bookingDate.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Cannot create booking in the past");
        }

        Customer customer = customerRepository.findById(req.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", req.getCustomerId()));
        
        log.debug("Found customer: {}", customer.getFullName());

        Pet pet = petRepository.findById(req.getPetId())
                .orElseThrow(() -> new ResourceNotFoundException("Pet", "id", req.getPetId()));
        
        log.debug("Found pet: {}", pet.getName());

        Booking booking = new Booking();
        booking.setDate(bookingDate);
        booking.setCustomer(customer);
        booking.setPet(pet);
        booking.setServiceType(req.getServiceType());

        Booking saved = bookingRepository.save(booking);
        log.info("Booking created successfully with ID: {}", saved.getBookingId());

        emailService.sendBookingConfirmation(
            customer.getEmail(),
            customer.getFullName(),
            bookingDate,
            req.getServiceType(),
            pet.getName()
        );

        return saved;
    }

    public Booking updateBooking(Long id, BookingRequest req) {
        log.info("Updating booking ID: {}", id);

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));

        LocalDate bookingDate = LocalDate.parse(req.getDate());
        if (bookingDate.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Cannot set booking date in the past");
        }

        // Find customer
        Customer customer = customerRepository.findById(req.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", req.getCustomerId()));

        // Find pet
        Pet pet = petRepository.findById(req.getPetId())
                .orElseThrow(() -> new ResourceNotFoundException("Pet", "id", req.getPetId()));

        // Update booking
        booking.setDate(bookingDate);
        booking.setCustomer(customer);
        booking.setPet(pet);
        booking.setServiceType(req.getServiceType());

        Booking saved = bookingRepository.save(booking);
        log.info("Booking updated successfully");
        
        return saved;
    }

    public void deleteBooking(Long id) {
        log.info("Deleting booking with ID: {}", id);
        
        if (!bookingRepository.existsById(id)) {
            throw new ResourceNotFoundException("Booking", "id", id);
        }
        
        bookingRepository.deleteById(id);
        log.info("Booking deleted successfully");
    }

    
}