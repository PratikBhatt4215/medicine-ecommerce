package com.medstore.controller;

import com.medstore.constants.ResponseCodes;
import com.medstore.dto.ApiResponse;
import com.medstore.dto.OrderRequest;
import com.medstore.model.Order;
import com.medstore.service.MessageResolver;
import com.medstore.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {
    
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);
    
    @Autowired
    private OrderService orderService;

    @Autowired
    private MessageResolver messageResolver;

    private String getMessage(String code) {
        return messageResolver.getMessage(code);
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Order>>> getUserOrders(Authentication authentication) {
        String email = authentication.getName();
        logger.info("Fetching orders for user: {}", email);
        List<Order> orders = orderService.getUserOrders(email);
        logger.info("Fetched {} orders for user", orders.size());
        return ResponseEntity.ok(ApiResponse.success(orders, getMessage(ResponseCodes.ORDERS_RETRIEVED)));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Order>> getOrderById(@PathVariable Long id) {
        logger.info("Fetching order by ID: {}", id);
        Order order = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.success(order, getMessage(ResponseCodes.ORDER_RETRIEVED)));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Order>> createOrder(@RequestBody OrderRequest request, Authentication authentication) {
        String email = authentication.getName();
        logger.info("[AUDIT] User '{}' placing a new order.", email);
        Order order = orderService.createOrder(email, request);
        logger.info("Order placed successfully with ID: {}", order.getId());
        return ResponseEntity.ok(ApiResponse.success(order, getMessage(ResponseCodes.ORDER_CREATED)));
    }
    
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
        logger.info("Admin fetching all orders");
        List<Order> orders = orderService.getAllOrders();
        logger.info("Fetched {} total orders", orders.size());
        return ResponseEntity.ok(ApiResponse.success(orders, getMessage(ResponseCodes.ORDERS_RETRIEVED)));
    }
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Order.OrderStatus status = Order.OrderStatus.valueOf(body.get("status"));
        logger.info("Admin updating order {} status to {}", id, status);
        Order updatedOrder = orderService.updateOrderStatus(id, status);
        logger.info("Order status updated successfully");
        return ResponseEntity.ok(ApiResponse.success(updatedOrder, getMessage(ResponseCodes.ORDER_UPDATED)));
    }
}
