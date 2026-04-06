package com.petstore.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class DashboardController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // GET complete dashboard data in one call
    @GetMapping
    public Map<String, Object> getDashboardData() {
        System.out.println("GET /api/dashboard called");
        
        Map<String, Object> dashboard = new HashMap<>();
        
        // Summary stats
        dashboard.put("stats", getStats());
        
        // Recent orders
        dashboard.put("recentOrders", getRecentOrders());
        
        // Upcoming bookings
        dashboard.put("upcomingBookings", getUpcomingBookings());
        
        // Low stock alerts
        dashboard.put("lowStockAlerts", getLowStockAlerts());
        
        // Sales chart data (last 7 days)
        dashboard.put("salesChart", getSalesChartData());
        
        // Top products
        dashboard.put("topProducts", getTopProducts());
        
        // Pets by species
        dashboard.put("petsBySpecies", getPetsBySpecies());
        
        // Products by category
        dashboard.put("productsByCategory", getProductsByCategory());
        
        return dashboard;
    }

    // GET stats only
    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        System.out.println("GET /api/dashboard/stats called");
        return jdbcTemplate.queryForMap("""
            SELECT
                (SELECT COUNT(*) FROM customer) as total_customers,
                (SELECT COUNT(*) FROM pet) as total_pets,
                (SELECT COUNT(*) FROM product) as total_products,
                (SELECT COUNT(*) FROM booking) as total_bookings,
                (SELECT COUNT(*) FROM orders) as total_orders,
                (SELECT COALESCE(SUM(total), 0) FROM orders) as total_revenue,
                (SELECT COUNT(*) FROM product WHERE stock_quantity < 10) as low_stock_items,
                (SELECT COUNT(*) FROM employee) as total_employees
            """);
    }

    // GET recent orders
    @GetMapping("/recent-orders")
    public List<Map<String, Object>> getRecentOrders() {
        System.out.println("GET /api/dashboard/recent-orders called");
        return jdbcTemplate.queryForList("""
            SELECT o.order_id, o.created_at, o.total, o.payment_method,
                   c.full_name as customer_name
            FROM orders o
            LEFT JOIN customer c ON o.customer_id = c.customer_id
            ORDER BY o.created_at DESC
            LIMIT 5
            """);
    }

    // GET upcoming bookings
    @GetMapping("/upcoming-bookings")
    public List<Map<String, Object>> getUpcomingBookings() {
        System.out.println("GET /api/dashboard/upcoming-bookings called");
        return jdbcTemplate.queryForList("""
            SELECT b.booking_id, b.date, b.service_type,
                   c.full_name as customer_name,
                   p.name as pet_name
            FROM booking b
            JOIN customer c ON b.customer_id = c.customer_id
            JOIN pet p ON b.pet_id = p.pet_id
            WHERE b.date >= CURRENT_DATE
            ORDER BY b.date ASC
            LIMIT 5
            """);
    }

    // GET low stock alerts
    @GetMapping("/low-stock")
    public List<Map<String, Object>> getLowStockAlerts() {
        System.out.println("GET /api/dashboard/low-stock called");
        return jdbcTemplate.queryForList("""
            SELECT product_id, name, stock_quantity, category
            FROM product
            WHERE stock_quantity < 10
            ORDER BY stock_quantity ASC
            LIMIT 5
            """);
    }

    // GET sales chart data (last 7 days)
    @GetMapping("/sales-chart")
    public List<Map<String, Object>> getSalesChartData() {
        System.out.println("GET /api/dashboard/sales-chart called");
        return jdbcTemplate.queryForList("""
            SELECT DATE(created_at) as date,
                   COUNT(*) as orders,
                   COALESCE(SUM(total), 0) as revenue
            FROM orders
            WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
            GROUP BY DATE(created_at)
            ORDER BY date ASC
            """);
    }

    // GET top products
    @GetMapping("/top-products")
    public List<Map<String, Object>> getTopProducts() {
        System.out.println("GET /api/dashboard/top-products called");
        return jdbcTemplate.queryForList("""
            SELECT p.name, COALESCE(SUM(oi.quantity), 0) as sold
            FROM product p
            LEFT JOIN order_item oi ON p.product_id = oi.product_id
            GROUP BY p.product_id, p.name
            ORDER BY sold DESC
            LIMIT 5
            """);
    }

    // GET pets by species
    @GetMapping("/pets-by-species")
    public List<Map<String, Object>> getPetsBySpecies() {
        System.out.println("GET /api/dashboard/pets-by-species called");
        return jdbcTemplate.queryForList("""
            SELECT species as name, COUNT(*) as value
            FROM pet
            GROUP BY species
            ORDER BY value DESC
            """);
    }

    // GET products by category
    @GetMapping("/products-by-category")
    public List<Map<String, Object>> getProductsByCategory() {
        System.out.println("GET /api/dashboard/products-by-category called");
        return jdbcTemplate.queryForList("""
            SELECT c.name, COUNT(p.product_id) as value
            FROM category c
            LEFT JOIN product p ON c.category_id = p.category_id
            GROUP BY c.category_id, c.name
            ORDER BY value DESC
            """);
    }

    // GET orders per customer (for chart)
    @GetMapping("/orders-per-customer")
    public List<Map<String, Object>> getOrdersPerCustomer() {
        System.out.println("GET /api/dashboard/orders-per-customer called");
        return jdbcTemplate.queryForList("""
            SELECT c.full_name as name, COUNT(o.order_id) as orders
            FROM customer c
            LEFT JOIN orders o ON c.customer_id = o.customer_id
            GROUP BY c.customer_id, c.full_name
            HAVING COUNT(o.order_id) > 0
            ORDER BY orders DESC
            LIMIT 10
            """);
    }

    // GET revenue summary
    @GetMapping("/revenue-summary")
    public Map<String, Object> getRevenueSummary() {
        System.out.println("GET /api/dashboard/revenue-summary called");
        return jdbcTemplate.queryForMap("""
            SELECT
                COALESCE(SUM(CASE WHEN created_at >= CURRENT_DATE THEN total ELSE 0 END), 0) as today,
                COALESCE(SUM(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN total ELSE 0 END), 0) as this_week,
                COALESCE(SUM(CASE WHEN created_at >= DATE_TRUNC('month', CURRENT_DATE) THEN total ELSE 0 END), 0) as this_month,
                COALESCE(SUM(total), 0) as all_time
            FROM orders
            """);
    }

    // GET activity feed
    @GetMapping("/activity")
    public List<Map<String, Object>> getActivityFeed() {
        System.out.println("GET /api/dashboard/activity called");
        return jdbcTemplate.queryForList("""
            (SELECT 'order' as type, order_id as id, 
                    'New order #' || order_id as description,
                    created_at as timestamp
             FROM orders
             ORDER BY created_at DESC
             LIMIT 3)
            UNION ALL
            (SELECT 'booking' as type, booking_id as id,
                    'New booking for ' || service_type as description,
                    date::timestamp as timestamp
             FROM booking
             ORDER BY date DESC
             LIMIT 3)
            ORDER BY timestamp DESC
            LIMIT 10
            """);
    }
}