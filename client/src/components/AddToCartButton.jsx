import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../provider/GlobalProvider';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import Loading from './Loading';
import { useSelector } from 'react-redux';
import { FaMinus, FaPlus, FaCartShopping } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography } from '@mui/material';


// Add fullWidth to the destructuring of props, with a default of false
const AddToCartButton = ({ data, buttonColor = '#16a34a', hoverColor = '#15803d', textColor = 'white', fullWidth = false }) => {
  const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const cartItem = useSelector(state => state.cartItem.cart);
  const [isAvailableCart, setIsAvailableCart] = useState(false);
  const [qty, setQty] = useState(0);
  const [cartItemDetails, setCartItemDetails] = useState(); // Corrected spelling for consistency
  const navigate = useNavigate();

  console.log('AddToCartButton data:', data);

  const handleADDTocart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setLoading(true);

      if (!data || !data._id) {
        console.error('Invalid product data:', data);
        toast.error('Invalid product data');
        return;
      }

      // Check if data.attributes exists and has length, or if data.selectedAttributes exists and has entries
      // This allows products without attributes to still be added to cart if they have a base price
      if (data.attributes && data.attributes.length > 0 && (!data.selectedAttributes || Object.keys(data.selectedAttributes).length === 0)) {
        console.error('No attributes selected:', data.selectedAttributes);
        toast.error('Please select product attributes');
        return;
      }

      let attributesToSend = [];
      if (data.attributes && data.attributes.length > 0) {
        attributesToSend = Object.entries(data.selectedAttributes || {}).map(([attributeName, option]) => {
          if (!option || !option.name) {
            console.error('Invalid option for attribute:', attributeName, option);
            throw new Error(`Invalid option for attribute ${attributeName}`);
          }
          return {
            attributeName,
            optionName: option.name,
          };
        });
      }

      console.log('Request payload:', { productId: data._id, selectedAttributes: attributesToSend });

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
      }
    } catch (error) {
      console.error('Add to cart error:', error.response?.data || error);
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

    // Determine attributes to match against
    const targetAttributes = data.attributes && data.attributes.length > 0 ? Object.entries(data.selectedAttributes || {}) : [];

    const checkingitem = cartItem.some(
      item =>
        item.productId &&
        item.productId._id === data._id &&
        // Check if selectedAttributes match (if attributes exist)
        (targetAttributes.length === 0 || item.selectedAttributes?.every(attr =>
          targetAttributes.some(
            ([attrName, selAttr]) => attr.attributeName === attrName && attr.optionName === selAttr.name
          )
        ))
    );
    setIsAvailableCart(checkingitem);

    const product = cartItem.find(
      item =>
        item.productId &&
        item.productId._id === data._id &&
        // Check if selectedAttributes match (if attributes exist)
        (targetAttributes.length === 0 || item.selectedAttributes?.every(attr =>
          targetAttributes.some(
            ([attrName, selAttr]) => attr.attributeName === attrName && attr.optionName === selAttr.name
          )
        ))
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

  // Determine if the add to cart button should be disabled due to missing attribute selections
  const isDisabled = loading || (data.attributes && data.attributes.length > 0 && (!data.selectedAttributes || Object.keys(data.selectedAttributes).length === 0));

  return (
    // Conditionally set maxWidth based on fullWidth prop
    <Box sx={{ width: '100%', maxWidth: fullWidth ? '100%' : '150px' }}> 
      {isAvailableCart ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <Button
            onClick={decreaseQty}
            variant="contained"
            sx={{
              flex: 1,
              minWidth: 0,
              padding: { xs: '4px', lg: '6px' },
              borderRadius: '9999px 0 0 9999px',
              height: { xs: '32px', lg: '36px' },
              bgcolor: buttonColor,
              '&:hover': { bgcolor: hoverColor },
              color: textColor,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
           <FaMinus size={14} style={{ color: '#ffffff' }} className="icon-white" />

          </Button>
          <Typography
            sx={{
              flex: 1,
              textAlign: 'center',
              fontWeight: 'medium',
              px: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.100',
              height: { xs: '32px', lg: '36px' },
              borderTop: '1px solid',
              borderBottom: '1px solid',
              borderColor: 'grey.300',
            }}
          >
            {qty}
          </Typography>
          <Button
            onClick={increaseQty}
            variant="contained"
            sx={{
              flex: 1,
              minWidth: 0,
              padding: { xs: '4px', lg: '6px' },
              borderRadius: '0 9999px 9999px 0',
              height: { xs: '32px', lg: '36px' },
              bgcolor: buttonColor,
              '&:hover': { bgcolor: hoverColor },
              color: textColor,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <FaPlus size={14} style={{ color: '#ffffff' }} className="icon-white"  />
          </Button>
        </Box>
      ) : (
        <Button
          onClick={handleADDTocart}
          variant="contained"
          sx={{
            width: '100%',
            px: { xs: 2, lg: 4 },
            py: 1,
            borderRadius: '4px',
            bgcolor: buttonColor,
            '&:hover': { bgcolor: hoverColor },
            color: textColor,
            fontSize: { xs: '0.875rem', lg: '1rem' },
            textTransform: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
          disabled={isDisabled} // Use the new isDisabled variable
        >
          {loading ? <Loading /> : "Add to Cart"}
        </Button>
      )}
    </Box>
  );
};

export default AddToCartButton;