import { useState } from 'react';
import { ArrowLeft, Loader2, Info } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import { getDeliveryCharge, formatPrice, CITIES } from '../priceCalculator';
import { saveOrder } from '../orderStorage';

const CheckoutView = ({ cart, setCart, navigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Karachi',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const deliveryCharge = getDeliveryCharge(formData.city);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const total = subtotal + deliveryCharge;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Please enter your phone number');
      return false;
    }
    if (!formData.address.trim()) {
      setError('Please enter your delivery address');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const order = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
        },
        items: cart,
        subtotal,
        deliveryCharge,
        total,
        paymentMethod: 'Cash on Delivery',
        status: 'pending',
      };

      const savedOrder = saveOrder(order);
      if (savedOrder) {
        // Navigate to confirmation with order ID
        localStorage.setItem('lastOrderId', savedOrder.id);
        navigate('confirmation');
        setCart([]); // Clear cart
      }
    } catch (err) {
      setError('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <FadeIn>
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">No Items in Cart</h2>
            <p className="text-white/70 mb-8">Please add items before checkout</p>
            <button
              onClick={() => navigate('shirts')}
              className="glass-button px-8 py-4 rounded-full font-bold text-lg"
            >
              Back to Shopping
            </button>
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full max-w-6xl mx-auto">
      <FadeIn>
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('cart')}
            className="glass-button p-3 rounded-full hover:bg-white/20"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-4xl font-bold">Checkout</h1>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          <FadeIn>
            <div className="glass-panel rounded-3xl p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6">Delivery Information</h2>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 mb-6 text-red-200 flex gap-3">
                  <Info size={20} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:border-teal-400 transition"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:border-teal-400 transition"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Phone Number (Pakistan) *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+92-3XX-XXXXXXX"
                    className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:border-teal-400 transition"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-semibold mb-2">City (Delivery Zone) *</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:border-teal-400 transition"
                  >
                    {CITIES.map(city => (
                      <option key={city} value={city} className="bg-slate-900">
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Delivery Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your complete address including street, area, and postal code"
                    rows="4"
                    className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:border-teal-400 transition resize-none"
                  />
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Payment Method */}
          <FadeIn delay={100}>
            <div className="glass-panel rounded-3xl p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 bg-teal-500/10 border border-teal-500/30 rounded-2xl">
                  <div className="w-5 h-5 rounded-full border-2 border-teal-400 bg-teal-500/20 flex items-center justify-center shrink-0">
                    <div className="w-2.5 h-2.5 bg-teal-400 rounded-full" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Cash on Delivery (COD)</h3>
                    <p className="text-white/70 text-sm">Pay when your order arrives</p>
                  </div>
                </div>
                <p className="text-white/60 text-sm ml-9">
                  Our delivery partner will collect payment upon delivery. Please have the exact amount ready.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Order Summary */}
        <FadeIn delay={200} className="lg:col-span-1">
          <div className="glass-panel rounded-3xl p-6 sticky top-24 space-y-4">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            {/* Items List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-white/70">
                    {item.name} <span className="text-white/50">×{item.quantity || 1}</span>
                  </span>
                  <span>Rs. {(item.price * (item.quantity || 1)).toLocaleString('en-PK')}</span>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 border-t border-b border-white/20 py-4">
              <div className="flex justify-between">
                <span className="text-white/70">Subtotal</span>
                <span>Rs. {subtotal.toLocaleString('en-PK')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Delivery ({formData.city})</span>
                <span className="text-teal-300 font-semibold">Rs. {deliveryCharge.toLocaleString('en-PK')}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-4">
              <span className="text-xl font-bold">Total</span>
              <span className="text-2xl font-bold text-teal-300">
                Rs. {total.toLocaleString('en-PK')}
              </span>
            </div>

            {/* Delivery Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-3 text-xs text-blue-200">
              <strong>Note:</strong> Standard delivery takes 2-3 working days from Karachi, Lahore, Islamabad. Remote areas may take 5-7 days.
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full glass-button bg-teal-500/20 hover:bg-teal-500/40 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-2xl font-bold text-lg border-teal-300/50 transition flex items-center justify-center gap-2 mt-6"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Processing...
                </>
              ) : (
                'Place Order (COD)'
              )}
            </button>

            <button
              onClick={() => navigate('cart')}
              className="w-full glass-panel py-3 rounded-2xl font-bold hover:bg-white/10 transition"
            >
              Back to Cart
            </button>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default CheckoutView;
