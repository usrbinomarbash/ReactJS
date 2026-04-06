package com.petstore.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import com.petstore.backend.model.Order;
import com.petstore.backend.repository.OrderRepository;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // GET all orders
    @GetMapping
    public List<Order> getAllOrders() {
        System.out.println("GET /api/orders called");
        return orderRepository.findAll();
    }

    // GET order by ID
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        System.out.println("GET /api/orders/" + id + " called");
        return orderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET order with full details
    @GetMapping("/{id}/details")
    public Map<String, Object> getOrderDetails(@PathVariable Long id) {
        System.out.println("GET /api/orders/" + id + "/details called");
        
        Map<String, Object> order = jdbcTemplate.queryForMap("""
            SELECT o.*, c.full_name as customer_name, c.email as customer_email, c.phone as customer_phone,
                   e.name as employee_name
            FROM orders o
            LEFT JOIN customer c ON o.customer_id = c.customer_id
            LEFT JOIN employee e ON o.employee_id = e.employee_id
            WHERE o.order_id = ?
            """, id);

        List<Map<String, Object>> items = jdbcTemplate.queryForList("""
            SELECT oi.*, p.name as product_name, p.category,
                   (oi.quantity * oi.price) as line_total
            FROM order_item oi
            JOIN product p ON oi.product_id = p.product_id
            WHERE oi.order_id = ?
            """, id);

        order.put("items", items);
        order.put("item_count", items.size());
        return order;
    }

    // GET orders by customer
    @GetMapping("/customer/{customerId}")
    public List<Order> getOrdersByCustomer(@PathVariable Long customerId) {
        System.out.println("GET /api/orders/customer/" + customerId + " called");
        return orderRepository.findByCustomerId(customerId);
    }

    // GET orders by employee
    @GetMapping("/employee/{employeeId}")
    public List<Order> getOrdersByEmployee(@PathVariable Long employeeId) {
        System.out.println("GET /api/orders/employee/" + employeeId + " called");
        return orderRepository.findByEmployeeId(employeeId);
    }

    // GET orders by payment method
    @GetMapping("/payment/{paymentMethod}")
    public List<Order> getOrdersByPaymentMethod(@PathVariable String paymentMethod) {
        System.out.println("GET /api/orders/payment/" + paymentMethod + " called");
        return orderRepository.findByPaymentMethod(paymentMethod);
    }

    // GET recent orders
    @GetMapping("/recent")
    public List<Map<String, Object>> getRecentOrders() {
        System.out.println("GET /api/orders/recent called");
        return jdbcTemplate.queryForList("""
            SELECT o.*, c.full_name as customer_name,
                   (SELECT COUNT(*) FROM order_item oi WHERE oi.order_id = o.order_id) as item_count
            FROM orders o
            LEFT JOIN customer c ON o.customer_id = c.customer_id
            ORDER BY o.created_at DESC
            LIMIT 10
            """);
    }

    // GET order summary/stats
    @GetMapping("/summary")
    public Map<String, Object> getOrderSummary() {
        System.out.println("GET /api/orders/summary called");
        return jdbcTemplate.queryForMap("""
            SELECT
                COUNT(*) as total_orders,
                COALESCE(SUM(total), 0) as total_revenue,
                ROUND(COALESCE(AVG(total), 0)::numeric, 2) as avg_order_value,
                MAX(total) as max_order_value,
                MIN(total) as min_order_value,
                COUNT(CASE WHEN created_at >= CURRENT_DATE THEN 1 END) as orders_today,
                COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as orders_this_week
            FROM orders
            """);
    }

    // GET orders by date range
    @GetMapping("/date-range")
    public List<Map<String, Object>> getOrdersByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        System.out.println("GET /api/orders/date-range called");
        return jdbcTemplate.queryForList("""
            SELECT o.*, c.full_name as customer_name
            FROM orders o
            LEFT JOIN customer c ON o.customer_id = c.customer_id
            WHERE o.created_at >= ?::timestamp
            AND o.created_at <= (?::timestamp + INTERVAL '1 day')
            ORDER BY o.created_at DESC
            """, startDate, endDate);
    }

    // POST create new order
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        System.out.println("POST /api/orders called");
        Order savedOrder = orderRepository.save(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedOrder);
    }

    // PUT update order
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Order orderDetails) {
        System.out.println("PUT /api/orders/" + id + " called");
        return orderRepository.findById(id)
                .map(existingOrder -> {
                    existingOrder.setCustomerId(orderDetails.getCustomerId());
                    existingOrder.setEmployeeId(orderDetails.getEmployeeId());
                    existingOrder.setTotal(orderDetails.getTotal());
                    existingOrder.setPaymentMethod(orderDetails.getPaymentMethod());
                    return ResponseEntity.ok(orderRepository.save(existingOrder));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE order
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        System.out.println("DELETE /api/orders/" + id + " called");
        if (orderRepository.existsById(id)) {
            // Delete order items first
            jdbcTemplate.update("DELETE FROM order_item WHERE order_id = ?", id);
            orderRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}