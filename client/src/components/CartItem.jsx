import React from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import AddToCartButton from './AddToCartButton';
import { useGlobalContext } from '../provider/GlobalProvider';

const CartItem = ({ item }) => {
  const { deleteCartItem } = useGlobalContext();

  const itemDisplayPrice = item.selectedAttributes.reduce(
    (sum, attr) => sum + (attr.price || 0),
    0
  );
  
  const selectedAttributesDisplay = item.selectedAttributes
    .map(attr => `${attr.attributeName}: ${attr.optionName}`)
    .join(', ');

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    deleteCartItem(item._id);
  };

  return (
    <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm flex items-center hover:shadow-md transition-shadow group relative">
      {/* Product Image Link */}
      <Link 
        to={`/product/${item?.productId?.urlSlug || item?.productId?._id}`} 
        className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50 border border-gray-200 flex-shrink-0 mr-4"
      >
        <img
          src={item?.productId?.image[0]}
          alt={item?.productId?.name}
          className="w-full h-full object-contain hover:scale-105 transition-transform"
        />
      </Link>

      {/* Content */}
      <div className="flex-grow min-w-0 pr-8">
        <Link 
          to={`/product/${item?.productId?.urlSlug || item?.productId?._id}`}
          className="block group-hover:text-green-700 transition-colors"
        >
          <h3 className="font-semibold text-gray-800 text-sm lg:text-base line-clamp-2 leading-tight mb-1">
            {item?.productId?.name}
          </h3>
        </Link>
        
        {selectedAttributesDisplay && (
          <p className="text-[11px] text-gray-500 truncate mb-2">
            {selectedAttributesDisplay}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-1">
          <span className="font-bold text-green-700">
            {DisplayPriceInRupees(itemDisplayPrice)}
          </span>
          
          <div className="w-24 ml-2">
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
