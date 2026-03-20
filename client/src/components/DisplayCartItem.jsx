import React, { useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaCaretRight } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGlobalContext } from '../provider/GlobalProvider';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import AddToCartButton from './AddToCartButton';
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
              {cartItem.map((item) => {
                let itemDisplayPrice = item.selectedAttributes.reduce(
                  (sum, attr) => sum + (attr.price || 0),
                  0
                );
                let itemDisplayUnit =
                  item.selectedAttributes.find(attr => attr.unit)?.unit || 'Unit N/A';
                let selectedAttributesDisplay = item.selectedAttributes
                  .map(attr => `${attr.attributeName}: ${attr.optionName}`)
                  .join(', ');

                return (
                  <div key={item._id} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm flex items-center hover:shadow-md transition-shadow">
                    {/* Image */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50 border border-gray-200 flex-shrink-0 mr-4">
                      <img
                        src={item?.productId?.image[0]}
                        alt={item?.productId?.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-grow min-w-0">
                      <h3 className="font-semibold text-gray-800 text-sm lg:text-base line-clamp-2 leading-tight mb-1">
                        {item?.productId?.name}
                      </h3>
                      
                      {selectedAttributesDisplay && (
                        <p className="text-[11px] text-gray-500 truncate mb-0.5">
                          {selectedAttributesDisplay}
                        </p>
                      )}
                      
                      <p className="text-[11px] text-gray-400 italic mb-2">
                        {itemDisplayUnit}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="font-bold text-green-700">
                          {DisplayPriceInRupees(itemDisplayPrice)}
                        </span>
                        
                        <div className="w-24">
                          <AddToCartButton
                            data={{
                              ...item?.productId,
                              selectedAttributes: item?.selectedAttributes.reduce(
                                (acc, attr) => ({
                                  ...acc,
                                  [attr.attributeName]: {
                                    name: attr.optionName,
                                    price: attr.price,
                                    stock: attr.stock,
                                    unit: attr.unit,
                                  },
                                }),
                                {}
                              ),
                            }}
                            buttonColor="#196806"
                            hoverColor="#104a02"
                            textColor="#ffffff"
                            fullWidth={false}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Bill Summary */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mt-6 mb-10">
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-50 pb-2">
                    Bill Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Items Total</span>
                    <span className="text-gray-800 font-medium">{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Delivery</span>
                    <span className="text-green-600 font-bold uppercase tracking-wide text-xs">Free</span>
                  </div>
                  
                  <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Grand Total</span>
                    <span className="text-xl font-black text-green-700">
                      {DisplayPriceInRupees(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Bottom Checkout */}
            <div className="p-4 bg-indigo-50 border-t border-indigo-100 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
              <button
                onClick={redirectToCheckoutPage}
                className="w-full bg-[#196806] hover:bg-[#104a02] text-white rounded-xl py-3.5 px-6 flex items-center justify-between transition-all transform active:scale-[0.98] shadow-lg group"
              >
                <span className="text-lg font-black tracking-tight">
                    {DisplayPriceInRupees(totalPrice)}
                </span>
                <div className="flex items-center space-x-2 font-bold uppercase text-sm tracking-widest">
                  <span>Proceed</span>
                  <FaCaretRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </div>
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