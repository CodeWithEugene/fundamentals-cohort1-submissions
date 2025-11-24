// pages/Cart.tsx
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useCart } from '../cart/context/CartContext';

const Cart = () => {
  const { cart, loading, error, refreshCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    refreshCart();
  }, []);

  useEffect(() => {
    if (error && !loading) {
      toast.error(error);
    }
  }, [error, loading]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);
  };

  const handleCheckout = () => {
    toast.success("Checkout functionality coming soon! 🎉");
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFDF4] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9CC15E] mx-auto mb-4"></div>
          <p className="text-[#7C8689]">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error && error.includes("Please login")) {
    return (
      <div className="min-h-screen bg-[#FBFDF4] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-[#4B545D] mb-3">Authentication Required</h1>
          <p className="text-[#7C8689] mb-6">Please login to view your cart</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-[#9CC15E] text-white px-6 py-3 rounded-lg hover:bg-[#8AB350] transition font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FBFDF4] py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-4xl font-bold text-[#4B545D] mb-4">Your cart is empty</h1>
          <p className="text-[#7C8689] text-lg mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <button 
            onClick={handleContinueShopping}
            className="bg-[#9CC15E] text-white px-8 py-3 rounded-lg hover:bg-[#8AB350] transition text-lg font-medium"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFDF4] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#4B545D]">Shopping Cart</h1>
            <p className="text-[#7C8689] mt-2">
              {cart.itemCount} item{cart.itemCount !== 1 ? 's' : ''} in your cart
            </p>
          </div>
          <button 
            onClick={handleContinueShopping}
            className="flex items-center gap-2 text-[#9CC15E] hover:text-[#8AB350] font-medium transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Continue Shopping
          </button>
        </div>

        {/* Cart Items */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#DFDFDF] overflow-hidden mb-8">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 bg-[#FBFDF4] px-6 py-4 border-b border-[#DFDFDF]">
            <div className="col-span-5 font-semibold text-[#4B545D]">Product</div>
            <div className="col-span-2 font-semibold text-[#4B545D] text-center">Price</div>
            <div className="col-span-2 font-semibold text-[#4B545D] text-center">Quantity</div>
            <div className="col-span-3 font-semibold text-[#4B545D] text-right">Total</div>
          </div>

          {/* Cart Items List */}
          {cart.items.map((item) => (
            <div key={item._id} className="border-b border-[#DFDFDF] last:border-b-0 p-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Product Info */}
                <div className="md:col-span-5 flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#FBFDF4] to-[#9CC15E] rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#4B545D] text-lg mb-1">{item.product.name}</h3>
                    <p className="text-[#7C8689] text-sm line-clamp-2">{item.product.description}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="md:col-span-2 text-center">
                  <span className="md:hidden text-[#7C8689] text-sm mr-2">Price:</span>
                  <span className="font-medium text-[#4B545D]">{formatPrice(item.product.price)}</span>
                </div>

                {/* Quantity */}
                <div className="md:col-span-2 text-center">
                  <span className="md:hidden text-[#7C8689] text-sm mr-2">Qty:</span>
                  <div className="inline-flex items-center justify-center w-12 h-10 bg-[#FBFDF4] border border-[#DFDFDF] rounded-lg font-medium text-[#4B545D]">
                    {item.quantity}
                  </div>
                </div>

                {/* Total */}
                <div className="md:col-span-3 text-right">
                  <span className="md:hidden text-[#7C8689] text-sm mr-2">Total:</span>
                  <span className="font-bold text-[#4B545D] text-lg">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#DFDFDF] p-6">
          <h2 className="text-2xl font-bold text-[#4B545D] mb-6">Order Summary</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-[#7C8689]">Subtotal</span>
              <span className="font-medium text-[#4B545D]">{formatPrice(cart.total)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#7C8689]">Shipping</span>
              <span className="font-medium text-[#4B545D]">Free</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#7C8689]">Tax</span>
              <span className="font-medium text-[#4B545D]">Included</span>
            </div>
            <div className="border-t border-[#DFDFDF] pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-[#4B545D]">Total</span>
                <span className="text-2xl font-bold text-[#4B545D]">{formatPrice(cart.total)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button 
              onClick={handleCheckout}
              className="w-full bg-[#9CC15E] hover:bg-[#8AB350] text-white py-4 rounded-lg font-medium text-lg transition transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Proceed to Checkout
            </button>
            
            <button 
              onClick={handleContinueShopping}
              className="w-full border-2 border-[#9CC15E] text-[#9CC15E] hover:bg-[#9CC15E] hover:text-white py-3 rounded-lg font-medium transition"
            >
              Continue Shopping
            </button>
          </div>

          {/* Security Badge */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 text-[#7C8689] text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secure checkout guaranteed
            </div>
          </div>
        </div>

        {/* Empty State for Mobile */}
        {cart.items.length === 0 && (
          <div className="md:hidden text-center py-8">
            <div className="text-4xl mb-4">🛒</div>
            <p className="text-[#7C8689]">Your cart is empty</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;