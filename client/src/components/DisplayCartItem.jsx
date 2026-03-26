import React, { useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { HiShoppingBag } from "react-icons/hi2";
import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { useGlobalContext } from '../provider/GlobalProvider';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import imageEmpty from '../assets/empty_cart.png';
import { toast } from 'sonner';

const DisplayCartItem = ({ close }) => {
  const { notDiscountTotalPrice, totalPrice, totalQty } = useGlobalContext();
  const cartItem = useSelector((state) => state.cartItem.cart);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const redirectToCheckoutPage = () => {
    if (user?._id) {
      navigate('/checkout');
      close?.();
    } else {
      toast.error('Please Login to proceed');
    }
  };

  const handleOutsideClick = (event) => {
    if (event.target === event.currentTarget) {
      close?.();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        close?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [close]);

  const totalSavings = notDiscountTotalPrice - totalPrice;

  return (
    <div 
        className="fixed inset-0 z-[1300] bg-black bg-opacity-60 flex justify-end cursor-pointer transition-opacity duration-300"
        onClick={handleOutsideClick}
    >
      <div 
        className="w-full sm:w-[420px] h-full bg-[#f9fbfd] flex flex-col shadow-2xl cursor-default animate-slide-in-right overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between bg-white border-b border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-green-700">
            Your Cart ({totalQty})
          </h2>
          <button 
            onClick={close} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
            aria-label="close cart"
          >
            <IoClose size={28} />
          </button>
        </div>

        {cartItem.length > 0 ? (
          <>
            <div className="flex-grow overflow-y-auto p-4 space-y-4 pt-6">
              {cartItem.map((item) => (
                <CartItem key={item._id} item={item} closeCart={close} />
              ))}

              {/* Bill Summary Redesign */}
              <div className="mt-4 mb-2">
                <CartSummary 
                  notDiscountTotalPrice={notDiscountTotalPrice}
                  totalPrice={totalPrice}
                  totalSavings={totalSavings}
                />
              </div>
            </div>

            {/* Sticky Bottom Checkout */}
            <div className="p-4 bg-white border-t border-gray-100">
              <button
                onClick={redirectToCheckoutPage}
                className="w-full bg-[#fbb034] hover:bg-[#f39c12] text-wh font-bold text-lg py-4 rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <HiShoppingBag size={24} />
                <span>Checkout</span>
              </button>

            </div>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center animate-fade-in">
            <img
              src={imageEmpty}
              alt="Empty Cart"
              className="max-w-[70%] h-auto opacity-70 mb-8 grayscale-[0.2]"
            />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              Your cart is empty!
            </h3>
            <p className="text-gray-500 mb-8 max-w-xs">
                Looks like you haven't added anything yet. Start exploring our categories!
            </p>
            <button
              onClick={() => {
                  navigate("/");
                  close();
              }}
              className="px-10 py-3.5 bg-[#196806] hover:bg-[#104a02] rounded-full text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              Shop Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayCartItem;