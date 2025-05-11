import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface CartItem {
  id: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (mealId: string) => void;
  removeFromCart: (mealId: string) => void;
  isInCart: (mealId: string) => boolean;
  clearCart: () => void;
  updateQuantity: (mealId: string, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('cart').then(data => {
      if (data) setCartItems(JSON.parse(data));
    });
  }, []);

  const saveCart = async (items: CartItem[]) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  };

  const addToCart = (mealId: string) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === mealId);
      if (existingItem) {
        // If item exists, just increase the quantity
        const newCart = prev.map(item =>
          item.id === mealId ? { ...item, quantity: item.quantity + 1 } : item
        );
        saveCart(newCart);
        return newCart;
      }
      // If item doesn't exist, add it to the cart
      const newCart = [...prev, { id: mealId, quantity: 1 }];
      saveCart(newCart);
      return newCart;
    });
  };

  const updateQuantity = (mealId: string, quantity: number) => {
    setCartItems(prev => {
      const newCart = prev.map(item => (item.id === mealId ? { ...item, quantity } : item));
      saveCart(newCart);
      return newCart;
    });
  };

  const removeFromCart = (mealId: string) => {
    setCartItems(prev => {
      const newCart = prev.filter(item => item.id !== mealId);
      saveCart(newCart);
      return newCart;
    });
  };

  const isInCart = (mealId: string) => cartItems.some(item => item.id === mealId);

  const clearCart = () => {
    setCartItems([]);
    AsyncStorage.removeItem('cart').catch(e => console.error('Failed to clear cart', e));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, isInCart, clearCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
