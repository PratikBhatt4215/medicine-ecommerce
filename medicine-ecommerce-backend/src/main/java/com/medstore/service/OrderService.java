package com.medstore.service;

import com.medstore.constants.ResponseCodes;
import com.medstore.dto.OrderRequest;
import com.medstore.exception.BusinessException;
import com.medstore.exception.ResourceNotFoundException;
import com.medstore.model.*;
import com.medstore.repository.CartRepository;
import com.medstore.repository.OrderRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private UserService userService;
    
    @Transactional
    public Order createOrder(String email, OrderRequest request) {
        User user = userService.getUserByEmail(email);
        List<Cart> cartItems = cartRepository.findByUserId(user.getId());
        
        if (cartItems.isEmpty()) {
            throw new BusinessException(ResponseCodes.ORDER_CART_EMPTY);
        }
        
        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(request.getShippingAddress());
        order.setPaymentId(request.getPaymentId());
        order.setStatus(Order.OrderStatus.PENDING);
        
        BigDecimal totalAmount = BigDecimal.ZERO;
        
        for (Cart cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setMedicine(cartItem.getMedicine());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getMedicine().getPrice());
            
            order.getOrderItems().add(orderItem);
            
            BigDecimal itemTotal = cartItem.getMedicine().getPrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
        }
        
        order.setTotalAmount(totalAmount);
        order = orderRepository.save(order);
        
        // Clear cart after order
        cartRepository.deleteByUserId(user.getId());
        
        return order;
    }
    
    public List<Order> getUserOrders(String email) {
        User user = userService.getUserByEmail(email);
        return orderRepository.findByUserIdOrderByOrderDateDesc(user.getId());
    }
    
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ResponseCodes.ORDER_NOT_FOUND));
    }
    
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }
    
    public Order updateOrderStatus(Long id, Order.OrderStatus status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
