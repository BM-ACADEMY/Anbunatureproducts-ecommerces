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
  FiEye,
  FiSearch,
  FiFilter,
  FiCheckCircle,
  FiFileText
} from 'react-icons/fi';
import { LayoutList, ArrowUpDown } from "lucide-react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { toast } from "sonner";
import { setOrder } from "../store/orderSlice";
import UserTrackingModal from "../components/UserTrackingModal";
import Breadcrumbs from "../components/Breadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

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
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status");
    if (status) {
      setActiveTab(status);
    }
  }, [location.search]);

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
        donationAmount: 0,
      };
    }
    acc[gid].items.push(order);
    acc[gid].totalAmt += order.totalAmt;
    acc[gid].donationAmount += (order.donationAmount || 0);
    // Use the most "advanced" status if multiple items have different statuses? 
    // Usually they'd be the same for a group initially.
    return acc;
  }, {});

  const groupedOrdersList = Object.values(groupedOrders);

  const statusCounts = {
    All: groupedOrdersList.length,
    Pending: groupedOrdersList.filter(o => o.status === "Pending").length,
    Processing: groupedOrdersList.filter(o => o.status === "Processing").length,
    Shipped: groupedOrdersList.filter(o => o.status === "Shipped").length,
    Delivered: groupedOrdersList.filter(o => o.status === "Delivered").length,
    Cancelled: groupedOrdersList.filter(o => o.status === "Cancelled").length,
  };

  const filteredOrders = groupedOrdersList
    .filter((group) => {
      if (activeTab === "Pending") return group.status === "Pending";
      if (activeTab === "Processing") return group.status === "Processing";
      if (activeTab === "Shipped") return group.status === "Shipped";
      if (activeTab === "Delivered") return group.status === "Delivered";
      if (activeTab === "Cancelled") return group.status === "Cancelled";
      return true;
    })
    .filter((group) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        group.groupId?.toLowerCase().includes(searchLower) ||
        group.items.some(item => item.product_details?.name?.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      if (sortBy === "Newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "Oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "Price: High to Low") return b.totalAmt - a.totalAmt;
      if (sortBy === "Price: Low to High") return a.totalAmt - b.totalAmt;
      return 0;
    });

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  // Pagination Logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = (filteredOrders || []).slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil((filteredOrders?.length || 0) / ordersPerPage);

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
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8 space-y-6">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-6">
          <Breadcrumbs />
        </div>
        
        {/* Header section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Orders</h1>
            <p className="text-slate-500 text-sm mt-0.5 font-medium">
              Track and manage your recent purchases in one place.
            </p>
          </div>
        </div>

        {/* Tabs - Responsive Grid/Pill Style */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-xl overflow-x-auto no-scrollbar mb-6 w-full sm:w-fit scroll-smooth whitespace-nowrap">
          {[
            { id: "All", label: "All", count: statusCounts.All, icon: LayoutList },
            { id: "Pending", label: "Pending", count: statusCounts.Pending, icon: FiPackage },
            { id: "Processing", label: "Processing", count: statusCounts.Processing, icon: FiClock },
            { id: "Shipped", label: "Shipped", count: statusCounts.Shipped, icon: FiTruck },
            { id: "Delivered", label: "Delivered", count: statusCounts.Delivered, icon: FiCheckCircle },
            { id: "Cancelled", label: "Canceled", count: statusCounts.Cancelled, icon: FiX },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center sm:justify-start gap-2 px-3.5 py-2 sm:px-4 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all flex-shrink-0 ${
                activeTab === tab.id
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <tab.icon size={14} className={activeTab === tab.id ? "text-emerald-500" : "text-slate-400"} />
              <span className="truncate">{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                activeTab === tab.id ? "bg-emerald-50 text-emerald-600" : "bg-slate-200 text-slate-500"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search and Sort bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
          <div className="relative group flex-1 max-w-lg">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-3.5" />
            <input
              type="text"
              placeholder="Search orders by ID or product..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-red-300 transition-all text-xs font-medium placeholder:text-slate-400 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none text-xs font-semibold text-slate-600 shadow-sm cursor-pointer min-w-[120px]"
              >
                <option>Newest</option>
                <option>Oldest</option>
                <option>Price: High to Low</option>
                <option>Price: Low to High</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ArrowUpDown size={12} />
              </div>
            </div>
          </div>
        </div>

        {/* Order List */}
        <div className="space-y-4">
          {!filteredOrders?.length ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 flex flex-col items-center justify-center text-center">
              <LayoutList size={32} className="text-slate-200 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900">No orders found</h3>
              <p className="text-slate-500 text-xs mt-1">Try changing your search or filters.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {currentOrders.map((group, index) => {
                const mainOrder = group.items[0];
                const statusConfig = getStatusConfig(group.status);
                
                return (
                  <div key={group.groupId + index} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    {/* Order Header */}
                    <div className="px-4 py-3 sm:px-5 sm:py-3 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Order ID</span>
                          <span className="text-xs font-bold text-slate-900">#{group.groupId.slice(-10).toUpperCase()}</span>
                        </div>
                        <div className="flex flex-col border-l border-slate-200 pl-4 sm:pl-5">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Date</span>
                          <span className="text-xs font-semibold text-slate-600">
                            {new Date(group.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        {mainOrder?.trackingId && (
                          <div className="flex flex-col border-l border-slate-200 pl-4 sm:pl-5">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Tracking ID</span>
                            <span className="text-xs font-semibold text-blue-600">{mainOrder.trackingId}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                         <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-md border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} flex items-center gap-1.5`}>
                            {statusConfig.icon}
                            {group.status}
                         </span>
                         <div className="px-2 py-1 bg-slate-100 rounded-md text-[9px] font-bold text-slate-500 uppercase">
                            {group.payment_status}
                         </div>
                      </div>
                    </div>

                    {/* Order Body */}
                    <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                      <div className="flex items-center gap-4 sm:gap-5 flex-1">
                        <div className="flex -space-x-3 flex-shrink-0">
                          {group.items.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl overflow-hidden border-2 border-white shadow-sm bg-slate-50 z-[idx]">
                              <img src={item.product_details.image[0]} className="w-full h-full object-cover" alt="product" />
                            </div>
                          ))}
                          {group.items.length > 3 && (
                             <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl border-2 border-white shadow-sm bg-slate-900 flex items-center justify-center text-white text-[9px] sm:text-[10px] font-bold z-[4]">
                               +{group.items.length - 3}
                             </div>
                          )}
                        </div>

                        <div className="space-y-0.5 sm:space-y-1 min-w-0">
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-tight truncate">
                            {group.items[0].product_details.name}
                          </h4>
                          <p className="text-[10px] text-slate-400">
                             {group.items.length > 1 ? `and ${group.items.length - 1} more items` : 'Single Item Order'}
                          </p>
                          <button onClick={() => navigate(`/order-details/${group.groupId}`)} className="text-[9px] sm:text-[10px] text-emerald-600 font-bold hover:underline block mt-0.5">
                            View details
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-4 md:gap-8 pt-3 md:pt-0 border-t border-slate-50 md:border-none">
                        <div className="text-left md:text-right">
                          <span className="block text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Amount</span>
                          <span className="text-sm sm:text-base font-bold text-slate-900">₹{group.totalAmt.toLocaleString()}</span>
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <button
                              onClick={() => navigate(`/order-details/${group.groupId}`)}
                              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-600 text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm shadow-emerald-100 active:scale-95"
                            >
                                <FiEye size={14} className="hidden sm:block" />
                                Details
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenTrackingModal(mainOrder);
                              }}
                              className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-100 transition-all"
                              title="Track Order"
                            >
                              <FiTruck size={15} />
                            </button>
                            {group.status !== "Shipped" && group.status !== "Delivered" && group.status !== "Cancelled" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenCancelModal(mainOrder);
                                  }}
                                  className="p-1.5 sm:p-2 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-100 transition-all"
                                  title="Cancel Order"
                                >
                                  <FiX size={15} />
                                </button>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination - Clean & Minimal */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-8">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Page <span className="text-slate-900">{currentPage}</span> of {totalPages}
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(prev => prev - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-tight text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Prev
                </button>
                <div className="flex items-center gap-1 mx-2">
                  {[...Array(totalPages)].map((_, i) => (
                     <button
                      key={i + 1}
                      onClick={() => {
                        setCurrentPage(i + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        currentPage === i + 1 ? "w-4 bg-emerald-500" : "bg-slate-300 hover:bg-slate-400"
                      }`}
                    />
                  ))}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(prev => prev + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-tight text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
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
                      {selectedOrder.donationAmount > 0 && (
                        <div className="flex justify-between text-sm text-blue-600 font-bold">
                          <span>Foundation Donation</span>
                          <span>₹{selectedOrder.donationAmount?.toLocaleString()}</span>
                        </div>
                      )}
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
