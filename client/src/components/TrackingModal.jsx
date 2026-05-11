import React, { useState, useEffect } from "react";
import { FiX, FiCheck } from "react-icons/fi";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { toast } from "sonner";
import TrackingStepper from "./TrackingStepper";

const TrackingModal = ({ open, handleClose, order, onUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState(order?.tracking_status || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order?.tracking_status) setSelectedStatus(order.tracking_status);
  }, [order, open]);

  const handleUpdateTracking = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.updateTracking,
        data: {
          orderId: order.orderId,
          groupId: order.groupId,
          tracking_status: selectedStatus,
        },
      });

      if (response.data.success) {
        toast.success("Status updated");
        onUpdate();
        handleClose();
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const statuses = ["Pending", "Processing", "Shipped", "Delivered"];
  const currentIndex = statuses.indexOf(order?.tracking_status);
  const availableStatuses = statuses.slice(currentIndex === -1 ? 0 : currentIndex);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" 
        onClick={handleClose} 
      />

      <div className="relative bg-white w-full max-w-md rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Order Tracking</h3>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">ID: {order?.orderId?.slice(-10)}</p>
          </div>
          <button 
            onClick={handleClose} 
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="p-5">
          {/* Progress Section */}
          <div className="mb-6 p-4 bg-slate-50/50 rounded-lg border border-slate-100">
            <TrackingStepper
              trackingStatus={order?.tracking_status}
              isCancelled={order?.isCancelled}
            />
          </div>

          {!order?.isCancelled ? (
            <div className="space-y-1.5">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">Update Status</p>
              
              <div className="grid grid-cols-1 gap-1.5">
                {availableStatuses.map((status) => {
                  const isCurrent = status === order?.tracking_status;
                  const isSelected = selectedStatus === status;

                  return (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      disabled={isCurrent}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-all border ${
                        isSelected 
                          ? "bg-slate-900 border-slate-900 text-white" 
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                      } ${isCurrent ? "opacity-30 cursor-not-allowed border-dashed" : "active:scale-[0.99]"}`}
                    >
                      <span className="font-medium">{status}</span>
                      {isSelected && !isCurrent ? (
                        <FiCheck size={16} />
                      ) : (
                        isCurrent && <span className="text-[9px] font-medium opacity-60 italic">Current</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-6 text-center border border-dashed border-slate-200 rounded-lg bg-slate-50/30">
              <span className="text-xs font-medium text-slate-400 tracking-wide">Shipment Cancelled</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleClose}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            Dismiss
          </button>
          
          {!order?.isCancelled && (
            <button
              onClick={handleUpdateTracking}
              disabled={selectedStatus === order?.tracking_status || loading}
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 rounded-lg transition-all shadow-sm"
            >
              {loading ? "Updating..." : "Update Status"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingModal;