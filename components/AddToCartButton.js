"use client"; // Required in Next.js if using hooks like useState or useContext

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Next.js router
import { CartContext } from "../context/CartContext";
import styled from "styled-components";

const AddToCartButton = ({ product, selectedVariation }) => {
  const { cart, addToCart } = useContext(CartContext);
  const router = useRouter(); // Next.js router

  const [cartItem, setCartItem] = useState(null);

  // Find if the product/variation is already in the cart
  useEffect(() => {
    const foundItem = product.isVariable
      ? cart.find(
          (item) =>
            item.product._id === product._id &&
            item.selectedVariation?.size === selectedVariation?.size
        )
      : cart.find((item) => item.product._id === product._id);

    setCartItem(foundItem);
  }, [cart, product, selectedVariation]);

  // Add the product to the cart
  const handleAddToCart = () => {
    if (product.isVariable && !selectedVariation) {
      alert("Please select a variation before adding to the cart.");
      return;
    }
    addToCart(product, selectedVariation);
  };

  // Navigation handlers using Next.js router
  const goToCart = () => router.push("/cart");
  const goToCheckout = () => router.push("/checkout");

  return (
    <AddToCartContainer>
      {cartItem ? (
        <>
          <p>
            <strong>{cartItem.quantity}</strong> in cart
          </p>
          <Actions>
            <Button className="btn-cart" onClick={goToCart}>
              Go to Cart
            </Button>
            <Button className="btn-checkout" onClick={goToCheckout}>
              Checkout
            </Button>
          </Actions>
        </>
      ) : (
        <Button className="btn-add" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      )}
    </AddToCartContainer>
  );
};

export default AddToCartButton;

// Styled Components (move outside the component function)
const AddToCartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &.btn-cart {
    background-color: #4caf50;
    color: white;
  }

  &.btn-checkout {
    background-color: #ff9800;
    color: white;
  }

  &.btn-add {
    background-color: #007bff;
    color: white;
  }
`;
