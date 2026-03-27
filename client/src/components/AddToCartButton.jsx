import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../provider/GlobalProvider';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { toast } from 'sonner';
import AxiosToastError from '../utils/AxiosToastError';
import Loading from './Loading';
import { useSelector } from 'react-redux';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { BsCart4 } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';

const AddToCartButton = ({ data, buttonColor = '#16a34a', hoverColor = '#15803d', textColor = 'white', fullWidth = false }) => {
  const { fetchCartItem, updateCartItem, deleteCartItem, setIsCartOpen } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const cartItem = useSelector(state => state.cartItem.cart);
  const [isAvailableCart, setIsAvailableCart] = useState(false);
  const [qty, setQty] = useState(0);
  const [cartItemDetails, setCartItemDetails] = useState();
  const navigate = useNavigate();

  const handleADDTocart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setLoading(true);

      if (!data || !data._id) {
        toast.error('Invalid product data');
        return;
      }

      if (data.attributes && data.attributes.length > 0 && (!data.selectedAttributes || Object.keys(data.selectedAttributes).length === 0)) {
        toast.error('Please select product attributes');
        return;
      }

      let attributesToSend = [];
      if (data.attributes && data.attributes.length > 0) {
        attributesToSend = Object.entries(data.selectedAttributes || {}).map(([attributeName, option]) => {
          if (!option || !option.name) {
            throw new Error(`Invalid option for attribute ${attributeName}`);
          }
          return {
            attributeName,
            optionName: option.name,
          };
        });
      }

      const response = await Axios({
        ...SummaryApi.addTocart,
        data: {
          productId: data._id,
          selectedAttributes: attributesToSend,
        },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        setIsAvailableCart(true);
        setQty(1);
        setCartItemDetails({
          _id: responseData.data._id,
          productId: { _id: data._id },
          quantity: 1,
          selectedAttributes: attributesToSend,
        });
        if (fetchCartItem) {
          fetchCartItem();
        }
        setIsCartOpen(true);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to add to cart');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!data?._id || !cartItem) return;

    const targetAttributes = data.attributes && data.attributes.length > 0 ? Object.entries(data.selectedAttributes || {}) : [];

    const checkingitem = cartItem.some(
      item =>
        item.productId &&
        item.productId._id === data._id &&
        (targetAttributes.length === 0 || 
          (item.selectedAttributes?.length === targetAttributes.length &&
           item.selectedAttributes?.every(attr =>
            targetAttributes.some(
              ([attrName, selAttr]) => attr.attributeName === attrName && attr.optionName === selAttr.name
            )
          ))
        )
    );
    setIsAvailableCart(checkingitem);
  
    const product = cartItem.find(
      item =>
        item.productId &&
        item.productId._id === data._id &&
        (targetAttributes.length === 0 || 
          (item.selectedAttributes?.length === targetAttributes.length &&
           item.selectedAttributes?.every(attr =>
            targetAttributes.some(
              ([attrName, selAttr]) => attr.attributeName === attrName && attr.optionName === selAttr.name
            )
          ))
        )
    );
    setQty(product?.quantity || 0);
    setCartItemDetails(product);
  }, [data, cartItem]);

  const increaseQty = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const response = await updateCartItem(cartItemDetails?._id, qty + 1);
    if (response.success) {
      toast.success('Item added');
      setQty(qty + 1);
      setIsCartOpen(true);
    }
  };

  const decreaseQty = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (qty === 1) {
      await deleteCartItem(cartItemDetails?._id);
      setIsAvailableCart(false);
      setQty(0);
      setCartItemDetails(null);
    } else {
      const response = await updateCartItem(cartItemDetails?._id, qty - 1);
      if (response.success) {
        toast.success('Item removed');
        setQty(qty - 1);
      }
    }
  };

  const isDisabled = loading || (data.attributes && data.attributes.length > 0 && (!data.selectedAttributes || Object.keys(data.selectedAttributes).length === 0));

  return (
    <div className={`w-full ${fullWidth ? 'max-w-full' : 'max-w-[150px]'}`}> 
      {isAvailableCart ? (
        <div className="flex items-center w-full h-9 lg:h-10 rounded-full overflow-hidden border border-gray-200 shadow-md">
          <button
            onClick={decreaseQty}
            className="flex-1 h-full flex items-center justify-center transition-colors text-white"
            style={{ backgroundColor: buttonColor }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = buttonColor)}
          >
            <FaMinus size={14} />
          </button>
          
          <div className="flex-1 h-full bg-slate-50 flex items-center justify-center border-x border-gray-200 font-bold text-sm lg:text-base text-slate-900">
            {qty}
          </div>

          <button
            onClick={increaseQty}
            className="flex-1 h-full flex items-center justify-center transition-colors text-white"
            style={{ backgroundColor: buttonColor }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = buttonColor)}
          >
            <FaPlus size={14} />
          </button>
        </div>
      ) : (
        <button
          onClick={handleADDTocart}
          className="w-full h-9 lg:h-10 rounded-full font-medium text-sm lg:text-base flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: buttonColor, color: textColor }}
          onMouseEnter={(e) => !isDisabled && (e.currentTarget.style.backgroundColor = hoverColor)}
          onMouseLeave={(e) => !isDisabled && (e.currentTarget.style.backgroundColor = buttonColor)}
          disabled={isDisabled}
        >
          {loading ? <Loading className="w-5 h-5" /> : (
            <>
              <BsCart4 size={18} />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;