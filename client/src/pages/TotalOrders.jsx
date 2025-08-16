// frontend/src/pages/TotalOrders.jsx
import React, { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

const TotalOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.order);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [openTracking, setOpenTracking] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOrderId, setMenuOrderId] = useState(null);

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

  const handleMenuOpen = (event, orderId) => {
    setAnchorEl(event.currentTarget);
    setMenuOrderId(orderId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuOrderId(null);
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="p-4">
      <div className="bg-white shadow-md p-4 rounded-md mb-4">
        <Typography variant="h6" className="text-lg font-semibold text-gray-800">
          Total Orders
        </Typography>
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
                  <p className="text-gray-500 text-sm">
                    Price: ₹{order.totalAmt} | Status: {order.tracking_status}
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
              </Menu>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <InvoiceModal open={openInvoice} handleClose={() => setOpenInvoice(false)} order={selectedOrder} />
      )}
      {selectedOrder && (
        <TrackingModal
          open={openTracking}
          handleClose={() => setOpenTracking(false)}
          order={selectedOrder}
          onUpdate={fetchAllOrders}
        />
      )}
    </div>
  );
};

export default TotalOrders;