import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import CartPage from '../react-pages/CartPage';

export default function Cart() {
  const { cart } = useContext(CartContext);
  return <CartPage cart={cart} />;
}
