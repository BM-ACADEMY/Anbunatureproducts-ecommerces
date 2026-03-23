import React, { useState } from "react";
import { FiX, FiCheck } from "react-icons/fi";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { toast } from "sonner";
import TrackingStepper from "./TrackingStepper";

const TrackingModal = ({ open, handleClose, order, onUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState(order?.tracking_status || "Pending");
  const [loading, setLoading] = useState(false);

  const handleUpdateTracking = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.updateTracking,
        data: {
          orderId: order.orderId,
          tracking_status: selectedStatus,
        },
      });

      if (response.data.success) {
        toast.success("Tracking status updated successfully");
        onUpdate();
        handleClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update tracking");
    } finally {
      setLoading(false);
    }
  };

  const statuses = ["Pending", "Processing", "Shipped", "Delivered"];
  const currentIndex = statuses.indexOf(order?.tracking_status);
  const availableStatuses = statuses.slice(currentIndex === -1 ? 0 : currentIndex);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-zoom-in">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Update Tracking</h3>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-0.5">Order #{order?.orderId}</p>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Current Status Visualization */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-inner">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-2">Current Journey</p>
            <TrackingStepper
              trackingStatus={order?.tracking_status}
              isCancelled={order?.isCancelled}
            />
          </div>

          {!order?.isCancelled ? (
            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-700 px-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Select New Status
              </label>
              <div className="grid grid-cols-1 gap-3">
                {availableStatuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    disabled={status === order?.tracking_status}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 ${
                      selectedStatus === status
                        ? "border-green-600 bg-green-50 text-green-700 shadow-md transform scale-[1.02]"
                        : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
                    } ${status === order?.tracking_status ? "opacity-50 cursor-not-allowed grayscale" : "active:scale-95"}`}
                  >
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedStatus === status ? "bg-green-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                            <FiCheck size={20} className={selectedStatus === status ? "opacity-100" : "opacity-0"} />
                        </div>
                        <span className="font-bold text-sm tracking-tight">{status}</span>
                    </div>
                    {status === order?.tracking_status && (
                        <span className="text-[10px] font-black uppercase tracking-widest bg-gray-200 text-gray-500 px-2 py-1 rounded-lg">Active</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-5 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-4">
              <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                <FiX size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-red-900">Order Cancelled</p>
                <p className="text-xs text-red-700 mt-1 leading-relaxed font-medium">
                  This order has been cancelled and its tracking status can no longer be updated.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-white flex gap-4">
          <button
            onClick={handleClose}
            className="flex-1 px-6 py-4 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all active:scale-95"
          >
            Cancel
          </button>
          {!order?.isCancelled && (
            <button
              onClick={handleUpdateTracking}
              disabled={selectedStatus === order?.tracking_status || loading}
              className="flex-[2] px-6 py-4 text-sm font-bold text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:cursor-not-allowed rounded-2xl shadow-xl shadow-green-100 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <FiCheck size={20} />
                  <span>Confirm Status Update</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingModal;