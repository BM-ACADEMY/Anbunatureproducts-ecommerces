import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import NoData from "../components/NoData";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Chip,
  Box
} from "@mui/material";
import { 
  Info, 
  X, 
  MoreVertical, 
  Truck, 
  ShoppingBag, 
  User, 
  AlertTriangle,
  AlertCircle,
  Check,
  Clock,
  Package,
  RotateCcw,
  ArrowRight,
  MapPin,
  CreditCard,
  AlertOctagon
} from 'lucide-react';
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { setOrder } from "../store/orderSlice";
import UserTrackingModal from "../components/UserTrackingModal";

const MyOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.order || []);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [openTrackingModal, setOpenTrackingModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOrderId, setMenuOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await Axios(SummaryApi.getOrderItems);
      if (response.data.success) {
        dispatch(setOrder(response.data.data));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusStyles = (status) => {
    switch (status) {
      case "Delivered":
        return {
          bgcolor: "#16a34a",
          color: "#ffffff",
        };
      case "Pending":
        return {
          bgcolor: "#f59e0b",
          color: "#ffffff",
        };
      case "Processing":
        return {
          bgcolor: "#3b82f6",
          color: "#ffffff",
        };
      case "Shipped":
        return {
          bgcolor: "#8b5cf6",
          color: "#ffffff",
        };
      case "Cancelled":
        return {
          bgcolor: "#ef4444",
          color: "#ffffff",
        };
      default:
        return {
          bgcolor: "#6b7280",
          color: "#ffffff",
        };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered": return <Check size={16} />;
      case "Pending": return <Clock size={16} />;
      case "Processing": return <RotateCcw size={16} />;
      case "Shipped": return <Truck size={16} />;
      case "Cancelled": return <X size={16} />;
      default: return <Package size={16} />;
    }
  };

  const handleOpenCancelModal = (order) => {
    if (order.tracking_status === "Shipped" || order.tracking_status === "Delivered" || order.isCancelled) {
      toast.error("Cannot cancel this order");
      return;
    }
    setSelectedOrder(order);
    setOpenCancelModal(true);
    handleCloseMenu();
  };

  const handleOpenTrackingModal = (order) => {
    setSelectedOrder(order);
    setOpenTrackingModal(true);
    handleCloseMenu();
  };

  const handleOpenDetailsModal = (order) => {
    setSelectedOrder(order);
    setOpenDetailsModal(true);
    handleCloseMenu();
  };

  const handleCloseCancelModal = () => {
    setOpenCancelModal(false);
    setSelectedOrder(null);
    setCancellationReason("");
    setCustomReason("");
  };

  const handleCloseTrackingModal = () => {
    setOpenTrackingModal(false);
    setSelectedOrder(null);
  };

  const handleCloseDetailsModal = () => {
    setOpenDetailsModal(false);
    setSelectedOrder(null);
  };

  const handleMenuOpen = (event, orderId) => {
    setAnchorEl(event.currentTarget);
    setMenuOrderId(orderId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuOrderId(null);
  };

  const handleCancelOrder = async () => {
    if (!cancellationReason) {
      toast.error("Please select or enter a cancellation reason");
      return;
    }

    const reason = cancellationReason === "Other" ? customReason : cancellationReason;
    if (!reason) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.cancelOrder,
        data: {
          orderId: selectedOrder.orderId,
          cancellationReason: reason,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchOrders();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    } finally {
      handleCloseCancelModal();
    }
  };

  return (
    <div className="p-4">
      <div className="bg-white shadow-md p-4 rounded-md mb-4">
        <h1 className="text-lg font-semibold text-gray-800">My Orders</h1>
      </div>

      {!orders.length ? (
        <NoData />
      ) : (
        <div className="grid gap-4">
          {orders.map((order, index) => (
            <div
              key={order._id + index + "order"}
              className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow border border-gray-100 relative"
            >
              <div className="mb-2 text-sm text-gray-600">
                <span className="font-medium text-gray-800">Order No:</span>{" "}
                {order?.orderId || "N/A"}
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={order?.product_details?.image?.[0] || "/placeholder.jpg"}
                  alt={order?.product_details?.name || "Product"}
                  className="w-16 h-16 object-cover rounded border"
                />
                <div>
                  <h2 className={`font-semibold text-gray-800 text-sm sm:text-base ${
                    order.isCancelled ? "line-through text-gray-500" : ""
                  }`}>
                    {order?.product_details?.name || "N/A"}
                  </h2>
                  <p className="text-gray-500 text-sm flex items-center gap-2">
                    <span>Price: ₹{order?.totalAmt || 0}</span> | 
                    <span>Quantity: {order?.quantity || 1}</span> | 
                    <Chip
                      label={order?.tracking_status || "Unknown"}
                      icon={getStatusIcon(order?.tracking_status)}
                      sx={{
                        ...getStatusStyles(order?.tracking_status),
                        fontSize: "0.75rem",
                        fontWeight: "medium",
                        height: "24px",
                        borderRadius: "999px",
                        "& .MuiChip-icon": {
                          color: "inherit",
                          marginLeft: "4px"
                        }
                      }}
                    />
                  </p>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-500">
                <p>Payment: {order?.payment_status || "N/A"}</p>
                <p>
                  Address:{" "}
                  {order?.delivery_address
                    ? `${order.delivery_address.address_line || "N/A"}, ${
                        order.delivery_address.city || "N/A"
                      }, ${order.delivery_address.state || "N/A"}, ${
                        order.delivery_address.pincode || "N/A"
                      }`
                    : "No address available"}
                </p>
                {order?.isCancelled && (
                  <p className="text-red-500">
                    Cancelled: {order.cancellationReason || "N/A"} on{" "}
                    {order.cancellationDate
                      ? new Date(order.cancellationDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                )}
              </div>

              <IconButton
                aria-controls={menuOrderId === order._id ? "order-menu" : undefined}
                aria-haspopup="true"
                onClick={(event) => handleMenuOpen(event, order._id)}
                sx={{ position: "absolute", top: 16, right: 16 }}
              >
                <MoreVertical size={20} />
              </IconButton>

              <Menu
                id="order-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl) && menuOrderId === order._id}
                onClose={handleCloseMenu}
              >
                {!order?.isCancelled && (
                  <MenuItem onClick={() => handleOpenCancelModal(order)}>
                    <X size={16} className="mr-1" />
                    Cancel Order
                  </MenuItem>
                )}
                <MenuItem onClick={() => handleOpenTrackingModal(order)}>
                  <Truck size={16} className="mr-1" />
                  View Tracking
                </MenuItem>
                <MenuItem onClick={() => handleOpenDetailsModal(order)}>
                  <Info size={16} className="mr-1" />
                  Details
                </MenuItem>
              </Menu>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Modal */}
      <Dialog
        open={openCancelModal}
        onClose={handleCloseCancelModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <div className="flex items-center gap-2">
            <AlertOctagon size={20} className="text-red-500" />
            Cancel Order #{selectedOrder?.orderId || "N/A"}
          </div>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Why do you want to cancel this order?
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
            >
              <FormControlLabel
                value="Changed my mind"
                control={<Radio />}
                label="Changed my mind"
              />
              <FormControlLabel
                value="Found a better alternative"
                control={<Radio />}
                label="Found a better alternative"
              />
              <FormControlLabel
                value="Order placed by mistake"
                control={<Radio />}
                label="Order placed by mistake"
              />
              <FormControlLabel value="Other" control={<Radio />} label="Other" />
            </RadioGroup>
            {cancellationReason === "Other" && (
              <TextField
                fullWidth
                label="Please specify"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                margin="normal"
                variant="outlined"
              />
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelModal} color="inherit">
            Close
          </Button>
          <Button
            onClick={handleCancelOrder}
            color="error"
            startIcon={<X size={18} />}
            disabled={!selectedOrder}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Tracking Modal */}
      {selectedOrder && (
        <UserTrackingModal
          open={openTrackingModal}
          handleClose={handleCloseTrackingModal}
          order={selectedOrder}
        />
      )}

      {/* Details Modal */}
      <Dialog className="font-outfit"
        open={openDetailsModal}
        onClose={handleCloseDetailsModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          py: 2
        }}>
          <Info size={20} />
          <span>Order Details</span>
          <Chip
            label={selectedOrder?.tracking_status || "Unknown"}
            icon={getStatusIcon(selectedOrder?.tracking_status)}
            sx={{ 
              ...getStatusStyles(selectedOrder?.tracking_status),
              ml: 'auto',
              fontWeight: 'medium',
              "& .MuiChip-icon": {
                color: "inherit",
                marginLeft: "4px"
              }
            }}
          />
        </DialogTitle>
        
        <DialogContent dividers sx={{ p: 0 }}>
          {selectedOrder ? (
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
              {/* Left Column - Product Info */}
              <Box sx={{ 
                flex: 1, 
                p: 3, 
                borderRight: { md: '1px solid' },
                borderColor: { md: 'divider' }
              }}>
                <Typography variant="h6" sx={{ 
                  mb: 2, 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'primary.main'
                }}>
                  <ShoppingBag size={18} />
                  Product Info
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                  <img
                    src={selectedOrder.product_details?.image?.[0] || "/placeholder.jpg"}
                    alt={selectedOrder.product_details?.name || "Product"}
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: 'contain',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0'
                    }}
                  />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'light' }}>
                      {selectedOrder.product_details?.name || "N/A"}
                    </Typography>
                    <Typography sx={{ mt: 1, fontWeight: 'light' }}>
                      <b >Quantity:</b> {selectedOrder.quantity || 1}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Order Summary
                  </Typography>
                  <Box sx={{ 
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    p: 2
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Subtotal:</Typography>
                      <Typography>₹{selectedOrder.totalAmt || 0}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Shipping:</Typography>
                      <Typography>Free</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                      <Typography>Total:</Typography>
                      <Typography>₹{selectedOrder.totalAmt || 0}</Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Payment Info
                  </Typography>
                  <Chip
                    label={selectedOrder.payment_status?.toUpperCase() || "N/A"}
                    sx={{ 
                      backgroundColor: selectedOrder.payment_status === 'paid' ? '#4caf50' : '#f44336',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
              </Box>
              
              {/* Right Column - User & Shipping Info */}
              <Box sx={{ flex: 1, p: 3 }}>
                
                <Typography variant="h6" sx={{ 
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'primary.main'
                }}>
                  <Truck size={18} />
                  Shipping Info
                </Typography>
                
                {selectedOrder.delivery_address ? (
                  <Box sx={{ 
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    p: 2
                  }}>
                    
                    <Typography sx={{ fontWeight: 'medium', mb: 1 }}>
                    </Typography>
                    <Typography sx={{ mb: 1 }}> {selectedOrder.userId?.name || selectedOrder.userName || "N/A"}
                  </Typography>
                    <Typography>
                      {selectedOrder.delivery_address.address_line || "N/A"}
                    </Typography>
                    <Typography>
                      {selectedOrder.delivery_address.city || "N/A"}, 
                      {selectedOrder.delivery_address.state || "N/A"} - 
                      {selectedOrder.delivery_address.pincode || "N/A"}
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ 
                    backgroundColor: '#fff8e1',
                    borderRadius: '8px',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <AlertTriangle size={16} className="text-yellow-600" />
                    <Typography>No shipping address available</Typography>
                  </Box>
                )}
                
                {selectedOrder?.isCancelled && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ 
                      backgroundColor: '#ffebee',
                      borderRadius: '8px',
                      p: 2
                    }}>
                      <Typography sx={{ 
                        fontWeight: 'medium', 
                        mb: 1,
                        color: '#d32f2f',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <AlertCircle size={16} />
                        Order Cancelled
                      </Typography>
                      <Typography>
                        <b>Reason:</b> {selectedOrder.cancellationReason || "N/A"}
                      </Typography>
                      <Typography>
                        <b>Date:</b> {selectedOrder.cancellationDate ? 
                          new Date(selectedOrder.cancellationDate).toLocaleString() : "N/A"}
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
            </Box>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              p: 4,
              textAlign: 'center'
            }}>
              <AlertCircle size={48} className="text-red-500 mb-2" />
              <Typography variant="h6" color="textSecondary">
                No order details available
              </Typography>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button 
          color="error"
            onClick={handleCloseDetailsModal} 
            startIcon={<X size={18} />}
          >
            Close
          </Button>
          
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MyOrders;