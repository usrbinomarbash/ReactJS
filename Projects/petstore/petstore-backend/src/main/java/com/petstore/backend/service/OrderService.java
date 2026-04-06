package com.petstore.backend.service;

import com.petstore.backend.exception.ResourceNotFoundException;
import com.petstore.backend.model.Order;
import com.petstore.backend.model.OrderItem;
import com.petstore.backend.repository.OrderRepository;
import com.petstore.backend.repository.OrderItemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);
    
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    public OrderService(OrderRepository orderRepository, OrderItemRepository orderItemRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    public List<Order> getAllOrders() {
        log.debug("Fetching all orders");
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        log.debug("Fetching order with ID: {}", id);
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
    }

    public List<Order> getOrdersByCustomerId(Long customerId) {
        log.debug("Fetching orders for customer ID: {}", customerId);
        return orderRepository.findByCustomerId(customerId);
    }

    public Order createOrder(Order order) {
        log.info("Creating new order for customer ID: {}", order.getCustomerId());
        Order savedOrder = orderRepository.save(order);
        log.info("Order created with ID: {}", savedOrder.getOrderId());
        return savedOrder;
    }

    public Order updateOrder(Long id, Order updatedOrder) {
        log.info("Updating order with ID: {}", id);
        
        Order existing = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
        
        existing.setCustomerId(updatedOrder.getCustomerId());
        existing.setEmployeeId(updatedOrder.getEmployeeId());
        existing.setPaymentMethod(updatedOrder.getPaymentMethod());
        existing.setTotal(updatedOrder.getTotal());
        
        Order saved = orderRepository.save(existing);
        log.info("Order updated successfully");
        return saved;
    }

    public void deleteOrder(Long id) {
        log.info("Deleting order with ID: {}", id);
        
        if (!orderRepository.existsById(id)) {
            throw new ResourceNotFoundException("Order", "id", id);
        }
        
        List<OrderItem> items = orderItemRepository.findByOrderId(id);
        orderItemRepository.deleteAll(items);
        
        orderRepository.deleteById(id);
        log.info("Order deleted successfully");
    }

    public List<OrderItem> getOrderItems(Long orderId) {
        log.debug("Fetching order items for order ID: {}", orderId);
        return orderItemRepository.findByOrderId(orderId);
    }

    public OrderItem addOrderItem(OrderItem orderItem) {
        log.info("Adding item to order ID: {}", orderItem.getOrderId());
        OrderItem saved = orderItemRepository.save(orderItem);
        log.info("Order item added successfully");
        return saved;
    }

    public void removeOrderItem(Long orderId, Long productId) {
        log.info("Removing product {} from order {}", productId, orderId);
        orderItemRepository.deleteById(new com.petstore.backend.model.OrderItemId(orderId, productId));
        log.info("Order item removed successfully");
    }
}