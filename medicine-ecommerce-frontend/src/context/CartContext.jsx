import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const { isAuthenticated } = useAuth();

  const refreshCart = async () => {
    try {
      const cart = await cartService.getCart();
      setCartCount(cart.length);
      return cart;
    } catch (error) {
      console.error('Error loading cart:', error);
      return [];
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setCartCount(0);
    }
  }, [isAuthenticated]);

  const addToCart = async (medicineId, quantity) => {
    try {
      await cartService.addToCart(medicineId, quantity);
      await refreshCart(); // Update count immediately
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (id) => {
    try {
      await cartService.removeFromCart(id);
      await refreshCart();
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (id, quantity) => {
    try {
      await cartService.updateCartItem(id, quantity);
      await refreshCart();
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCartCount(0);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const value = {
    cartCount,
    refreshCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
