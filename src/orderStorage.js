// Order storage in localStorage

export const generateOrderId = () => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
};

export const saveOrder = (order) => {
  try {
    const orders = getOrders();
    const orderWithId = {
      ...order,
      id: generateOrderId(),
      createdAt: new Date().toISOString(),
    };
    orders.push(orderWithId);
    localStorage.setItem('glass_apparel_orders', JSON.stringify(orders));
    return orderWithId;
  } catch (error) {
    console.error('Failed to save order:', error);
    return null;
  }
};

export const getOrders = () => {
  try {
    const orders = localStorage.getItem('glass_apparel_orders');
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error('Failed to load orders:', error);
    return [];
  }
};

export const getOrderById = (orderId) => {
  try {
    const orders = getOrders();
    return orders.find(order => order.id === orderId);
  } catch (error) {
    console.error('Failed to get order:', error);
    return null;
  }
};

export const getCustomerOrders = (email) => {
  try {
    const orders = getOrders();
    return orders.filter(order => order.customer.email === email);
  } catch (error) {
    console.error('Failed to get customer orders:', error);
    return [];
  }
};
