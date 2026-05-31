import { useEffect, useState } from 'react';
import { CheckCircle, Package, Truck, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import { getOrderById } from '../orderStorage';

const OrderConfirmationView = ({ navigate }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = localStorage.getItem('lastOrderId');
    if (orderId) {
      const savedOrder = getOrderById(orderId);
      setOrder(savedOrder);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="loader-bubble inline-block" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <FadeIn>
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Order Not Found</h2>
            <p className="text-white/70 mb-8">We couldn't find your order details</p>
            <button
              onClick={() => navigate('home')}
              className="glass-button px-8 py-4 rounded-full font-bold text-lg"
            >
              Back to Home
            </button>
          </div>
        </FadeIn>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto">
      {/* Success Message */}
      <FadeIn>
        <div className="text-center space-y-4 mb-12">
          <div className="flex justify-center">
            <CheckCircle size={80} className="text-teal-400 animate-bounce" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Order Confirmed!</h1>
          <p className="text-xl text-white/70">Thank you for your order</p>
        </div>
      </FadeIn>

      {/* Order ID Card */}
      <FadeIn delay={100}>
        <div className="glass-panel rounded-3xl p-6 md:p-8 text-center border-2 border-teal-400/30">
          <p className="text-white/70 text-sm mb-2">Order ID</p>
          <p className="text-3xl font-bold text-teal-300 tracking-wider">{order.id}</p>
          <p className="text-white/60 text-sm mt-3">Ordered on {orderDate}</p>
        </div>
      </FadeIn>

      {/* Status Timeline */}
      <FadeIn delay={150}>
        <div className="glass-panel rounded-3xl p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6">Delivery Status</h2>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="flex flex-col items-center">
                <CheckCircle size={32} className="text-teal-400 mb-2" />
                <div className="w-1 h-12 bg-gradient-to-b from-teal-400 to-blue-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Order Confirmed</h3>
                <p className="text-white/60">Your order has been received and confirmed</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex flex-col items-center">
                <Package size={32} className="text-blue-400 mb-2" />
                <div className="w-1 h-12 bg-gradient-to-b from-blue-400 to-blue-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Processing</h3>
                <p className="text-white/60">We're preparing your items for dispatch</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex flex-col items-center">
                <Truck size={32} className="text-blue-400 mb-2" />
              </div>
              <div>
                <h3 className="font-bold text-lg">In Transit</h3>
                <p className="text-white/60">Your order will be delivered soon</p>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Delivery Details */}
        <FadeIn delay={200}>
          <div className="glass-panel rounded-3xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6">Delivery Address</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin size={20} className="text-teal-300 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white/70 text-sm">Address</p>
                  <p className="font-semibold">{order.customer.address}</p>
                  <p className="text-teal-300 font-semibold">{order.customer.city}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Phone size={20} className="text-teal-300 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white/70 text-sm">Phone</p>
                  <p className="font-semibold">{order.customer.phone}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Mail size={20} className="text-teal-300 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white/70 text-sm">Email</p>
                  <p className="font-semibold">{order.customer.email}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 mt-6 text-sm text-blue-200">
              <strong>Estimated Delivery:</strong> 2-3 working days from Karachi, Lahore, Islamabad. Remote areas may take 5-7 days.
            </div>
          </div>
        </FadeIn>

        {/* Payment Details */}
        <FadeIn delay={250}>
          <div className="glass-panel rounded-3xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
            <div className="space-y-4">
              <div className="bg-teal-500/10 border border-teal-500/30 rounded-2xl p-4">
                <p className="text-white/70 text-sm mb-1">Payment Method</p>
                <p className="text-xl font-bold text-teal-300">Cash on Delivery</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Subtotal ({order.items.length} items)</span>
                  <span>Rs. {order.subtotal.toLocaleString('en-PK')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Delivery Charge</span>
                  <span>Rs. {order.deliveryCharge.toLocaleString('en-PK')}</span>
                </div>
                <div className="border-t border-white/20 pt-3 flex justify-between text-xl font-bold">
                  <span>Total Amount Due</span>
                  <span className="text-teal-300">Rs. {order.total.toLocaleString('en-PK')}</span>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-sm text-amber-200">
                <strong>Important:</strong> Please have the exact amount ready (Rs. {order.total}) when our delivery partner arrives.
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Order Items */}
      <FadeIn delay={300}>
        <div className="glass-panel rounded-3xl p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b border-white/10 last:border-b-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate">{item.name}</h3>
                  <p className="text-white/70 text-sm">
                    Rs. {item.price.toLocaleString('en-PK')} × {item.quantity || 1}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-teal-300">
                    Rs. {(item.price * (item.quantity || 1)).toLocaleString('en-PK')}
                  </p>
                  <p className="text-white/70 text-sm">{item.quantity || 1} item(s)</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Next Steps */}
      <FadeIn delay={350}>
        <div className="glass-panel rounded-3xl p-6 md:p-8 bg-gradient-to-r from-teal-500/10 to-blue-500/10">
          <h2 className="text-2xl font-bold mb-4">What's Next?</h2>
          <ul className="space-y-3 text-white/80">
            <li className="flex gap-3">
              <span className="text-teal-300 font-bold">✓</span>
              <span>We'll start preparing your items for dispatch immediately</span>
            </li>
            <li className="flex gap-3">
              <span className="text-teal-300 font-bold">✓</span>
              <span>You'll receive a confirmation email at <strong>{order.customer.email}</strong></span>
            </li>
            <li className="flex gap-3">
              <span className="text-teal-300 font-bold">✓</span>
              <span>Our delivery partner will contact you before arrival</span>
            </li>
            <li className="flex gap-3">
              <span className="text-teal-300 font-bold">✓</span>
              <span>Payment will be collected upon delivery</span>
            </li>
          </ul>
        </div>
      </FadeIn>

      {/* Action Buttons */}
      <FadeIn delay={400}>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('home')}
            className="flex-1 glass-button py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition flex items-center justify-center gap-2"
          >
            Continue Shopping
            <ArrowRight size={20} />
          </button>
          <button
            onClick={() => window.location.href = `mailto:${order.customer.email}`}
            className="flex-1 glass-panel py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition"
          >
            View Confirmation Email
          </button>
        </div>
      </FadeIn>
    </div>
  );
};

export default OrderConfirmationView;
