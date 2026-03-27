import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import NoData from "../components/NoData";
import { 
  FiInfo, 
  FiX, 
  FiMoreVertical, 
  FiTruck, 
  FiShoppingBag, 
  FiAlertCircle,
  FiCheck,
  FiClock,
  FiPackage,
  FiRotateCcw,
  FiMapPin,
  FiCreditCard,
  FiAlertOctagon,
  FiChevronRight,
  FiEye
} from 'react-icons/fi';
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { toast } from "sonner";
import { setOrder } from "../store/orderSlice";
import UserTrackingModal from "../components/UserTrackingModal";
import Breadcrumbs from "../components/Breadcrumbs";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orders = useSelector((state) => state.orders.order || []);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [openTrackingModal, setOpenTrackingModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [menuOrderId, setMenuOrderId] = useState(null);

  // Grouping logic
  const groupedOrders = orders.reduce((acc, order) => {
    const gid = order.groupId || order.orderId; // Fallback to orderId for legacy
    if (!acc[gid]) {
      acc[gid] = {
        groupId: gid,
        items: [],
        createdAt: order.createdAt,
        totalAmt: 0,
        status: order.tracking_status,
        address: order.delivery_address,
        payment_status: order.payment_status,
        orderId: order.orderId, // Keep one for display if needed
      };
    }
    acc[gid].items.push(order);
    acc[gid].totalAmt += order.totalAmt;
    // Use the most "advanced" status if multiple items have different statuses? 
    // Usually they'd be the same for a group initially.
    return acc;
  }, {});

  const sortedGroupedOrders = Object.values(groupedOrders).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

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

  const getStatusConfig = (status) => {
    switch (status) {
      case "Delivered":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-600",
          border: "border-emerald-100",
          icon: <FiCheck size={14} />
        };
      case "Pending":
        return {
          bg: "bg-amber-50",
          text: "text-amber-600",
          border: "border-amber-100",
          icon: <FiClock size={14} />
        };
      case "Processing":
        return {
          bg: "bg-indigo-50",
          text: "text-indigo-600",
          border: "border-indigo-100",
          icon: <FiRotateCcw size={14} />
        };
      case "Shipped":
        return {
          bg: "bg-blue-50",
          text: "text-blue-600",
          border: "border-blue-100",
          icon: <FiTruck size={14} />
        };
      case "Cancelled":
        return {
          bg: "bg-rose-50",
          text: "text-rose-600",
          border: "border-rose-100",
          icon: <FiX size={14} />
        };
      default:
        return {
          bg: "bg-slate-50",
          text: "text-slate-600",
          border: "border-slate-100",
          icon: <FiPackage size={14} />
        };
    }
  };

  const handleOpenCancelModal = (order) => {
    if (order.tracking_status === "Shipped" || order.tracking_status === "Delivered" || order.isCancelled) {
      toast.error("Cannot cancel this order");
      return;
    }
    setSelectedOrder(order);
    setOpenCancelModal(true);
    setMenuOrderId(null);
  };

  const handleOpenTrackingModal = (order) => {
    setSelectedOrder(order);
    setOpenTrackingModal(true);
    setMenuOrderId(null);
  };

  const handleOpenDetailsModal = (order) => {
    setSelectedOrder(order);
    setOpenDetailsModal(true);
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
      setOpenCancelModal(false);
      setSelectedOrder(null);
      setCancellationReason("");
      setCustomReason("");
    }
  };

  return (
    <div className="bg-[#fcf8ed] min-h-screen py-8">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="mb-6">
          <Breadcrumbs />
        </div>
        
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Orders</h1>
            <p className="text-gray-500 mt-1 font-medium">Track and manage your recent purchases</p>
          </div>
        </div>

        {!sortedGroupedOrders.length ? (
          <NoData />
        ) : (
          <div className="space-y-6">
            {sortedGroupedOrders.map((group, index) => {
              const mainOrder = group.items[0];
              const status = getStatusConfig(group.status);
              const itemCount = group.items.length;
              
              return (
                <div
                  key={group.groupId + index}
                  onClick={() => navigate(`/order-details/${group.groupId}`)}
                  className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100">
                        <FiShoppingBag className="text-indigo-600" size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Order ID</p>
                        <h3 className="text-sm font-extrabold text-gray-900 mt-1">#{group.groupId.slice(-12).toUpperCase()}</h3>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Status</p>
                            <div className={`mt-1 flex items-center gap-2 px-3 py-1 rounded-full border ${status.bg} ${status.text} ${status.border} text-[10px] font-bold uppercase tracking-wider`}>
                                {status.icon}
                                <span>{group.status}</span>
                            </div>
                        </div>
                        <FiChevronRight className="text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" size={20} />
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex -space-x-4 overflow-hidden">
                        {group.items.slice(0, 3).map((item, idx) => (
                           <div key={idx} className="relative w-20 h-20 bg-white rounded-2xl border-2 border-white shadow-md p-1.5 flex-shrink-0 z-[idx]">
                                <img
                                src={item?.product_details?.image?.[0] || "/placeholder.jpg"}
                                alt={item?.product_details?.name || "Product"}
                                className={`w-full h-full object-scale-down rounded-xl ${item.isCancelled ? "grayscale opacity-50" : ""}`}
                                />
                                {idx === 2 && itemCount > 3 && (
                                    <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center text-white text-xs font-bold">
                                        +{itemCount - 2}
                                    </div>
                                )}
                           </div>
                        ))}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-gray-900 truncate">
                          {mainOrder?.product_details?.name || "N/A"}
                          {itemCount > 1 && <span className="text-gray-400 ml-2 font-medium">and {itemCount - 1} more items</span>}
                        </h2>
                        <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900">
                            <span className="text-xs text-gray-400 font-medium">Total Amount:</span>
                            <span className="text-lg">₹{group.totalAmt?.toLocaleString() || 0}</span>
                          </div>
                          <div className="flex items-center gap-1.5 font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl text-xs">
                            <FiCreditCard size={14} />
                            <span className="uppercase tracking-widest">{group.payment_status || "N/A"}</span>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-xs text-gray-400 font-medium">
                           <FiClock size={14} />
                           <span>Placed on {new Date(group.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>

                      <div className="flex items-center">
                         <div className="px-6 py-3 bg-[#1d9963] text-white rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-[#168050] transition-colors flex items-center gap-2">
                            <FiEye size={16} />
                            View Details
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {openCancelModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setOpenCancelModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 z-10 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                <FiAlertOctagon size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Cancel Order</h3>
                <p className="text-sm text-gray-400 font-medium tracking-tight">Order #{selectedOrder?.orderId}</p>
              </div>
            </div>

            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Reason for cancellation</p>
            <div className="space-y-3">
              {["Changed my mind", "Found a better alternative", "Order placed by mistake", "Other"].map((reason) => (
                <label 
                  key={reason} 
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border cursor-pointer transition-all ${
                    cancellationReason === reason 
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-bold ring-2 ring-indigo-500/10" 
                    : "bg-gray-50 border-gray-100 text-gray-500 hover:bg-white hover:border-gray-200"
                  }`}
                >
                  <input 
                    type="radio" 
                    name="cancellation" 
                    className="hidden" 
                    value={reason} 
                    onChange={(e) => setCancellationReason(e.target.value)} 
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                     cancellationReason === reason ? "border-indigo-600 bg-indigo-600" : "border-gray-300"
                  }`}>
                    {cancellationReason === reason && <div className="w-2 h-2 rounded-full bg-white shadow-sm" />}
                  </div>
                  <span className="text-sm">{reason}</span>
                </label>
              ))}
            </div>

            {cancellationReason === "Other" && (
              <textarea
                placeholder="Please describe why you are cancelling..."
                className="w-full mt-4 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm outline-none focus:bg-white focus:border-indigo-500 transition-all resize-none h-24"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            )}

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setOpenCancelModal(false)}
                className="flex-1 px-6 py-3 text-sm font-bold text-gray-400 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all"
              >
                Go Back
              </button>
              <button
                onClick={handleCancelOrder}
                className="flex-1 px-6 py-3 text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-2xl shadow-lg shadow-rose-100 transition-all active:scale-95"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {openDetailsModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setOpenDetailsModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden z-10 animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <FiInfo size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Order Information</h3>
              </div>
              <button onClick={() => setOpenDetailsModal(false)} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                <FiX size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Product Section */}
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3">Product Details</p>
                    <div className="flex gap-6">
                      <div className="w-24 h-24 bg-gray-50 rounded-2xl border border-gray-100 p-3 flex-shrink-0">
                        <img
                          src={selectedOrder.product_details?.image?.[0] || "/placeholder.jpg"}
                          alt={selectedOrder.product_details?.name || "Product"}
                          className="w-full h-full object-scale-down"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-gray-900 leading-tight">{selectedOrder.product_details?.name}</h4>
                        <div className="mt-3 flex items-center gap-4">
                          <div className="text-xs bg-gray-50 px-2 py-1 rounded-lg">
                            <span className="text-gray-400 font-medium">Qty:</span>
                            <span className="ml-1 text-gray-900 font-bold">{selectedOrder.quantity || 1}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="border-gray-50" />

                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Pricing Summary</p>
                    <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400 font-medium">Subtotal</span>
                        <span className="text-gray-900 font-bold">₹{selectedOrder.totalAmt?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-emerald-500 font-bold">
                        <span>Shipping</span>
                        <span>FREE</span>
                      </div>
                      <div className="pt-3 border-t border-gray-100 flex justify-between">
                        <span className="text-gray-900 font-extrabold">Total Amount</span>
                        <span className="text-lg font-black text-indigo-600 font-mono tracking-tight">₹{selectedOrder.totalAmt?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Section */}
                <div className="space-y-8">
                   <div className="space-y-4">
                      <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Delivery Address</p>
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                          <FiMapPin size={20} />
                        </div>
                        <div className="text-sm leading-relaxed">
                          <p className="text-gray-900 font-bold mb-1">{selectedOrder.userId?.name || selectedOrder.userName || "Customer"}</p>
                          <p className="text-gray-500 font-medium">{selectedOrder.delivery_address?.address_line}</p>
                          <p className="text-gray-500 font-medium">{selectedOrder.delivery_address?.city}, {selectedOrder.delivery_address?.state}</p>
                          <p className="text-gray-900 font-bold mt-1 tracking-wider">{selectedOrder.delivery_address?.pincode}</p>
                        </div>
                      </div>
                   </div>

                   <hr className="border-gray-50" />

                   <div className="space-y-4">
                      <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Status Overview</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Tracking</p>
                          <p className="text-sm font-bold text-indigo-500 mt-1">{selectedOrder.tracking_status}</p>
                        </div>
                        <div className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Payment</p>
                          <p className={`text-sm font-bold mt-1 capitalize ${selectedOrder.payment_status === 'paid' ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {selectedOrder.payment_status}
                          </p>
                        </div>
                      </div>
                   </div>

                   {selectedOrder?.isCancelled && (
                     <div className="p-5 bg-rose-50 rounded-2xl border border-rose-100 space-y-2">
                       <div className="flex items-center gap-2 text-rose-600">
                         <FiAlertCircle size={18} />
                         <span className="text-xs font-bold uppercase tracking-widest">Cancellation Info</span>
                       </div>
                       <p className="text-sm text-rose-900 font-medium italic leading-relaxed">"{selectedOrder.cancellationReason}"</p>
                       <p className="text-[10px] text-rose-300 font-bold uppercase mt-2">Date: {new Date(selectedOrder.cancellationDate).toLocaleString()}</p>
                     </div>
                   )}
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-end">
              <button 
                onClick={() => setOpenDetailsModal(false)}
                className="px-8 py-3 bg-white border border-gray-200 hover:border-indigo-200 text-gray-600 hover:text-indigo-600 font-bold text-sm rounded-2xl shadow-sm transition-all active:scale-95"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {selectedOrder && (
        <UserTrackingModal
          open={openTrackingModal}
          handleClose={() => setOpenTrackingModal(false)}
          order={selectedOrder}
        />
      )}
    </div>
  );
};

export default MyOrders;
