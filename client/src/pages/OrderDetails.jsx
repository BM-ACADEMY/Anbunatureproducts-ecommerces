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
        <div className="bg-[#fcf8ed] min-h-screen py-8">
            <div className="container mx-auto px-6 lg:px-10">
                <div className="mb-6">
                    <Breadcrumbs />
                </div>
                <div className="mb-6 flex items-center justify-between">
                    <button 
                        onClick={() => navigate(userRole === "ADMIN" ? "/dashboard/allorders" : "/user/myorders")}
                        className="flex items-center gap-2 text-[#64748b] hover:text-[#1d9963] font-bold transition-colors group"
                    >
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                            <FiArrowLeft size={16} />
                        </div>
                        <span className="text-sm">Back to My Orders</span>
                    </button>
                </div>

                <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100">
                    <div className="flex flex-col lg:flex-row justify-between gap-8 mb-10 border-b border-gray-50 pb-10">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-[#1d9963] p-2 rounded-xl text-white">
                                    <FiShoppingBag size={20} />
                                </div>
                                <h1 className="text-2xl font-bold text-[#1a1c21] tracking-tight">Order #{groupId.slice(-12).toUpperCase()}</h1>
                            </div>
                            <p className="text-[#64748b] text-sm font-medium">Placed on {new Date(mainGroupInfo.createdAt).toLocaleString(undefined, { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 lg:text-right self-start lg:self-center">
                            <div className="bg-gray-50 px-5 py-2.5 rounded-xl border border-gray-100">
                                <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest mb-0.5">Items</p>
                                <p className="text-sm font-bold text-[#1a1c21]">{groupItems.length} Products</p>
                            </div>
                            <div className="bg-[#f3f9f2] px-5 py-2.5 rounded-xl border border-green-50">
                                <p className="text-[10px] font-bold text-[#1d9963] uppercase tracking-widest mb-0.5">Paid</p>
                                <p className="text-sm font-bold text-[#1d9963]">₹{totalAmount.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <span>Order Items</span>
                            <span className="text-sm font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">{groupItems.length}</span>
                        </h2>
                        
                        <div className="grid gap-4">
                            {groupItems.map((item) => {
                                const status = getStatusConfig(item.tracking_status);
                                return (
                                    <div key={item._id} className="relative bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row gap-6 items-center transition-all shadow-sm">
                                        <div className="w-24 h-24 bg-gray-50 rounded-xl p-3 flex-shrink-0">
                                            <img 
                                                src={item.product_details?.image?.[0] || "/placeholder.jpg"} 
                                                alt={item.product_details?.name}
                                                className={`w-full h-full object-contain ${item.isCancelled ? "grayscale opacity-50" : ""}`}
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0 text-center md:text-left">
                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                                <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${status.bg} ${status.text}`}>
                                                    {item.tracking_status}
                                                </div>
                                                <span className="text-xs text-[#64748b] font-medium">SKU: {item.orderId}</span>
                                            </div>

                                            <h3 className={`text-lg font-bold text-[#1a1c21] mb-1 truncate ${item.isCancelled ? "line-through text-gray-400" : ""}`}>
                                                {item.product_details?.name}
                                            </h3>

                                            {/* Ratings Section */}
                                            <div className="flex items-center gap-1 mb-3 justify-center md:justify-start">
                                                {[...Array(5)].map((_, i) => {
                                                    const reviews = item.productId?.reviews || [];
                                                    const avgStars = reviews.length > 0 
                                                        ? Math.round(reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length) 
                                                        : 5; // Default to 5 if no reviews for demo/premium look
                                                    return (
                                                        <FiStar 
                                                            key={i} 
                                                            size={12} 
                                                            className={i < avgStars ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} 
                                                        />
                                                    );
                                                })}
                                                <span className="text-[10px] text-gray-400 font-medium ml-1">
                                                    ({item.productId?.reviews?.length || 0})
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-2">
                                                <div>
                                                    <p className="text-[10px] font-bold text-[#64748b] uppercase mb-0.5 tracking-tight">Price</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-[#1a1c21]">₹{item.totalAmt.toLocaleString()}</span>
                                                        <span className="text-[10px] text-gray-400 line-through">₹{Math.round(item.totalAmt * 1.2).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-[#64748b] uppercase mb-0.5 tracking-tight">Quantity</p>
                                                    <p className="text-sm font-bold text-[#1a1c21]">{item.quantity} Units</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 min-w-fit mt-4 md:mt-0">
                                            <button 
                                                onClick={() => { setSelectedOrder(item); setOpenTrackingModal(true); }}
                                                className="px-5 py-2.5 bg-gray-50 hover:bg-[#f6fcf8] hover:text-[#1d9963] text-sm font-bold text-[#64748b] rounded-xl transition-all flex items-center gap-2"
                                            >
                                                <FiActivity size={16} />
                                                Track
                                            </button>
                                            {!item.isCancelled && (
                                                <button 
                                                    onClick={() => handleOpenCancelModal(item)}
                                                    className="px-5 py-2.5 bg-gray-50 hover:bg-rose-50 hover:text-rose-500 text-sm font-bold text-[#64748b] rounded-xl transition-all flex items-center gap-2"
                                                >
                                                    <FiX size={16} />
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 pt-10">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest">Delivery Address</h4>
                            <div className="bg-gray-50 rounded-2xl p-6 flex gap-4 border-2 border-gray-200">
                                <div className="p-3 bg-white rounded-xl border border-gray-100 text-[#1d9963] h-fit">
                                    <FiMapPin size={20} />
                                </div>
                                <div className="text-sm">
                                    <p className="font-bold text-[#1a1c21] mb-1">{mainGroupInfo.delivery_address?.fullName || "Recipient"}</p>
                                    <p className="text-[#64748b] font-medium">{mainGroupInfo.delivery_address?.address_line}</p>
                                    <p className="text-[#64748b] font-medium">{mainGroupInfo.delivery_address?.city}, {mainGroupInfo.delivery_address?.state}</p>
                                    <p className="mt-2 font-bold text-[#1a1c21] bg-white px-2 py-1 rounded-md border border-gray-100 w-fit">{mainGroupInfo.delivery_address?.pincode}</p>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-4">
                             <div className="bg-[#f3f9f2] rounded-2xl p-6 shadow-sm border border-green-50">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[#64748b] font-medium text-sm">
                                        <span>Subtotal</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[#a1a1a1] line-through text-xs font-medium">₹{(totalAmount * 1.2).toLocaleString()}</span>
                                            <span className="text-[#1a1c21] font-bold">₹{totalAmount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-[#64748b] font-medium text-sm">
                                        <span>Discount</span>
                                        <span className="text-[#1a1c21] font-bold">- ₹0</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[#64748b] font-medium text-sm">
                                        <span>Shipping Charge</span>
                                        <span className="text-[#1a1c21] font-bold">₹0</span>
                                    </div>

                                    {/* Total Savings Badge */}
                                    <div className="border border-dashed border-green-500 rounded-lg p-3 flex items-center justify-center gap-2 bg-white/40 my-2">
                                        <FaCoins className="text-yellow-500 shadow-sm flex-shrink-0" size={14} />
                                        <span className="text-[#1d9963] text-sm font-bold tracking-tight">Total Savings of ₹{(totalAmount * 0.2).toLocaleString()} From this order</span>
                                    </div>

                                    <div className="pt-6 border-t border-[#eef5f0] flex justify-between items-center mt-4">
                                        <h3 className="text-xl font-bold text-[#1a1c21]">Grand Total</h3>
                                        <span className="text-2xl font-black text-[#1a1c21]">₹{totalAmount.toLocaleString()}</span>
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
