import React from 'react';
import { FaCoins } from 'react-icons/fa';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useGlobalContext } from '../provider/GlobalProvider';

const CartSummary = ({ notDiscountTotalPrice, totalPrice, totalSavings }) => {
  const { settings } = useGlobalContext();
  const discountPercentage = notDiscountTotalPrice > 0 
    ? Math.round((totalSavings / notDiscountTotalPrice) * 100) 
    : 0;

  const shippingCharge = (totalPrice >= (settings?.freeShippingThreshold || 0) && settings?.freeShippingThreshold > 0) ? 0 : (settings?.shippingCharge || 0);
  const grandTotal = totalPrice + shippingCharge;

  return (
    <div className="bg-[#f3f9f2] rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Subtotal (Original)</span>
          <span className="text-gray-400 line-through text-sm">
            {DisplayPriceInRupees(notDiscountTotalPrice)}
          </span>
        </div>

        {totalSavings > 0 && (
          <div className="flex justify-between items-center text-green-700 bg-green-100/50 px-3 py-2 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <span className="font-bold">Discount</span>
              <span className="bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded-md">{discountPercentage}% OFF</span>
            </div>
            <span className="font-bold">- {DisplayPriceInRupees(totalSavings)}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <span className="text-gray-700 font-medium">Shipping Charge</span>
          <span className={`${shippingCharge === 0 ? "text-green-600 font-bold" : "text-gray-900 font-bold"}`}>
            {shippingCharge === 0 ? "FREE" : DisplayPriceInRupees(shippingCharge)}
          </span>
        </div>

        {totalSavings > 0 && (
          <div className="border border-dashed border-green-500 rounded-lg p-3 flex items-center justify-center gap-2 bg-white shadow-sm">
            <FaCoins className="text-yellow-500 flex-shrink-0" size={16} />
            <span className="text-green-700 text-xs font-black uppercase tracking-wider">
              You saved {DisplayPriceInRupees(totalSavings)}!
            </span>
          </div>
        )}
        
        <div className="border-t-2 border-dashed border-gray-200 pt-4 flex justify-between items-center mt-2">
          <span className="text-xl font-black text-gray-900 tracking-tight">Grand Total</span>
          <span className="text-xl font-black text-green-700">
            {DisplayPriceInRupees(grandTotal)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
