import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { addToCart, getUserCart, type CartResponse } from '../../../apis/Cart/cart';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
}

interface CartContextType {
  cart: CartResponse | null;
  loading: boolean;
  error: string;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  refreshCart: () => Promise<void>;
  cartCount: number;
  clearError: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user's cart
  const fetchCart = async () => {
    try {
      setLoading(true);
      setError('');
      const cartData = await getUserCart();
      setCart(cartData);
    } catch (err: any) {
      if (err.message === "SESSION_EXPIRED") {
        setError("Your session has expired. Please login again.");
      } else if (err.message.includes("User ID not found")) {
        setError("Please login to access your cart");
      } else {
        setError(err.message || "Failed to load cart");
      }
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart - Enhanced version with product details
  const handleAddToCart = async (product: Product, quantity: number = 1) => {
    try {
      // Create payload that matches your backend API requirements
      const payload = {
        productId: product._id,
        productName: product.name,
        price: product.price,
        quantity: quantity,
        imageUrl: product.image || "" // Use actual product image if available
      };
      
      const updatedCart = await addToCart(payload);
      setCart(updatedCart);
      setError('');
    } catch (err: any) {
      if (err.message === "SESSION_EXPIRED") {
        setError("Your session has expired. Please login again.");
      } else {
        setError(err.message || "Failed to add item to cart");
      }
      throw err;
    }
  };

  const clearError = () => setError('');

  // Safe cart count calculation
  const cartCount = cart?.items?.reduce((total, item) => total + (item.quantity || 0), 0) || 0;

  useEffect(() => {
    fetchCart();
  }, []);

  const value: CartContextType = {
    cart,
    loading,
    error,
    addToCart: handleAddToCart,
    refreshCart: fetchCart,
    cartCount,
    clearError,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};