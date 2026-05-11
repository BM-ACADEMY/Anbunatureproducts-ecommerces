import React, { useEffect, useState, useRef } from "react";
import { FiMoreVertical, FiEye, FiTrash2, FiActivity, FiSearch, FiX, FiFilter, FiDownload, FiTruck, FiClock, FiCheckCircle, FiFileText } from "react-icons/fi";
import { LayoutList, ArrowUpDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status");
    if (status) {
      setActiveTab(status);
    }
  }, [location.search]);

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
      case "Processing":
        return "bg-amber-50 text-amber-600 border border-amber-100";
      case "Shipped":
        return "bg-blue-50 text-blue-600 border border-blue-100";
      case "Delivered":
        return "bg-emerald-50 text-emerald-600 border border-emerald-100";
      case "Cancelled":
        return "bg-rose-50 text-rose-600 border border-rose-100";
      default:
        return "bg-slate-50 text-slate-600 border border-slate-100";
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
    Delivered: groupedOrdersList.filter(o => o.tracking_status === "Delivered").length,
    Cancelled: groupedOrdersList.filter(o => o.isCancelled || o.tracking_status === "Cancelled").length,
  };

  const filteredOrders = groupedOrdersList
    .filter((group) => {
      if (activeTab === "Processing") return group.tracking_status === "Processing";
      if (activeTab === "Shipped") return group.tracking_status === "Shipped";
      if (activeTab === "Delivered") return group.tracking_status === "Delivered";
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
      "Full ID",
      "Customer Name",
      "Product Name",
      "Quantity",
      "Item Price",
      "Total Amount",
      "Payment Status",
      "Tracking Status",
      "Order Date"
    ];

    // CSV Data rows - Consolidating each group into a single row
    const csvData = filteredOrders.map(group => [
      `"#${(group.groupId || "").toString().slice(-12).toUpperCase()}"`,
      `"${group.groupId || ""}"`,
      `"${(group.userId?.name || "N/A").replace(/"/g, '""')}"`,
      `"${group.items.map(item => `${item.product_details?.name} (x${item.quantity})`).join(" | ").replace(/"/g, '""')}"`,
      group.items.reduce((sum, item) => sum + item.quantity, 0),
      `"${group.items.map(item => item.totalAmt).join(" + ")}"`,
      group.totalAmt,
      `"${group.payment_status || "N/A"}"`,
      `"${group.tracking_status || "N/A"}"`,
      `"${new Date(group.createdAt).toLocaleDateString('en-GB')}"`
    ]);

    // Construct CSV content
    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");

    // Create and trigger download with BOM (Byte Order Mark) to fix encoding issues in Excel
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
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
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8 space-y-6">
      {/* Header section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Orders</h1>
          <p className="text-slate-500 text-sm mt-0.5 font-medium">
            Manage and track all customer orders in one place.
          </p>
        </div>
        <button 
          onClick={exportToExcel}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95 group"
        >
          <FiDownload className="size-3.5" />
          Export Excel
        </button>
      </div>

      {/* Tabs - Responsive Grid/Pill Style */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1 p-1 bg-slate-200/60 rounded-xl w-full sm:w-fit">
        {[
          { id: "All", label: "All", count: statusCounts.All, icon: LayoutList },
          { id: "Processing", label: "Processing", count: statusCounts.Processing, icon: FiClock },
          { id: "Shipped", label: "Shipped", count: statusCounts.Shipped, icon: FiTruck },
          { id: "Delivered", label: "Delivered", count: statusCounts.Delivered, icon: FiCheckCircle },
          { id: "Cancelled", label: "Canceled", count: statusCounts.Cancelled, icon: FiX },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center justify-center sm:justify-start gap-2 px-3 py-2 sm:px-4 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            } ${tab.id === "Cancelled" ? "col-span-2 sm:col-span-1" : ""}`}
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative group flex-1 max-w-lg">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-3.5" />
          <input
            type="text"
            placeholder="Search orders by ID, customer or product..."
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
            <h3 className="text-lg font-semibold text-slate-900">No results found</h3>
            <p className="text-slate-500 text-xs mt-1">Try changing your search or filters.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {currentOrders.map((group, index) => (
              <div key={group.groupId + index} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="px-5 py-3 bg-slate-50/50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-5">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">ID</span>
                      <span className="text-xs font-bold text-slate-900">#{group.groupId.slice(-10).toUpperCase()}</span>
                    </div>
                    <div className="flex flex-col border-l border-slate-200 pl-5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Customer</span>
                      <span className="text-xs font-semibold text-slate-600">{group?.userId?.name || "Customer"}</span>
                    </div>
                    <div className="flex flex-col border-l border-slate-200 pl-5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Date</span>
                      <span className="text-xs font-semibold text-slate-600">
                        {new Date(group.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                     <span className={`px-3 py-1 text-[9px] font-bold uppercase tracking-wider rounded-md ${getStatusClasses(group.tracking_status)}`}>
                        {group.tracking_status}
                     </span>
                     <div className="px-2 py-1 bg-slate-100 rounded-md text-[9px] font-bold text-slate-500 uppercase">
                        {group.payment_status}
                     </div>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-5 flex-1">
                    <div className="flex -space-x-3">
                      {group.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-sm bg-slate-50 z-[idx]">
                          <img src={item.product_details.image[0]} className="w-full h-full object-cover" alt="product" />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-semibold text-slate-900 text-sm leading-tight">
                        {group.items[0].product_details.name}
                        {group.items.length > 1 && (
                          <span className="text-[10px] text-slate-400 ml-2">+{group.items.length - 1} more</span>
                        )}
                      </h4>
                      <Link to={`/order-details/${group.groupId}`} className="text-[10px] text-emerald-600 font-bold hover:underline">
                        View details
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
                      <span className="text-base font-bold text-slate-900">₹{group.totalAmt.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <Link
                          to={`/order-details/${group.groupId}`}
                          className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg border border-slate-100 transition-all"
                          title="View Details"
                        >
                          <FiEye size={16} />
                        </Link>
                        <button
                          onClick={() => handleOpenInvoice(group)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-emerald-50 transition-all"
                          title="Invoice"
                        >
                          <FiFileText size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenTracking(group.items[0])}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-50 transition-all"
                          title="Track"
                        >
                          <FiActivity size={16} />
                        </button>

                    </div>
                  </div>
                </div>
              </div>
            ))}
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
        <InvoiceModal open={openInvoice} handleClose={handleCloseInvoice} orderGroup={selectedOrder} />
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
