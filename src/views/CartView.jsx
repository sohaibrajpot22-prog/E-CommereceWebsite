import { Trash2, ArrowLeft, ShoppingCart } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import { updateCartItemQuantity, removeFromCart, getCartTotal } from '../cartManager';

const CartView = ({ cart, setCart, navigate }) => {
  const handleQuantityChange = (itemId, newQuantity) => {
    setCart(updateCartItemQuantity(cart, itemId, newQuantity));
  };

  const handleRemoveItem = (itemId) => {
    setCart(removeFromCart(cart, itemId));
  };

  const subtotal = getCartTotal(cart);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <FadeIn>
          <div className="text-center">
            <ShoppingCart size={64} className="mx-auto text-white/40 mb-4" />
            <h2 className="text-3xl font-bold mb-2">Your Cart is Empty</h2>
            <p className="text-white/70 mb-8">Start shopping to add items to your cart</p>
            <button
              onClick={() => navigate('shirts')}
              className="glass-button px-8 py-4 rounded-full font-bold text-lg inline-flex items-center gap-2"
            >
              <ArrowLeft size={20} /> Continue Shopping
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
            onClick={() => navigate('home')}
            className="glass-button p-3 rounded-full hover:bg-white/20"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-4xl font-bold">Shopping Cart</h1>
          <span className="ml-auto text-white/70 text-lg">{cart.length} Items</span>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <FadeIn>
            <div className="space-y-4">
              {cart.map((item, idx) => (
                <FadeIn key={item.id} delay={idx * 50}>
                  <div className="glass-panel rounded-2xl p-4 flex gap-4 items-start">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate">{item.name}</h3>
                      <p className="text-teal-300 font-semibold mb-3">Rs. {item.price}</p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                          className="glass-button px-3 py-1 rounded-lg text-sm font-bold"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-bold">{item.quantity || 1}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                          className="glass-button px-3 py-1 rounded-lg text-sm font-bold"
                        >
                          +
                        </button>
                        <span className="ml-auto font-bold text-teal-200">
                          Rs. {(item.price * (item.quantity || 1)).toLocaleString('en-PK')}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition shrink-0"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Order Summary */}
        <FadeIn delay={200} className="lg:col-span-1">
          <div className="glass-panel rounded-3xl p-6 sticky top-24 space-y-4">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-3 border-b border-white/20 pb-4">
              <div className="flex justify-between">
                <span className="text-white/70">Subtotal</span>
                <span className="font-semibold">Rs. {subtotal.toLocaleString('en-PK')}</span>
              </div>
              <div className="flex justify-between text-white/70 text-sm">
                <span>{cart.length} items</span>
              </div>
            </div>
            <p className="text-white/70 text-sm">Delivery charges will be calculated during checkout</p>
            <button
              onClick={() => navigate('checkout')}
              className="w-full glass-button bg-teal-500/20 hover:bg-teal-500/40 py-3 rounded-2xl font-bold text-lg border-teal-300/50 transition"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={() => navigate('shirts')}
              className="w-full glass-panel py-3 rounded-2xl font-bold hover:bg-white/10 transition"
            >
              Continue Shopping
            </button>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default CartView;
