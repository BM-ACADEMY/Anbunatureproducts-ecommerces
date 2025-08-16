import React, { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { setOrder } from "../store/orderSlice";
import NoData from "../components/NoData";
import toast from "react-hot-toast";
import InvoiceModal from "../components/InvoiceComponent";
import TrackingModal from "../components/TrackingModal";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Chip,
} from "@mui/material";

const AllOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.order);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [openTracking, setOpenTracking] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOrderId, setMenuOrderId] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [inputName, setInputName] = useState("");

  const fetchAllOrders = async () => {
    try {
      const response = await Axios(SummaryApi.allOrders);
      if (response.data.success) {
        dispatch(setOrder(response.data.data));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    }
  };

  const handleOpenInvoice = (order) => {
    setSelectedOrder(order);
    setOpenInvoice(true);
    handleCloseMenu();
  };

  const handleOpenTracking = (order) => {
    setSelectedOrder(order);
    setOpenTracking(true);
    handleCloseMenu();
  };

  const handleCloseInvoice = () => {
    setOpenInvoice(false);
    setSelectedOrder(null);
  };

  const handleCloseTracking = () => {
    setOpenTracking(false);
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

  const handleDeleteOrder = (order) => {
    setOrderToDelete(order);
    setOpenConfirm(true);
    setInputName("");
    handleCloseMenu();
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;

    if (inputName.trim().toLowerCase() !== orderToDelete.userId.name.toLowerCase()) {
      toast.error("The entered name does not match the user's name");
      return;
    }

    try {
      const response = await Axios.delete(`${SummaryApi.deleteOrder.url}/${orderToDelete.orderId}`);
      if (response.data.success) {
        toast.success("Order deleted successfully");
        fetchAllOrders();
        setOpenConfirm(false);
        setOrderToDelete(null);
        setInputName("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete order");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Define badge colors based on tracking_status
  const getStatusStyles = (status) => {
    switch (status) {
      case "Delivered":
        return {
          bgcolor: "#16a34a", // green-600
          color: "#ffffff",
        };
      case "Pending":
        return {
          bgcolor: "#f59e0b", // amber-500
          color: "#ffffff",
        };
      case "Processing":
        return {
          bgcolor: "#3b82f6", // blue-500
          color: "#ffffff",
        };
      case "Shipped":
        return {
          bgcolor: "#8b5cf6", // purple-500
          color: "#ffffff",
        };
      case "Cancelled":
        return {
          bgcolor: "#ef4444", // red-500
          color: "#ffffff",
        };
      default:
        return {
          bgcolor: "#6b7280", // gray-500
          color: "#ffffff",
        };
    }
  };

  return (
    <div className="p-4">
      <div className="bg-white shadow-md p-4 rounded-md mb-4">
        <h1 className="text-lg font-semibold text-gray-800">All Orders</h1>
      </div>

      {!orders?.length ? (
        <NoData />
      ) : (
        <div className="grid gap-4">
          {orders.map((order, index) => (
            <div
              key={order._id + index + "order"}
              className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow border border-gray-100 relative"
            >
              <div className="mb-2 text-sm text-gray-600">
                <span className="font-medium text-gray-800">User:</span> {order?.userId?.name}
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={order.product_details.image[0]}
                  alt={order.product_details.name}
                  className="w-16 h-16 object-cover rounded border"
                />
                <div>
                  <h2
                    className={`font-semibold text-gray-800 text-sm sm:text-base ${
                      order.isCancelled ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {order.product_details.name}
                  </h2>
                  <p className="text-gray-500 text-sm flex items-center gap-2">
                    <span>Price: ₹{order.totalAmt}</span> | 
                    <span>Quantity: {order.quantity}</span> | 
                    <Chip
                      label={order.tracking_status}
                      sx={{
                        ...getStatusStyles(order.tracking_status),
                        fontSize: '0.75rem',
                        fontWeight: 'medium',
                        height: '24px',
                        borderRadius: '999px',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          opacity: 0.9,
                        },
                      }}
                    />
                  </p>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-500">
                <p>Payment: {order.payment_status}</p>
                {order.isCancelled && (
                  <p className="text-red-500">
                    Cancelled: {order.cancellationReason} on{" "}
                    {new Date(order.cancellationDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              <IconButton
                aria-controls={menuOrderId === order._id ? "order-menu" : undefined}
                aria-haspopup="true"
                onClick={(event) => handleMenuOpen(event, order._id)}
                sx={{ position: "absolute", top: 16, right: 16 }}
              >
                <MoreVertIcon />
              </IconButton>

              <Menu
                id="order-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl) && menuOrderId === order._id}
                onClose={handleCloseMenu}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem onClick={() => handleOpenInvoice(order)}>
                  <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
                  View Invoice
                </MenuItem>
                <MenuItem onClick={() => handleOpenTracking(order)}>
                  <TrackChangesIcon fontSize="small" sx={{ mr: 1 }} />
                  Update Tracking
                </MenuItem>
                <MenuItem onClick={() => handleDeleteOrder(order)}>
                  <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                  Delete Order
                </MenuItem>
              </Menu>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <InvoiceModal open={openInvoice} handleClose={handleCloseInvoice} order={selectedOrder} />
      )}
      {selectedOrder && (
        <TrackingModal
          open={openTracking}
          handleClose={handleCloseTracking}
          order={selectedOrder}
          onUpdate={fetchAllOrders}
        />
      )}

      <Dialog
        open={openConfirm}
        onClose={() => {
          setOpenConfirm(false);
          setInputName("");
          setOrderToDelete(null);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Order Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            To delete the order for user "{orderToDelete?.userId?.name}", please type their name below. This action cannot be undone.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="User Name"
            type="text"
            fullWidth
            variant="outlined"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenConfirm(false);
              setInputName("");
              setOrderToDelete(null);
            }}
          >
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" disabled={!inputName.trim()}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AllOrders;