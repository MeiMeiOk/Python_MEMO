import { useState, useCallback } from 'react';
import { cartService } from '../services/cartService';

const CART_STORAGE_KEY = 'cart_id';

const carritoVacio = { items: [], total: 0, itemCount: 0 };

export function useCart() {
  const [cartId, setCartId] = useState(() => localStorage.getItem(CART_STORAGE_KEY));
  const [carrito, setCarrito] = useState(carritoVacio);
  const [cargandoCarrito, setCargandoCarrito] = useState(false);

  const ensureCart = useCallback(async () => {
    if (cartId) {
      return cartId;
    }

    const data = await cartService.createCart();
    localStorage.setItem(CART_STORAGE_KEY, data.cartId);
    setCartId(data.cartId);
    setCarrito(data);
    return data.cartId;
  }, [cartId]);

  const agregarProducto = useCallback(async (productId, quantity = 1) => {
    const id = await ensureCart();
    const data = await cartService.addItem(id, productId, quantity);
    setCarrito(data);
    return data;
  }, [ensureCart]);

  const actualizarCantidad = useCallback(async (productId, quantity) => {
    if (!cartId || quantity < 1) return carrito;

    const data = await cartService.updateItem(cartId, productId, quantity);
    setCarrito(data);
    return data;
  }, [cartId, carrito]);

  const eliminarProducto = useCallback(async (productId) => {
    if (!cartId) return carrito;

    const data = await cartService.removeItem(cartId, productId);
    setCarrito(data);
    return data;
  }, [cartId, carrito]);

  const vaciarCarrito = useCallback(async () => {
    if (!cartId) {
      setCarrito(carritoVacio);
      return carritoVacio;
    }

    const data = await cartService.clearCart(cartId);
    setCarrito(data);
    return data;
  }, [cartId]);

  const cargarCarrito = useCallback(async () => {
    if (!cartId) {
      setCarrito(carritoVacio);
      return carritoVacio;
    }

    setCargandoCarrito(true);
    try {
      const data = await cartService.getCart(cartId);
      setCarrito(data);
      return data;
    } catch {
      localStorage.removeItem(CART_STORAGE_KEY);
      setCartId(null);
      setCarrito(carritoVacio);
      return carritoVacio;
    } finally {
      setCargandoCarrito(false);
    }
  }, [cartId]);

  return {
    carrito,
    cargandoCarrito,
    agregarProducto,
    actualizarCantidad,
    eliminarProducto,
    vaciarCarrito,
    cargarCarrito,
  };
}
