import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Add to cart with dynamic variation validation
  const addToCart = (product, selectedVariation = null) => {
    if (!product) {
      console.error("Product data is missing.");
      return;
    }

    // Validate variation for variable products
    if (product.isVariable && !selectedVariation) {
      console.error("Invalid or missing variation for this variable product.");
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) =>
          item.product._id === product._id &&
          (!selectedVariation || item.selectedVariation?.size === selectedVariation.size)
      );

      if (existingItem) {
        // Increase quantity if the item already exists in the cart
        return prevCart.map((item) =>
          item.product._id === product._id &&
          (!selectedVariation || item.selectedVariation?.size === selectedVariation.size)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Add new item to the cart
      return [
        ...prevCart,
        {
          product,
          quantity: 1,
          selectedVariation: selectedVariation || null,
        },
      ];
    });
  };

  // Remove item from cart with variation support
  const removeFromCart = (productId, variation = null) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          item.product._id !== productId ||
          (variation && item.selectedVariation?._id !== variation._id)
      )
    );
  };

  // Update item quantity with variation support
  const updateQuantity = (productId, variation = null, amount) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (
          item.product._id === productId &&
          (!variation || item.selectedVariation?._id === variation._id)
        ) {
          return { ...item, quantity: Math.max(item.quantity + amount, 1) }; // Ensure quantity is at least 1
        }
        return item;
      })
    );
  };

  // Clear the entire cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart'); // Optional: clear local storage if using it
  };

  // Recalculate total amount whenever the cart changes
  useEffect(() => {
    const amount = cart.reduce(
      (sum, item) =>
        sum +
        ((item.selectedVariation?.price ?? item.product.price ?? 0) *
          item.quantity),
      0
    );
    setTotalAmount(amount);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
