import React from 'react';
import { FaCoins } from 'react-icons/fa';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';

const CartSummary = ({ notDiscountTotalPrice, totalPrice, totalSavings }) => {
  return (
    <div className="bg-[#f3f9f2] rounded-2xl p-6 shadow-sm border border-green-50">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Subtotal</span>
          <div className="flex items-center gap-2">
            {totalSavings > 0 && (
              <span className="text-gray-400 line-through text-sm">
                {DisplayPriceInRupees(notDiscountTotalPrice)}
              </span>
            )}
            <span className="text-gray-900 font-bold">
              {DisplayPriceInRupees(totalPrice)}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Discount</span>
          <span className="text-gray-900 font-bold">- ₹0</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Shipping Charge</span>
          <span className="text-gray-900 font-bold">₹0</span>
        </div>

        {totalSavings > 0 && (
          <div className="border border-dashed border-green-500 rounded-lg p-2 flex items-center justify-center gap-2 bg-white/40 flex-nowrap overflow-hidden">
            <FaCoins className="text-yellow-500 shadow-sm flex-shrink-0" size={14} />
            <span className="text-green-700 text-[11px] sm:text-xs font-bold whitespace-nowrap">
              Total Savings of {DisplayPriceInRupees(totalSavings)} From this order
            </span>
          </div>
        )}
        
        <div className="border-t border-gray-200/60 pt-4 flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">Grand Total</span>
          <span className="text-lg font-bold text-gray-900">
            {DisplayPriceInRupees(totalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
