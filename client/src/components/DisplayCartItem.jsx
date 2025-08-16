import React, { useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaCaretRight } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGlobalContext } from '../provider/GlobalProvider';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import AddToCartButton from './AddToCartButton';
import imageEmpty from '../assets/empty_cart.png';
import toast from 'react-hot-toast';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';

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

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [close]);

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 1300,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'flex-end',
        cursor: 'pointer',
      }}
      onClick={handleOutsideClick}
    >
      <Box
        sx={{
          width: { xs: '100%', sm: 420 },
          height: '100%',
          backgroundColor: '#f9fbfd',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 12px rgba(0,0,0,0.2)',
          cursor: 'default',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            borderBottom: '1px solid #e0e0e0',
          }}
        >
          <Typography variant="h6" fontWeight="bold" color="primary">
            Your Cart ({totalQty})
          </Typography>
          <IconButton onClick={close} aria-label="close cart">
            <IoClose size={26} />
          </IconButton>
        </Box>

        {cartItem.length > 0 ? (
          <>
            <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
              {cartItem.map((item) => {
                let itemDisplayPrice = item.selectedAttributes.reduce(
                  (sum, attr) => sum + (attr.price || 0),
                  0
                );
                let itemDisplayUnit =
                  item.selectedAttributes.find(attr => attr.unit)?.unit || 'Unit N/A'; // Default to 'Unit N/A'
                let selectedAttributesDisplay = item.selectedAttributes
                  .map(attr => `${attr.attributeName}: ${attr.optionName}`)
                  .join(', ');

                return (
                  <Card key={item._id}
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      boxShadow: 1,
                      bgcolor: 'white',
                      display: 'flex', // Use flex for card content directly
                      alignItems: 'center', // Center items vertically
                      p: 1.5 // Slightly more padding
                    }}
                  >
                    {/* Image Section */}
                    <Box
                      sx={{
                        width: 90, // Slightly larger image thumbnail
                        height: 90, // Slightly larger image thumbnail
                        borderRadius: 1.5,
                        overflow: 'hidden',
                        backgroundColor: '#f8fafc', // Lighter background for image box
                        border: '1px solid #e0e0e0', // Slightly stronger border
                        flexShrink: 0,
                        mr: 2 // Margin right to separate from text
                      }}
                    >
                      <img
                        src={item?.productId?.image[0]}
                        alt={item?.productId?.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </Box>

                    {/* Product Details Section */}
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Typography
                        variant="body1" // Adjusted to body1 for slightly larger name
                        fontWeight={600} // Bolder name
                        sx={{
                          mb: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          color: 'text.primary',
                        }}
                      >
                        {item?.productId?.name}
                      </Typography>

                      {selectedAttributesDisplay && (
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, lineHeight: 1.3 }}> {/* Smaller, tighter line height */}
                          {selectedAttributesDisplay}
                        </Typography>
                      )}

                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, fontStyle: 'italic' }}> {/* Italic for unit */}
                        {itemDisplayUnit}
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                          {DisplayPriceInRupees(itemDisplayPrice)}
                        </Typography>
                        {/* AddToCartButton remains here, its own styles will apply */}
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
                          fullWidth={false} // Small button for quantity control
                        />
                      </Box>
                    </Box>
                  </Card>
                );
              })}
              <Card sx={{ borderRadius: 3, boxShadow: 2, mt: 3, bgcolor: 'white' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Bill Summary
                  </Typography>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={8}>
                      <Typography variant="body1" color="text.secondary">Items Total</Typography>
                    </Grid>
                    <Grid item xs={4} textAlign="right">
                      <Typography variant="body1" color="text.primary">{DisplayPriceInRupees(notDiscountTotalPrice)}</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body1" color="text.secondary">Delivery</Typography>
                    </Grid>
                    <Grid item xs={4} textAlign="right">
                      <Typography variant="body1" color="success.main">Free</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2, borderColor: '#e0e0e0' }} />
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="h6" fontWeight="bold">
                        Grand Total
                      </Typography>
                    </Grid>
                    <Grid item xs={4} textAlign="right">
                      <Typography variant="h6" fontWeight="bold" color="primary.main">
                        {DisplayPriceInRupees(totalPrice)}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 3,
            }}
          >
            <img
              src={imageEmpty}
              alt="Empty Cart"
              style={{
                maxWidth: '80%',
                maxHeight: 250,
                opacity: 0.8,
                marginBottom: '2rem',
              }}
            />
            <Typography variant="h5" mt={4} mb={2} fontWeight="medium" color="text.secondary">
              Your cart is empty!
            </Typography>
            <Button
              component={Link}
              to="/"
              onClick={close}
              variant="contained"
              size="large"
              sx={{
                borderRadius: 2,
                px: 5,
                py: 1.5,
                bgcolor: '#196806',
                '&:hover': {
                  bgcolor: '#104a02',
                },
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              Shop Now
            </Button>
          </Box>
        )}

        {cartItem.length > 0 && (
          <Box sx={{ p: 3, backgroundColor: '#e3f2fd', boxShadow: '0 -2px 6px rgba(0,0,0,0.1)', borderTop: '1px solid #c5cae9' }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={redirectToCheckoutPage}
              sx={{
                borderRadius: 2,
                py: 1.5,
                display: 'flex',
                justifyContent: 'space-between',
                bgcolor: '#196806',
                '&:hover': {
                  bgcolor: '#104a02',
                },
                color: 'white',
                textTransform: 'none',
                fontSize: '1.1rem',
              }}
            >
              <Typography fontWeight="bold" color="inherit">{DisplayPriceInRupees(totalPrice)}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>
                <Typography fontWeight="bold" color="inherit">Proceed</Typography>
                <FaCaretRight size={18} style={{ marginLeft: 8 }} />
              </Box>
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DisplayCartItem;