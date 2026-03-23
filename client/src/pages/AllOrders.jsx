import React, { useEffect, useState, useRef } from "react";
import { FiMoreVertical, FiEye, FiTrash2, FiActivity, FiSearch, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { setOrder } from "../store/orderSlice";
import NoData from "../components/NoData";
import { toast } from "sonner";
import InvoiceModal from "../components/InvoiceComponent";
import TrackingModal from "../components/TrackingModal";

const AllOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.order);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [openTracking, setOpenTracking] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [menuOrderId, setMenuOrderId] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [inputName, setInputName] = useState("");
  const dropdownRef = useRef(null);

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
    setMenuOrderId(null);
  };

  const handleOpenTracking = (order) => {
    setSelectedOrder(order);
    setOpenTracking(true);
    setMenuOrderId(null);
  };

  const handleCloseInvoice = () => {
    setOpenInvoice(false);
    setSelectedOrder(null);
  };

  const handleCloseTracking = () => {
    setOpenTracking(false);
    setSelectedOrder(null);
  };

  const handleMenuToggle = (orderId) => {
    setMenuOrderId(menuOrderId === orderId ? null : orderId);
  };

  const handleDeleteOrder = (order) => {
    setOrderToDelete(order);
    setOpenConfirm(true);
    setInputName("");
    setMenuOrderId(null);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOrderId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStatusClasses = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "Pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Processing":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Shipped":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">All Orders</h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">Manage and track all customer orders</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
          <span className="font-bold text-gray-900">{orders?.length || 0}</span>
          <span>Orders Found</span>
        </div>
      </div>

      {!orders?.length ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100">
          <NoData />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order, index) => (
            <div
              key={order._id + index + "order"}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 p-5 relative group"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Product Image */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
                  <img
                    src={order.product_details.image[0]}
                    alt={order.product_details.name}
                    className="w-full h-full object-cover rounded-xl border border-gray-100 shadow-sm"
                  />
                  {order.isCancelled && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-xl flex items-center justify-center">
                      <span className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg shadow-lg">Cancelled</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h2 className={`text-lg font-bold text-gray-900 ${order.isCancelled ? "line-through opacity-50" : ""}`}>
                      {order.product_details.name}
                    </h2>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusClasses(order.tracking_status)}`}>
                      {order.tracking_status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="text-gray-400 font-medium flex items-center gap-2">
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        Customer
                      </p>
                      <p className="text-gray-900 font-bold">{order?.userId?.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-400 font-medium flex items-center gap-2">
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        Order Details
                      </p>
                      <p className="text-gray-900 font-bold">₹{order.totalAmt} • Qty: {order.quantity}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-400 font-medium flex items-center gap-2">
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        Payment
                      </p>
                      <p className="text-gray-900 font-bold uppercase">{order.payment_status}</p>
                    </div>
                  </div>

                  {order.isCancelled && (
                    <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                      <p className="text-xs text-red-700 font-medium">
                        <span className="font-bold">Reason:</span> {order.cancellationReason}
                      </p>
                      <p className="text-[10px] text-red-500 mt-0.5">
                        Cancelled on {new Date(order.cancellationDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions Button */}
                <div className="absolute top-5 right-5" ref={menuOrderId === order._id ? dropdownRef : null}>
                  <button
                    onClick={() => handleMenuToggle(order._id)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
                  >
                    <FiMoreVertical size={20} />
                  </button>

                  {/* Dropdown Menu */}
                  {menuOrderId === order._id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-zoom-in">
                      <button
                        onClick={() => handleOpenInvoice(order)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                      >
                        <FiEye className="text-blue-500" />
                        View Invoice
                      </button>
                      <button
                        onClick={() => handleOpenTracking(order)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                      >
                        <FiActivity className="text-purple-500" />
                        Update Tracking
                      </button>
                      <div className="my-1 border-t border-gray-50"></div>
                      <button
                        onClick={() => handleDeleteOrder(order)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
                      >
                        <FiTrash2 />
                        Delete Order
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deletion Confirmation Modal */}
      {openConfirm && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpenConfirm(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-zoom-in">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center shadow-inner">
                <FiTrash2 size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">Confirm Deletion</h3>
                <p className="text-sm text-gray-500 leading-relaxed text-balance">
                  To delete the order for user <span className="font-bold text-gray-900">"{orderToDelete?.userId?.name}"</span>, please type their name below to confirm.
                </p>
              </div>

              <div className="w-full">
                <input
                  autoFocus
                  type="text"
                  placeholder="Type customer name..."
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-red-500 focus:bg-white rounded-xl outline-none transition-all font-medium text-gray-900 text-center"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                />
              </div>

              <div className="flex w-full gap-3 pt-4">
                <button
                  onClick={() => setOpenConfirm(false)}
                  className="flex-1 px-4 py-3 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  disabled={inputName.trim().toLowerCase() !== orderToDelete?.userId?.name?.toLowerCase()}
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-red-100 transition-all active:scale-95"
                >
                  Delete Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedOrder && openInvoice && (
        <InvoiceModal open={openInvoice} handleClose={handleCloseInvoice} order={selectedOrder} />
      )}
      {selectedOrder && openTracking && (
        <TrackingModal
          open={openTracking}
          handleClose={handleCloseTracking}
          order={selectedOrder}
          onUpdate={fetchAllOrders}
        />
      )}
    </div>
  );
};

export default AllOrders;