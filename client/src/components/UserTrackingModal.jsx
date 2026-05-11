// frontend/src/components/UserTrackingModal.jsx
import React, { useState, useEffect } from "react";
import TrackingStepper from "./TrackingStepper";
import { IoClose } from "react-icons/io5";

const trackingSteps = [
  { status: "Pending" },
  { status: "Processing" },
  { status: "Shipped" },
  { status: "Delivered" },
];

const UserTrackingModal = ({ open, handleClose, order }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const targetStep = order?.isCancelled
    ? -1 
    : trackingSteps.findIndex((step) => step.status === order?.tracking_status);

  useEffect(() => {
    if (!open) {
      setCurrentStep(0);
      return;
    }

    if (targetStep === -1) {
      setCurrentStep(-1);
      return;
    }

    let step = 0;
    const timer = setInterval(() => {
      if (step <= targetStep) {
        setCurrentStep(step);
        step++;
      } else {
        clearInterval(timer);
      }
    }, 500); 

    return () => clearInterval(timer); 
  }, [open, targetStep]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={handleClose} 
      />
      
      {/* Modal content */}
      <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Order Tracking</h2>
            <p className="text-[11px] font-medium text-slate-400 mt-1">#{order?.orderId}</p>
          </div>
          <button 
            onClick={handleClose}
            className="p-1.5 hover:bg-slate-50 text-slate-400 rounded-lg transition-all"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="p-8">
          <div className="mb-10 p-6 bg-[#f5f8ff] rounded-2xl border border-[#e8efff]">
            <p className="text-[10px] font-black text-[#5c7cfa] uppercase tracking-widest mb-1.5">Current Status</p>
            <p className="text-[#3b5bdb] text-xl font-extrabold">{order?.tracking_status}</p>
          </div>

          <div className="relative px-2">
            <TrackingStepper
                activeStep={currentStep}
                isCancelled={order?.isCancelled}
                trackingStatus={order?.tracking_status}
            />
          </div>

          {order?.isCancelled && (
            <div className="mt-8 p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-rose-500 shadow-sm border border-rose-50">
                 <IoClose size={20} />
              </div>
              <div>
                <p className="text-xs font-black text-rose-600 uppercase tracking-widest">Cancellation Detail</p>
                <p className="text-sm font-bold text-gray-700 mt-1 leading-relaxed">
                  {order.cancellationReason} <span className="text-gray-400 font-medium whitespace-nowrap">on {new Date(order.cancellationDate).toLocaleDateString()}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="px-8 pb-8">
          <button 
            onClick={handleClose}
            className="w-full py-4 bg-[#1a1c21] text-white rounded-2xl text-base font-bold hover:bg-black transition-all active:scale-[0.98] shadow-xl shadow-gray-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTrackingModal;
