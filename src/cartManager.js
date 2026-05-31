// Cart management utilities
export const addToCart = (cart, item) => {
  const existingItem = cart.find(cartItem => cartItem.id === item.id);
  
  if (existingItem) {
    return cart.map(cartItem =>
      cartItem.id === item.id
        ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
        : cartItem
    );
  }
  
  return [...cart, { ...item, quantity: 1 }];
};

export const removeFromCart = (cart, itemId) => {
  return cart.filter(item => item.id !== itemId);
};

export const updateCartItemQuantity = (cart, itemId, quantity) => {
  if (quantity <= 0) {
    return removeFromCart(cart, itemId);
  }
  
  return cart.map(item =>
    item.id === itemId
      ? { ...item, quantity }
      : item
  );
};

export const getCartTotal = (cart) => {
  return cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
};

export const getCartItemCount = (cart) => {
  return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
};

export const clearCart = () => {
  return [];
};

export const saveCartToLocalStorage = (cart) => {
  try {
    localStorage.setItem('glass_apparel_cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

export const loadCartFromLocalStorage = () => {
  try {
    const cart = localStorage.getItem('glass_apparel_cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    return [];
  }
};
