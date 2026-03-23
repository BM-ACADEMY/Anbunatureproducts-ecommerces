// frontend/src/pages/TotalOrders.jsx
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { setOrder } from "../store/orderSlice";
import NoData from "../components/NoData";
import { toast } from "sonner";
import InvoiceModal from "../components/InvoiceComponent";
import TrackingModal from "../components/TrackingModal";
import { FiMoreVertical, FiEye, FiTruck, FiUser, FiPackage, FiCheckCircle, FiXCircle, FiClock, FiCreditCard } from "react-icons/fi";

const TotalOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.order);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [openTracking, setOpenTracking] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const dropdownRef = useRef({});

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
    setMenuOpenId(null);
  };

  const handleOpenTracking = (order) => {
    setSelectedOrder(order);
    setOpenTracking(true);
    setMenuOpenId(null);
  };

  useEffect(() => {
    fetchAllOrders();
    
    const handleClickOutside = (event) => {
      if (menuOpenId && dropdownRef.current[menuOpenId] && !dropdownRef.current[menuOpenId].contains(event.target)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpenId]);

  return (
    <div className="bg-white min-h-full">
      <div className="mb-8 p-1">
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">System Orders</h1>
        <p className="text-gray-500 mt-1 font-medium">Global view of all customer transactions</p>
      </div>

      {!orders?.length ? (
        <NoData />
      ) : (
        <div className="grid gap-6">
          {orders.map((order, index) => (
            <div
              key={order._id + index + "order"}
              className={`group relative bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 ${
                order.isCancelled ? "opacity-75" : ""
              }`}
            >
              {/* User Info Header */}
              <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50/50 rounded-2xl border border-gray-50">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                  <FiUser size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Customer</div>
                  <div className="font-bold text-gray-900 text-sm mt-0.5">{order?.userId?.name || "Guest User"}</div>
                </div>
                <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-white rounded-lg border border-gray-100 shadow-sm">
                   <FiClock className="text-gray-400" size={12} />
                   <span className="text-[10px] font-black text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                   </span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="relative w-24 h-24 shrink-0">
                  <img
                    src={order.product_details.image[0]}
                    alt={order.product_details.name}
                    className="w-full h-full object-cover rounded-2xl shadow-sm border border-gray-100"
                  />
                  <div className="absolute -top-2 -right-2 bg-indigo-600 text-white w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black shadow-lg shadow-indigo-100">
                    x1
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h2
                      className={`font-black text-gray-900 text-lg tracking-tight truncate ${
                        order.isCancelled ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {order.product_details.name}
                    </h2>
                    {order.isCancelled ? (
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-500 text-[10px] font-black uppercase rounded-md flex items-center gap-1 border border-rose-100">
                        <FiXCircle size={10} /> Cancelled
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-md flex items-center gap-1 border border-emerald-100">
                        <FiCheckCircle size={10} /> Active
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Amount</div>
                      <div className="text-gray-900 font-black text-lg">₹{order.totalAmt}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tracking</div>
                      <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-sm">
                        <FiTruck size={14} />
                        {order.tracking_status}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment</div>
                      <div className={`text-sm font-bold flex items-center gap-1.5 ${order.payment_status === 'paid' ? 'text-emerald-600' : 'text-amber-500'}`}>
                        <FiCreditCard size={14} />
                        {order.payment_status}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</div>
                      <div className="text-[11px] font-mono text-gray-400 truncate">#{order._id.slice(-8).toUpperCase()}</div>
                    </div>
                  </div>
                </div>
              </div>

              {order.isCancelled && (
                <div className="mt-6 p-4 bg-rose-50/50 border border-rose-50 rounded-2xl flex items-start gap-3">
                  <FiAlertCircle className="text-rose-500 mt-0.5" size={18} />
                  <div>
                    <div className="text-xs font-black text-rose-500 uppercase tracking-widest">Cancellation Detail</div>
                    <p className="text-sm font-bold text-gray-600 mt-1">
                      {order.cancellationReason} <span className="text-gray-400 font-medium">on {new Date(order.cancellationDate).toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Action Dropdown */}
              <div className="absolute top-6 right-6" ref={el => dropdownRef.current[order._id] = el}>
                <div className="relative">
                  <button
                    onClick={() => setMenuOpenId(menuOpenId === order._id ? null : order._id)}
                    className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-white hover:shadow-lg transition-all active:scale-90"
                    aria-label="More options"
                  >
                    <FiMoreVertical size={20} />
                  </button>
                  {menuOpenId === order._id && (
                    <div className="absolute right-0 mt-3 w-52 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[50] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <button
                        onClick={() => handleOpenInvoice(order)}
                        className="flex items-center gap-3 w-full text-left px-5 py-3 text-sm font-bold text-gray-600 hover:bg-slate-50 transition-colors"
                      >
                        <FiEye className="text-indigo-500" size={18} />
                        View Invoice
                      </button>
                      <button
                        onClick={() => handleOpenTracking(order)}
                        className="flex items-center gap-3 w-full text-left px-5 py-3 text-sm font-bold text-gray-600 hover:bg-slate-50 transition-colors border-t border-gray-50"
                      >
                        <FiTruck className="text-amber-500" size={18} />
                        Update Tracking
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && openInvoice && (
        <InvoiceModal open={openInvoice} handleClose={() => setOpenInvoice(false)} order={selectedOrder} />
      )}
      {selectedOrder && openTracking && (
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