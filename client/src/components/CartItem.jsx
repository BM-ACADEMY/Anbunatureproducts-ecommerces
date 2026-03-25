import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiZap } from 'react-icons/fi';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import AddToCartButton from './AddToCartButton';
import { useGlobalContext } from '../provider/GlobalProvider';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          className={`text-xs ${
            index < Math.round(rating) ? "text-amber-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const CartItem = ({ item, closeCart, showBuyNow = false }) => {
  const { deleteCartItem } = useGlobalContext();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const totalOfferPrice = item.selectedAttributes.reduce(
    (sum, attr) => sum + (attr.offerPrice || attr.price || 0),
    0
  );

  const totalOriginalPrice = item.selectedAttributes.reduce(
    (sum, attr) => sum + (attr.originalPrice || attr.price || 0),
    0
  );
  
  const selectedAttributesDisplay = item.selectedAttributes
    .map(attr => `${attr.attributeName}: ${attr.optionName}`)
    .join(', ');

  const reviews = item.productId?.reviews || [];
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length
    : 4; // Default to 4 if no reviews
  const reviewCount = reviews.length;

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    deleteCartItem(item._id);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (user?._id) {
        closeCart?.();
        navigate('/checkout', { state: { singleItem: item } });
    } else {
        toast.error('Please Login to proceed');
        navigate('/login');
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-col gap-4 group relative">
      <div className="flex gap-4">
        {/* Left Column: Image and Qty Selector */}
        <div className="flex flex-col items-center gap-3">
          <Link 
            to={`/product/${item?.productId?.urlSlug || item?.productId?._id}`} 
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0"
          >
            <img
              src={item?.productId?.image[0]}
              alt={item?.productId?.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </Link>
        </div>

        {/* Right Column: Content */}
        <div className="flex-grow min-w-0 flex flex-col">
          <div className="flex justify-between items-start gap-2">
            <Link 
              to={`/product/${item?.productId?.urlSlug || item?.productId?._id}`}
              className="block hover:text-green-700 transition-colors mb-1 flex-grow"
            >
              <h3 className="font-bold text-gray-800 text-sm sm:text-base lg:text-lg line-clamp-2 leading-tight">
                {item?.productId?.name}
              </h3>
            </Link>
          </div>


          
          {/* Rating Section */}
          <div className="flex items-center gap-1.5 mb-2">
            <StarRating rating={averageRating} />
            <span className="text-xs text-gray-400">({reviewCount})</span>
          </div>
          
          {selectedAttributesDisplay && (
            <p className="text-[11px] text-gray-500 truncate mb-3 italic">
              {selectedAttributesDisplay}
            </p>
          )}
          
          <div className="mt-auto flex justify-between items-end gap-2">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-green-700 text-lg sm:text-xl">
                  {DisplayPriceInRupees(totalOfferPrice)}
                </span>
                {totalOriginalPrice > totalOfferPrice && (
                  <span className="text-gray-400 line-through text-xs font-medium">
                    {DisplayPriceInRupees(totalOriginalPrice)}
                  </span>
                )}
              </div>
              {totalOriginalPrice > totalOfferPrice && (
                  <span className="text-[11px] text-red-500 font-bold block mt-0.5">
                      Save {DisplayPriceInRupees(totalOriginalPrice - totalOfferPrice)}
                  </span>
              )}
            </div>
            
            <div className="w-24 sm:w-28 flex-shrink-0">
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
                fullWidth={true}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex border-t border-gray-100 pt-3 mt-1 gap-4">
        <button 
          onClick={handleRemove}
          className="flex-1 flex items-center justify-center gap-2 text-gray-500 font-bold text-xs sm:text-sm hover:text-red-600 transition-all uppercase tracking-wide group/remove bg-gray-50 hover:bg-red-50 py-2 rounded-lg"
          title="Remove from cart"
        >
          <FiTrash2 size={18} className="group-hover/remove:scale-110 transition-transform" />
          <span>Remove</span>
        </button>
        
        {showBuyNow && (
          <button 
            onClick={handleBuyNow}
            className="flex-1 flex items-center justify-center gap-2 text-gray-500 font-bold text-xs sm:text-sm hover:text-amber-600 transition-all uppercase tracking-wide group/buy bg-gray-50 hover:bg-amber-50 py-2 rounded-lg"
            title="Buy this now"
          >
            <FiZap size={18} className="group-hover/buy:scale-110 transition-transform" />
            <span>Buy this now</span>
          </button>
        )}
      </div>

    </div>
  );
};

export default CartItem;
