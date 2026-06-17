import { apiFetch } from '../config/api.js';
import { demoProducts } from '../data/demoProducts.js';

const LOCAL_CART_KEY = 'demo_cart';

function readLocalCart() {
  const saved = localStorage.getItem(LOCAL_CART_KEY);
  if (!saved) {
    return { cartId: 'demo-cart', items: [] };
  }

  try {
    return JSON.parse(saved);
  } catch {
    return { cartId: 'demo-cart', items: [] };
  }
}

function saveLocalCart(cart) {
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
  return formatLocalCart(cart);
}

function formatLocalCart(cart) {
  const items = cart.items || [];
  return {
    cartId: cart.cartId || 'demo-cart',
    items,
    total: items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    itemCount: items.reduce((acc, item) => acc + item.quantity, 0),
  };
}

function createLocalCart() {
  return saveLocalCart({ cartId: 'demo-cart', items: [] });
}

function getLocalCart() {
  return formatLocalCart(readLocalCart());
}

function addLocalItem(productId, quantity = 1) {
  const cart = readLocalCart();
  const product = demoProducts.find((item) => item.id === Number(productId));

  if (!product) {
    throw new Error('Producto demo no encontrado.');
  }

  const existing = cart.items.find((item) => item.productId === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({
      productId: product.id,
      title: product.title,
      description: product.description,
      image: product.image,
      price: product.price,
      quantity,
    });
  }

  return saveLocalCart(cart);
}

function updateLocalItem(productId, quantity) {
  const cart = readLocalCart();
  const item = cart.items.find((current) => current.productId === Number(productId));

  if (item) {
    item.quantity = quantity;
  }

  return saveLocalCart(cart);
}

function removeLocalItem(productId) {
  const cart = readLocalCart();
  cart.items = cart.items.filter((item) => item.productId !== Number(productId));
  return saveLocalCart(cart);
}

function clearLocalCart() {
  return saveLocalCart({ cartId: 'demo-cart', items: [] });
}

export const cartService = {
  createCart: async () => {
    try {
      return await apiFetch('/carrito', { method: 'POST' });
    } catch {
      return createLocalCart();
    }
  },

  getCart: async (cartId) => {
    try {
      return await apiFetch(`/carrito/${cartId}`);
    } catch {
      return getLocalCart();
    }
  },

  addItem: async (cartId, productId, quantity = 1) => {
    try {
      return await apiFetch(`/carrito/${cartId}/items`, {
        method: 'POST',
        body: JSON.stringify({ productId, quantity }),
      });
    } catch {
      return addLocalItem(productId, quantity);
    }
  },

  updateItem: async (cartId, productId, quantity) => {
    try {
      return await apiFetch(`/carrito/${cartId}/items/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      });
    } catch {
      return updateLocalItem(productId, quantity);
    }
  },

  removeItem: async (cartId, productId) => {
    try {
      return await apiFetch(`/carrito/${cartId}/items/${productId}`, {
        method: 'DELETE',
      });
    } catch {
      return removeLocalItem(productId);
    }
  },

  clearCart: async (cartId) => {
    try {
      return await apiFetch(`/carrito/${cartId}`, {
        method: 'DELETE',
      });
    } catch {
      return clearLocalCart();
    }
  },
};
