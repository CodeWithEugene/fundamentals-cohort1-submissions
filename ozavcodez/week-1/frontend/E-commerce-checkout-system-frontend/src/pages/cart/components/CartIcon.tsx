// components/CartIcon.tsx
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartIcon = () => {
  const { cartCount } = useCart();
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/cart')}
      className="relative p-2 text-[#4B545D] hover:text-[#9CC15E] transition-colors duration-200"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21" />
      </svg>
      
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#9CC15E] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      )}
    </button>
  );
};

export default CartIcon;