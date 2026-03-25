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

const CartItem = ({ item, closeCart }) => {
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
    <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm flex items-center hover:shadow-md transition-shadow group relative">
      {/* Product Image Link */}
      <Link 
        to={`/product/${item?.productId?.urlSlug || item?.productId?._id}`} 
        className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-gray-50 border border-gray-200 flex-shrink-0 mr-4"
      >
        <img
          src={item?.productId?.image[0]}
          alt={item?.productId?.name}
          className="w-full h-full object-contain hover:scale-105 transition-transform"
        />
      </Link>

      {/* Content */}
      <div className="flex-grow min-w-0 pr-6 flex flex-col h-full">
        <Link 
          to={`/product/${item?.productId?.urlSlug || item?.productId?._id}`}
          className="block hover:text-green-700 transition-colors"
        >
          <h3 className="font-bold text-gray-800 text-sm lg:text-base line-clamp-1 leading-tight mb-0.5">
            {item?.productId?.name}
          </h3>
        </Link>
        
        {/* Rating Section */}
        <div className="flex items-center gap-1.5 mb-1">
          <StarRating rating={averageRating} />
          <span className="text-[10px] text-gray-400">({reviewCount})</span>
        </div>
        
        {selectedAttributesDisplay && (
          <p className="text-[10px] text-gray-500 truncate mb-2 italic">
            {selectedAttributesDisplay}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-auto gap-3">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-green-700 text-base md:text-lg">
                {DisplayPriceInRupees(totalOfferPrice)}
              </span>
              {totalOriginalPrice > totalOfferPrice && (
                <span className="text-gray-400 line-through text-[11px] font-medium">
                  {DisplayPriceInRupees(totalOriginalPrice)}
                </span>
              )}
            </div>
            {totalOriginalPrice > totalOfferPrice && (
                <span className="text-[10px] text-red-500 font-bold">
                    Save {DisplayPriceInRupees(totalOriginalPrice - totalOfferPrice)}
                </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button 
                onClick={handleBuyNow}
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold rounded-lg transition-all shadow-sm active:scale-95 flex-shrink-0"
                title="Single Item Checkout"
            >
                <FiZap size={14} className="fill-current" />
                BUY NOW
            </button>
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

      {/* Trash Removal Button */}
      <button 
        onClick={handleRemove}
        className="absolute top-2 right-2 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all lg:opacity-0 lg:group-hover:opacity-100 opacity-100"
        title="Remove from cart"
      >
        <FiTrash2 size={18} />
      </button>
    </div>
  );
};

export default CartItem;
