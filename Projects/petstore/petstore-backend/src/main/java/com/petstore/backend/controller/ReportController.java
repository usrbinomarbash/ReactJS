package com.petstore.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ReportController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Dashboard summary statistics
    @GetMapping("/dashboard-stats")
    public Map<String, Object> getDashboardStats() {
        System.out.println("GET /api/reports/dashboard-stats called");
        
        String sql = """
            SELECT
                (SELECT COUNT(*) FROM customer) as total_customers,
                (SELECT COUNT(*) FROM pet) as total_pets,
                (SELECT COUNT(*) FROM product) as total_products,
                (SELECT COUNT(*) FROM booking) as total_bookings,
                (SELECT COUNT(*) FROM orders) as total_orders,
                (SELECT COALESCE(SUM(total), 0) FROM orders) as total_revenue,
                (SELECT COUNT(*) FROM product WHERE stock_quantity < 10) as low_stock_count,
                (SELECT ROUND(COALESCE(AVG(pet_count), 0)::numeric, 2) FROM (
                    SELECT COUNT(pet_id) as pet_count FROM pet GROUP BY customer_id
                ) as pet_counts) as avg_pets_per_customer
            """;
        return jdbcTemplate.queryForMap(sql);
    }

    // Top selling products
    @GetMapping("/top-products")
    public List<Map<String, Object>> getTopSellingProducts() {
        System.out.println("GET /api/reports/top-products called");
        String sql = """
            SELECT p.product_id, p.name, p.category, p.price,
                   COALESCE(SUM(oi.quantity), 0) as total_sold,
                   COALESCE(SUM(oi.quantity * oi.price), 0) as total_revenue
            FROM product p
            LEFT JOIN order_item oi ON p.product_id = oi.product_id
            GROUP BY p.product_id, p.name, p.category, p.price
            ORDER BY total_sold DESC
            LIMIT 10
            """;
        return jdbcTemplate.queryForList(sql);
    }

    // Monthly revenue report
    @GetMapping("/revenue/monthly")
    public List<Map<String, Object>> getMonthlyRevenue() {
        System.out.println("GET /api/reports/revenue/monthly called");
        String sql = """
            SELECT TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') as month,
                   SUM(total) as revenue,
                   COUNT(*) as order_count,
                   ROUND(AVG(total)::numeric, 2) as avg_order_value
            FROM orders
            GROUP BY DATE_TRUNC('month', created_at)
            ORDER BY month DESC
            LIMIT 12
            """;
        return jdbcTemplate.queryForList(sql);
    }

    // Daily revenue for current month
    @GetMapping("/revenue/daily")
    public List<Map<String, Object>> getDailyRevenue() {
        System.out.println("GET /api/reports/revenue/daily called");
        String sql = """
            SELECT DATE(created_at) as date,
                   SUM(total) as revenue,
                   COUNT(*) as order_count
            FROM orders
            WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
            GROUP BY DATE(created_at)
            ORDER BY date DESC
            """;
        return jdbcTemplate.queryForList(sql);
    }

    // Revenue by category
    @GetMapping("/revenue/by-category")
    public List<Map<String, Object>> getRevenueByCategory() {
        System.out.println("GET /api/reports/revenue/by-category called");
        String sql = """
            SELECT c.name as category_name,
                   COUNT(DISTINCT oi.order_id) as order_count,
                   COALESCE(SUM(oi.quantity), 0) as items_sold,
                   COALESCE(SUM(oi.quantity * oi.price), 0) as total_revenue
            FROM category c
            LEFT JOIN product p ON c.category_id = p.category_id
            LEFT JOIN order_item oi ON p.product_id = oi.product_id
            GROUP BY c.category_id, c.name
            ORDER BY total_revenue DESC
            """;
        return jdbcTemplate.queryForList(sql);
    }

    // Top customers by spending
    @GetMapping("/top-customers")
    public List<Map<String, Object>> getTopCustomers() {
        System.out.println("GET /api/reports/top-customers called");
        String sql = """
            SELECT c.customer_id, c.full_name, c.email,
                   COUNT(o.order_id) as total_orders,
                   COALESCE(SUM(o.total), 0) as total_spent,
                   ROUND(COALESCE(AVG(o.total), 0)::numeric, 2) as avg_order_value,
                   MAX(o.created_at) as last_order_date
            FROM customer c
            LEFT JOIN orders o ON c.customer_id = o.customer_id
            GROUP BY c.customer_id, c.full_name, c.email
            ORDER BY total_spent DESC
            LIMIT 10
            """;
        return jdbcTemplate.queryForList(sql);
    }

    // Customer lifetime value
    @GetMapping("/customer-lifetime-value")
    public List<Map<String, Object>> getCustomerLifetimeValue() {
        System.out.println("GET /api/reports/customer-lifetime-value called");
        String sql = """
            SELECT c.customer_id, c.full_name, c.email,
                   COUNT(DISTINCT o.order_id) as total_orders,
                   COUNT(DISTINCT b.booking_id) as total_bookings,
                   COALESCE(SUM(DISTINCT o.total), 0) as order_revenue,
                   COALESCE(SUM(DISTINCT s.price), 0) as service_revenue,
                   COALESCE(SUM(DISTINCT o.total), 0) + COALESCE(SUM(DISTINCT s.price), 0) as lifetime_value
            FROM customer c
            LEFT JOIN orders o ON c.customer_id = o.customer_id
            LEFT JOIN booking b ON c.customer_id = b.customer_id
            LEFT JOIN service s ON b.service_type = s.name
            GROUP BY c.customer_id, c.full_name, c.email
            ORDER BY lifetime_value DESC
            """;
        return jdbcTemplate.queryForList(sql);
    }

    // Low stock products
    @GetMapping("/low-stock")
    public List<Map<String, Object>> getLowStockProducts() {
        System.out.println("GET /api/reports/low-stock called");
        String sql = """
            SELECT p.product_id, p.name, p.stock_quantity, 
                   c.name as category_name, v.name as vendor_name
            FROM product p
            LEFT JOIN category c ON p.category_id = c.category_id
            LEFT JOIN vendor v ON p.vendor_id = v.vendor_id
            WHERE p.stock_quantity < 10
            ORDER BY p.stock_quantity ASC
            """;
        return jdbcTemplate.queryForList(sql);
    }

    // Inventory value report
    @GetMapping("/inventory-value")
    public List<Map<String, Object>> getInventoryValue() {
        System.out.println("GET /api/reports/inventory-value called");
        String sql = """
            SELECT c.name as category_name,
                   COUNT(p.product_id) as product_count,
                   COALESCE(SUM(p.stock_quantity), 0) as total_units,
                   COALESCE(SUM(p.stock_quantity * p.price), 0) as inventory_value
            FROM category c
            LEFT JOIN product p ON c.category_id = p.category_id
            GROUP BY c.category_id, c.name
            ORDER BY inventory_value DESC
            """;
        return jdbcTemplate.queryForList(sql);
    }

    // Bookings by service type
    @GetMapping("/bookings-by-service")
    public List<Map<String, Object>> getBookingsByService() {
        System.out.println("GET /api/reports/bookings-by-service called");
        String sql = """
            SELECT b.service_type,
                   COUNT(b.booking_id) as total_bookings,
                   s.price,
                   COUNT(b.booking_id) * COALESCE(s.price, 0) as total_revenue
            FROM booking b
            LEFT JOIN service s ON b.service_type = s.name
            GROUP BY b.service_type, s.price
            ORDER BY total_bookings DESC
            """;
        return jdbcTemplate.queryForList(sql);
    }

    // Employee performance
    @GetMapping("/employee-performance")
    public List<Map<String, Object>> getEmployeePerformance() {
        System.out.println("GET /api/reports/employee-performance called");
        String sql = """
            SELECT e.employee_id, e.name as employee_name, e.email,
                   COUNT(DISTINCT o.order_id) as orders_processed,
                   COALESCE(SUM(o.total), 0) as sales_amount
            FROM employee e
            LEFT JOIN orders o ON e.employee_id = o.employee_id
            GROUP BY e.employee_id, e.name, e.email
            ORDER BY sales_amount DESC
            """;
        return jdbcTemplate.queryForList(sql);
    }

    // Pets by species
    @GetMapping("/pets-by-species")
    public List<Map<String, Object>> getPetsBySpecies() {
        System.out.println("GET /api/reports/pets-by-species called");
        String sql = """
            SELECT species, 
                   COUNT(*) as count,
                   ROUND(AVG(age)::numeric, 1) as avg_age
            FROM pet
            GROUP BY species
            ORDER BY count DESC
            """;
        return jdbcTemplate.queryForList(sql);
    }

    // Recent activity summary
    @GetMapping("/recent-activity")
    public Map<String, Object> getRecentActivity() {
        System.out.println("GET /api/reports/recent-activity called");
        String sql = """
            SELECT
                (SELECT COUNT(*) FROM orders WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as orders_last_week,
                (SELECT COUNT(*) FROM booking WHERE date >= CURRENT_DATE - INTERVAL '7 days') as bookings_last_week,
                (SELECT COUNT(*) FROM customer WHERE customer_id IN (
                    SELECT DISTINCT customer_id FROM orders WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
                )) as active_customers_last_month,
                (SELECT COALESCE(SUM(total), 0) FROM orders WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as revenue_last_week
            """;
        return jdbcTemplate.queryForMap(sql);
    }

    // Sales trend (last 30 days)
    @GetMapping("/sales-trend")
    public List<Map<String, Object>> getSalesTrend() {
        System.out.println("GET /api/reports/sales-trend called");
        String sql = """
            SELECT DATE(created_at) as date,
                   COUNT(*) as orders,
                   COALESCE(SUM(total), 0) as revenue
            FROM orders
            WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
            GROUP BY DATE(created_at)
            ORDER BY date ASC
            """;
        return jdbcTemplate.queryForList(sql);
    }

    // Payment methods distribution
    @GetMapping("/payment-methods")
    public List<Map<String, Object>> getPaymentMethodsDistribution() {
        System.out.println("GET /api/reports/payment-methods called");
        String sql = """
            SELECT payment_method,
                   COUNT(*) as count,
                   COALESCE(SUM(total), 0) as total_amount,
                   ROUND((COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM orders), 0))::numeric, 2) as percentage
            FROM orders
            WHERE payment_method IS NOT NULL
            GROUP BY payment_method
            ORDER BY count DESC
            """;
        return jdbcTemplate.queryForList(sql);
    }

    // Product performance
    @GetMapping("/product-performance")
    public List<Map<String, Object>> getProductPerformance() {
        System.out.println("GET /api/reports/product-performance called");
        String sql = """
            SELECT p.product_id, p.name, p.category, p.price, p.stock_quantity,
                   COALESCE(SUM(oi.quantity), 0) as units_sold,
                   COALESCE(SUM(oi.quantity * oi.price), 0) as revenue,
                   CASE WHEN p.stock_quantity < 10 THEN 'Low Stock'
                        WHEN p.stock_quantity < 50 THEN 'Medium Stock'
                        ELSE 'Well Stocked' END as stock_status
            FROM product p
            LEFT JOIN order_item oi ON p.product_id = oi.product_id
            GROUP BY p.product_id, p.name, p.category, p.price, p.stock_quantity
            ORDER BY revenue DESC
            """;
        return jdbcTemplate.queryForList(sql);
    }

    // Booking calendar (upcoming bookings)
    @GetMapping("/upcoming-bookings")
    public List<Map<String, Object>> getUpcomingBookings() {
        System.out.println("GET /api/reports/upcoming-bookings called");
        String sql = """
            SELECT b.booking_id, b.date, b.service_type,
                   c.full_name as customer_name, c.phone as customer_phone,
                   p.name as pet_name, p.species as pet_species
            FROM booking b
            JOIN customer c ON b.customer_id = c.customer_id
            JOIN pet p ON b.pet_id = p.pet_id
            WHERE b.date >= CURRENT_DATE
            ORDER BY b.date ASC
            LIMIT 20
            """;
        return jdbcTemplate.queryForList(sql);
    }

    // Vendor performance
    @GetMapping("/vendor-performance")
    public List<Map<String, Object>> getVendorPerformance() {
        System.out.println("GET /api/reports/vendor-performance called");
        String sql = """
            SELECT v.vendor_id, v.name as vendor_name, v.contact_person,
                   COUNT(DISTINCT p.product_id) as products_supplied,
                   COALESCE(SUM(p.stock_quantity), 0) as total_stock,
                   COALESCE(SUM(oi.quantity), 0) as units_sold,
                   COALESCE(SUM(oi.quantity * oi.price), 0) as revenue_generated
            FROM vendor v
            LEFT JOIN product p ON v.vendor_id = p.vendor_id
            LEFT JOIN order_item oi ON p.product_id = oi.product_id
            GROUP BY v.vendor_id, v.name, v.contact_person
            ORDER BY revenue_generated DESC
            """;
        return jdbcTemplate.queryForList(sql);
    }
}