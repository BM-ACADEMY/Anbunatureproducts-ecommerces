import React, { useEffect, useState, useRef } from "react";
import { FiMoreVertical, FiEye, FiTrash2, FiActivity, FiSearch, FiX, FiFilter, FiDownload, FiTruck, FiClock, FiCheckCircle, FiFileText } from "react-icons/fi";
import { LayoutList, ArrowUpDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
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
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
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
      const url = orderToDelete.groupId 
        ? `${SummaryApi.deleteOrder.url}/${orderToDelete.groupId}?groupId=${orderToDelete.groupId}`
        : `${SummaryApi.deleteOrder.url}/${orderToDelete.orderId}`;
      
      const response = await Axios.delete(url);
      if (response.data.success) {
        toast.success("Order(s) deleted successfully");
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
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "Pending":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "Processing":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "Shipped":
        return "bg-violet-50 text-violet-600 border-violet-100";
      case "Cancelled":
        return "bg-rose-50 text-rose-600 border-rose-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const groupedOrders = orders?.reduce((acc, order) => {
    const gid = order.groupId || order.orderId;
    if (!acc[gid]) {
      acc[gid] = {
        groupId: gid,
        userId: order.userId,
        createdAt: order.createdAt,
        items: [],
        totalAmt: 0,
        payment_status: order.payment_status,
        tracking_status: order.tracking_status,
        isCancelled: order.isCancelled,
      };
    }
    acc[gid].items.push(order);
    acc[gid].totalAmt += order.totalAmt;
    // If any item in the group is not cancelled, the group might be active, 
    // but usually groups have consistent status
    return acc;
  }, {});

  const groupedOrdersList = groupedOrders ? Object.values(groupedOrders) : [];

  const statusCounts = {
    All: groupedOrdersList.length,
    Processing: groupedOrdersList.filter(o => o.tracking_status === "Processing").length,
    Shipped: groupedOrdersList.filter(o => o.tracking_status === "Shipped").length,
    Cancelled: groupedOrdersList.filter(o => o.isCancelled || o.tracking_status === "Cancelled").length,
  };

  const filteredOrders = groupedOrdersList
    .filter((group) => {
      if (activeTab === "Processing") return group.tracking_status === "Processing";
      if (activeTab === "Shipped") return group.tracking_status === "Shipped";
      if (activeTab === "Cancelled") return group.isCancelled || group.tracking_status === "Cancelled";
      return true;
    })
    .filter((group) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        group.userId?.name?.toLowerCase().includes(searchLower) ||
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

  const exportToExcel = () => {
    if (!filteredOrders?.length) {
      toast.error("No orders to export");
      return;
    }

    // CSV Headers
    const headers = [
      "Order ID",
      "Customer Name",
      "Product Name",
      "Quantity",
      "Total Amount",
      "Payment Status",
      "Tracking Status",
      "Order Date"
    ];

    // CSV Data rows
    const csvData = filteredOrders.map(order => [
      order.orderId,
      order.userId?.name || "N/A",
      `"${order.product_details?.name?.replace(/"/g, '""')}"` || "N/A", // Quote product name to handle commas
      order.quantity,
      order.totalAmt,
      order.payment_status,
      order.tracking_status,
      new Date(order.createdAt).toLocaleDateString('en-GB')
    ]);

    // Construct CSV content
    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Anbu_Orders_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Order list exported successfully");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 sm:p-5 lg:p-6 space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A1C21] tracking-tight">All Order</h1>
          <p className="text-[#64748B] text-sm mt-1 font-medium">
            Check all orders at single place. It's easy to manage.
          </p>
        </div>
        <button 
          onClick={exportToExcel}
          className="flex items-center gap-2 bg-[#1D9963] hover:bg-[#168050] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 group"
        >
          <FiDownload className="size-4" />
          Export Order List
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200">
        {[
          { id: "All", label: "All order", count: statusCounts.All },
          { id: "Processing", label: "Processing", count: statusCounts.Processing },
          { id: "Shipped", label: "Shipped", count: statusCounts.Shipped },
          { id: "Cancelled", label: "Canceled", count: statusCounts.Cancelled },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all relative ${
              activeTab === tab.id
                ? "text-[#1D9963]"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            {tab.id === "All" && <LayoutList size={16} />}
            {tab.id === "Processing" && <FiClock size={16} />}
            {tab.id === "Shipped" && <FiTruck size={16} />}
            {tab.id === "Cancelled" && <FiX size={16} />}
            {tab.label} ({tab.count})
            {activeTab === tab.id && (
              <div className="absolute bottom-[-1px] left-0 right-0 h-[2.5px] bg-[#1D9963]" />
            )}
          </button>
        ))}
      </div>

      {/* Search and Sort bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative group flex-1 max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
          <input
            type="text"
            placeholder="Search by ID, name, status"
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-50 transition-all text-sm font-medium placeholder:text-gray-400 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-50 transition-all text-sm font-bold text-[#1A1C21] shadow-sm cursor-pointer min-w-[120px]"
            >
              <option>Newest</option>
              <option>Oldest</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 flex items-center gap-1">
                <span className="text-[10px] opacity-40">|</span>
                <ArrowUpDown size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Order List / Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-11 gap-4 px-8 py-5 bg-[#F8FAFC] border-b border-gray-100 text-[11px] font-black text-[#64748B] uppercase tracking-wider">
          <div className="col-span-5 px-2">PRODUCT</div>
          <div className="col-span-1 text-center">PRICE</div>
          <div className="col-span-2 text-center">PAYMENT</div>
          <div className="col-span-2 text-center">STATUS</div>
          <div className="col-span-1 text-right pr-6 uppercase">ACTION</div>
        </div>

        {!filteredOrders?.length ? (
          <div className="p-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <LayoutList size={40} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No orders found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {currentOrders.map((group, index) => (
              <div key={group.groupId + index} className="group hover:bg-slate-50/10 transition-colors">
                {/* Metadata Header Bar */}
                <div className="px-8 py-3.5 bg-[#F8FAFC] flex items-center justify-between border-y border-gray-50">
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                       <span className="text-[12px] font-medium text-gray-500">Customer:</span>
                       <span className="text-[12px] font-bold text-[#1A1C21]">{group?.userId?.name || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-3 border-l border-gray-200 pl-8">
                       <span className="text-[12px] font-medium text-gray-500">Date:</span>
                       <span className="text-[12px] font-bold text-[#1A1C21]">
                          {new Date(group.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                       </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[12px] font-medium text-gray-500 text-right">Group ID:</span>
                        <span className="text-[12px] font-bold text-[#1A1C21]">#{group.groupId.slice(-12).toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-11 gap-4 px-8 py-6 items-center">
                  
                    {/* Product Summary */}
                    <div className="col-span-5 flex items-center gap-5">
                      <div className="flex -space-x-3 overflow-hidden">
                        {group.items.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white flex-shrink-0 shadow-sm bg-white z-[idx]">
                            <img
                              src={item.product_details.image[0]}
                              className={`w-full h-full object-cover ${item.isCancelled ? "grayscale opacity-50" : ""}`}
                              alt="product"
                            />
                            {idx === 2 && group.items.length > 3 && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] text-white font-bold">
                                    +{group.items.length - 2}
                                </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-[#0F172A] text-[14px] leading-tight transition-colors line-clamp-1">
                          {group.items[0].product_details.name}
                          {group.items.length > 1 && <span className="text-gray-400 ml-2 font-medium">and {group.items.length - 1} more items</span>}
                        </h4>
                        <div className="flex items-center gap-3 text-[12px] font-medium text-gray-500">
                          <span>Items: <span className="text-gray-900 font-bold">{group.items.length}</span></span>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <Link 
                            to={`/order-details/${group.groupId}`} 
                            className="text-indigo-600 font-bold uppercase tracking-wider text-[10px] cursor-pointer hover:underline"
                          >
                            Full details
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Total Price */}
                    <div className="col-span-1 text-center font-bold text-[#0F172A] text-lg">
                      ₹{group.totalAmt.toLocaleString()}
                    </div>

                    {/* Payment Status */}
                    <div className="col-span-2 text-center text-[10px] font-black text-[#64748B] uppercase tracking-widest px-3 py-1 bg-gray-50 rounded-lg w-fit mx-auto border border-gray-100">
                      {group.payment_status}
                    </div>

                    {/* Status Badge */}
                    <div className="col-span-2 flex flex-col items-center gap-1.5">
                      <span className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg border-b-2 ${getStatusClasses(group.tracking_status)}`}>
                        {group.tracking_status}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="col-span-1 flex flex-col gap-2 scale-95 origin-right">
                      <Link
                        to={`/order-details/${group.groupId}`}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-[11px] font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95"
                      >
                        <FiEye className="size-3.5" />
                        Details
                      </Link>
                      <button
                        onClick={() => handleOpenTracking(group.items[0])}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-[#0F172A] rounded-lg text-[11px] font-bold hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
                      >
                        <FiActivity className="size-3.5" />
                        Manage
                      </button>
                      {!group.isCancelled && group.tracking_status !== "Delivered" && (
                        <button
                          onClick={() => handleDeleteOrder(group.items[0])}
                          className="text-[11px] text-rose-500 font-bold hover:text-rose-600 mt-1 transition-colors text-center w-full"
                        >
                          Delete Group
                        </button>
                      )}
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-8 py-5 bg-[#F8FAFC] border-t border-gray-100 flex items-center justify-between">
            <div className="text-[13px] font-medium text-gray-500">
              Showing <span className="text-gray-900 font-bold">{indexOfFirstOrder + 1}</span> to <span className="text-gray-900 font-bold">{Math.min(indexOfLastOrder, filteredOrders.length)}</span> of <span className="text-gray-900 font-bold">{filteredOrders.length}</span> orders
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage(prev => prev - 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 text-[13px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => {
                      setCurrentPage(i + 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`size-9 flex items-center justify-center text-[13px] font-bold rounded-lg transition-all ${
                      currentPage === i + 1
                        ? "bg-[#1D9963] text-white shadow-md shadow-green-100"
                        : "bg-white text-gray-700 border border-gray-100 hover:border-green-200 hover:text-[#1D9963]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage(prev => prev + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 text-[13px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

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
