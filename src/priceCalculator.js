// Delivery charges calculation with Pakistani Rupees
const DELIVERY_CHARGES = {
  karachi: 250,
  lahore: 250,
  islamabad: 350,
  peshawar: 350,
  quetta: 400,
  other: 500,
};

const CITIES = Object.keys(DELIVERY_CHARGES).map(city => city.charAt(0).toUpperCase() + city.slice(1));

export { DELIVERY_CHARGES, CITIES };

export const getDeliveryCharge = (city) => {
  const normalizedCity = city.toLowerCase().trim();
  return DELIVERY_CHARGES[normalizedCity] || DELIVERY_CHARGES.other;
};

export const calculateTotal = (subtotal, deliveryCharge) => {
  return subtotal + deliveryCharge;
};

export const formatPrice = (price) => {
  return `Rs. ${price.toLocaleString('en-PK')}`;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getPriceBreakdown = (cart, deliveryCharge = 0) => {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const total = subtotal + deliveryCharge;
  
  return {
    subtotal,
    deliveryCharge,
    total,
  };
};
