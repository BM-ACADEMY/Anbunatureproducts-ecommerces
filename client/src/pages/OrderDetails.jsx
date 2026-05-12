import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { 
  FiArrowLeft, 
  FiShoppingBag, 
  FiTruck, 
  FiInfo, 
  FiX, 
  FiClock, 
  FiCheck, 
  FiRotateCcw, 
  FiPackage,
  FiMapPin,
  FiCreditCard,
  FiAlertOctagon,
  FiAlertCircle,
  FiStar,
  FiActivity
} from 'react-icons/fi';
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { toast } from "sonner";
import Breadcrumbs from "../components/Breadcrumbs";
import UserTrackingModal from "../components/UserTrackingModal";
import { setOrder } from "../store/orderSlice";
import { FaCoins } from "react-icons/fa6";

const OrderDetails = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const allOrders = useSelector((state) => state.orders.order || []);
    const userRole = useSelector((state) => state.user.role);
    
    const [groupItems, setGroupItems] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openCancelModal, setOpenCancelModal] = useState(false);
    const [openTrackingModal, setOpenTrackingModal] = useState(false);
    const [openDetailsModal, setOpenDetailsModal] = useState(false);
    const [cancellationReason, setCancellationReason] = useState("");
    const [customReason, setCustomReason] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchAllOrders = async () => {
        try {
            const response = await Axios(SummaryApi.getOrderItems);
            if (response.data.success) {
                dispatch(setOrder(response.data.data));
            }
        } catch (error) {
            toast.error("Failed to refresh orders");
        }
    };

    useEffect(() => {
        const items = allOrders.filter(order => (order.groupId || order.orderId) === groupId);
        if (items.length > 0) {
            setGroupItems(items);
            setLoading(false);
        } else if (allOrders.length > 0) {
            // If not found in current state but we have orders, maybe it's invalid
            setLoading(false);
        } else {
            // If no orders in state, try to fetch
            fetchAllOrders();
        }
    }, [groupId, allOrders]);

    const getStatusConfig = (status) => {
        switch (status) {
            case "Delivered":
                return { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", icon: <FiCheck size={14} /> };
            case "Pending":
                return { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100", icon: <FiClock size={14} /> };
            case "Processing":
                return { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100", icon: <FiRotateCcw size={14} /> };
            case "Shipped":
                return { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", icon: <FiTruck size={14} /> };
            case "Cancelled":
                return { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100", icon: <FiX size={14} /> };
            default:
                return { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-100", icon: <FiPackage size={14} /> };
        }
    };

    const handleOpenCancelModal = (order) => {
        if (order.tracking_status === "Shipped" || order.tracking_status === "Delivered" || order.isCancelled) {
            toast.error("Cannot cancel this item");
            return;
        }
        setSelectedOrder(order);
        setOpenCancelModal(true);
    };

    const handleCancelOrder = async () => {
        if (!cancellationReason) {
            toast.error("Please select a reason");
            return;
        }
        const reason = cancellationReason === "Other" ? customReason : cancellationReason;
        try {
            const response = await Axios({
                ...SummaryApi.cancelOrder,
                data: { orderId: selectedOrder.orderId, cancellationReason: reason }
            });
            if (response.data.success) {
                toast.success("Item cancelled successfully");
                await fetchAllOrders();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to cancel");
        } finally {
            setOpenCancelModal(false);
            setSelectedOrder(null);
            setCancellationReason("");
            setCustomReason("");
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (groupItems.length === 0) {
        return (
            <div className="container mx-auto px-6 py-20 text-center">
                <FiAlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">Order not found</h2>
                <button onClick={() => navigate(userRole === "ADMIN" ? "/dashboard/allorders" : "/user/myorders")} className="mt-6 text-[#1d9963] font-bold hover:underline">Back to Orders</button>
            </div>
        );
    }

    const mainGroupInfo = groupItems[0];
    const totalAmount = groupItems.reduce((sum, item) => sum + item.totalAmt, 0);

    return (
    <div className="bg-[#fdf5e6] min-h-screen py-4 lg:py-10">
      <div className="container mx-auto px-4 lg:px-12 max-w-6xl">
        <div className="mb-4">
          <Breadcrumbs />
        </div>
        <div className="mb-6">
          <button 
            onClick={() => navigate(userRole === "ADMIN" ? "/dashboard/allorders" : "/user/myorders")}
            className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-semibold transition-all group"
          >
            <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-all">
              <FiArrowLeft size={14} />
            </div>
            <span className="text-xs uppercase tracking-wider">Back to Orders</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 border-b border-slate-100 pb-8">
            <div className="space-y-1.5 w-full lg:w-auto">
              <div className="flex items-center gap-2.5">
                <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600 flex-shrink-0">
                  <FiShoppingBag size={18} />
                </div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight truncate">Order #{groupId.slice(-10).toUpperCase()}</h1>
              </div>
              <p className="text-slate-400 text-xs font-medium pl-10">
                Placed on {new Date(mainGroupInfo.createdAt).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <div className="flex-1 lg:flex-none bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Summary</p>
                <p className="text-xs font-bold text-slate-700">{groupItems.length} Items</p>
              </div>
              <div className="flex-1 lg:flex-none bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mb-0.5">Payment</p>
                <p className="text-xs font-bold text-emerald-700">Verified</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2 px-1">
              <span>Items Summary</span>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">{groupItems.length}</span>
            </h2>
            
            <div className="grid gap-3">
              {groupItems.map((item) => {
                const status = getStatusConfig(item.tracking_status);
                return (
                  <div key={item._id} className="relative bg-white rounded-2xl border border-slate-100 p-3 sm:p-4 flex flex-col sm:flex-row gap-4 sm:gap-5 items-center sm:items-start hover:border-slate-200 transition-all group/item">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-xl p-2 flex-shrink-0 border border-slate-100 flex items-center justify-center">
                      <img 
                        src={item.product_details?.image?.[0] || "/placeholder.jpg"} 
                        alt={item.product_details?.name}
                        className={`w-full h-full object-contain ${item.isCancelled ? "grayscale opacity-50" : ""}`}
                      />
                    </div>

                    <div className="flex-1 min-w-0 text-center sm:text-left w-full">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${status.bg} ${status.text} border ${status.border}`}>
                          {item.tracking_status}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">SKU: {item.orderId.slice(-8)}</span>
                      </div>

                      <h3 className={`text-sm font-bold text-slate-900 mb-1 truncate px-2 sm:px-0 ${item.isCancelled ? "line-through text-slate-400" : ""}`}>
                        {item.product_details?.name}
                      </h3>

                      <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2 mt-2.5">
                        <div className="text-center sm:text-left">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Price</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">₹{item.totalAmt.toLocaleString()}</span>
                            <span className="text-[10px] text-slate-300 line-through">₹{Math.round(item.totalAmt * 1.2).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="text-center sm:text-left">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Qty</p>
                          <p className="text-xs font-bold text-slate-700">{item.quantity} Units</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-1.5 min-w-fit mt-2 sm:mt-0 w-full sm:w-auto justify-center">
                      <button 
                        onClick={() => { setSelectedOrder(item); setOpenTrackingModal(true); }}
                        className="flex-1 sm:flex-none p-2.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-50 transition-all flex items-center justify-center gap-2 sm:gap-0"
                        title="Track Item"
                      >
                        <FiActivity size={16} />
                        <span className="sm:hidden text-xs font-bold uppercase">Track</span>
                      </button>
                      {!item.isCancelled && userRole !== "ADMIN" && (
                        <button 
                          onClick={() => handleOpenCancelModal(item)}
                          className="flex-1 sm:flex-none p-2.5 sm:p-2 text-rose-500 hover:bg-rose-50 rounded-lg border border-rose-50 transition-all flex items-center justify-center gap-2 sm:gap-0"
                          title="Cancel Item"
                        >
                          <FiX size={16} />
                          <span className="sm:hidden text-xs font-bold uppercase">Cancel</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border-t border-slate-100 pt-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Delivery Address</h4>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="flex gap-4">
                  <div className="p-2 bg-white rounded-lg border border-slate-200 text-emerald-600 h-fit flex-shrink-0">
                    <FiMapPin size={18} />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-slate-900 mb-1">{mainGroupInfo.delivery_address?.fullName || "Recipient"}</p>
                    <p className="text-slate-500 font-medium leading-relaxed">{mainGroupInfo.delivery_address?.address_line}</p>
                    <p className="text-slate-500 font-medium">{mainGroupInfo.delivery_address?.city}, {mainGroupInfo.delivery_address?.state}</p>
                    <div className="mt-3">
                      <span className="bg-white px-2 py-1 rounded border border-slate-200 font-bold text-slate-700">{mainGroupInfo.delivery_address?.pincode}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-1 lg:col-span-2 space-y-4">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Order Summary</h4>
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200">
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center text-slate-500 font-medium text-xs">
                    <span>Items Subtotal</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300 line-through">₹{(totalAmount * 1.2).toLocaleString()}</span>
                      <span className="text-slate-900 font-bold">₹{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-slate-500 font-medium text-xs">
                    <span>Shipping & Handling</span>
                    <span className="text-emerald-600 font-bold">FREE</span>
                  </div>

                  {mainGroupInfo.trackingId && (
                    <div className="bg-blue-50/50 border border-dashed border-blue-200 rounded-xl p-3 flex flex-col gap-1">
                      <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Tracking Details</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-900">{mainGroupInfo.trackingId}</span>
                        <span className="text-[10px] font-medium text-blue-500 uppercase tracking-tighter">{mainGroupInfo.tracking_status}</span>
                      </div>
                    </div>
                  )}

                  <div className="bg-emerald-50/50 border border-dashed border-emerald-200 rounded-xl p-3 flex items-center justify-center gap-2">
                    <FaCoins className="text-amber-500" size={14} />
                    <span className="text-emerald-700 text-[10px] sm:text-[11px] font-bold">You saved ₹{(totalAmount * 0.2).toLocaleString()} on this order</span>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-tight">Amount Paid</h3>
                    <span className="text-lg sm:text-xl font-bold text-slate-900">₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

            {/* Cancel Modal (Individual Item) */}
            {openCancelModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setOpenCancelModal(false)} />
                    <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md p-8 z-10 animate-in fade-in zoom-in duration-200 my-auto">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                                <FiAlertOctagon size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[#1a1c21]">Cancel Item</h3>
                                <p className="text-xs text-[#64748b] font-medium tracking-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">ID: {selectedOrder?.orderId}</p>
                            </div>
                        </div>

                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Why are you cancelling this item?</p>
                        <div className="space-y-3">
                            {["Changed my mind", "Found better alternative", "Ordered by mistake", "Other"].map((reason) => (
                                <label 
                                    key={reason} 
                                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border cursor-pointer transition-all ${
                                        cancellationReason === reason ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-bold" : "bg-gray-50 border-gray-100 text-gray-500"
                                    }`}
                                >
                                    <input type="radio" value={reason} className="hidden" onChange={(e) => setCancellationReason(e.target.value)} />
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${cancellationReason === reason ? "border-indigo-600 bg-indigo-600" : "border-gray-300"}`}>
                                        {cancellationReason === reason && <div className="w-2 h-2 rounded-full bg-white" />}
                                    </div>
                                    <span className="text-sm">{reason}</span>
                                </label>
                            ))}
                        </div>

                        {cancellationReason === "Other" && (
                            <textarea
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                className="w-full mt-4 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm resize-none h-24 outline-indigo-500"
                                placeholder="Describe reason..."
                            />
                        )}

                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setOpenCancelModal(false)} className="flex-1 py-3 text-sm font-bold text-[#64748b] hover:bg-gray-50 rounded-xl transition-all">Go Back</button>
                            <button onClick={handleCancelOrder} className="flex-1 py-3 text-sm font-bold text-white bg-rose-500 rounded-xl shadow-lg shadow-rose-100 transition-all">Confirm</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Info Modal */}
            {openDetailsModal && selectedOrder && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setOpenDetailsModal(false)} />
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden z-10 p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <FiInfo className="text-indigo-600" />
                                <span>Item Information</span>
                            </h3>
                            <button onClick={() => setOpenDetailsModal(false)}><FiX size={20} className="text-gray-400" /></button>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-slate-50 p-4 rounded-2xl flex gap-4">
                                <img src={selectedOrder.product_details?.image?.[0]} className="w-16 h-16 object-contain bg-white rounded-xl p-2" />
                                <div>
                                    <p className="font-bold text-slate-900">{selectedOrder.product_details?.name}</p>
                                    <p className="text-xs text-slate-400">Qty: {selectedOrder.quantity}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-[10px] font-bold text-indigo-400 uppercase">Subtotal</p>
                                    <p className="font-black">₹{selectedOrder.totalAmt}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-[10px] font-bold text-indigo-400 uppercase">Status</p>
                                    <p className="font-black">{selectedOrder.tracking_status}</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setOpenDetailsModal(false)} className="w-full mt-6 py-3 bg-[#1d9963] text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md">Close</button>
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

export default OrderDetails;
