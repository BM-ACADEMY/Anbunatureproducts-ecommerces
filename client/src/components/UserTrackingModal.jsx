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
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-200" 
        onClick={handleClose} 
      />
      
      {/* Modal content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/10">
          <div>
            <h2 className="text-lg font-black text-gray-900 tracking-tight">Order Tracking</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">#{order?.orderId}</p>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-rose-50 hover:text-rose-500 text-gray-400 rounded-full transition-all"
          >
            <IoClose size={22} />
          </button>
        </div>

        <div className="p-8">
          <div className="mb-8 flex items-center justify-between p-4 bg-indigo-50/50 rounded-2xl border border-indigo-50">
            <div>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Current Status</p>
                <p className="text-indigo-600 font-black text-sm mt-0.5">{order?.tracking_status}</p>
            </div>
            {order?.isCancelled && (
              <span className="px-3 py-1 bg-rose-100 text-rose-600 text-[10px] font-black uppercase rounded-lg border border-rose-200">
                Cancelled
              </span>
            )}
          </div>

          <div className="relative">
            <TrackingStepper
                activeStep={currentStep}
                isCancelled={order?.isCancelled}
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

        <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100">
          <button 
            onClick={handleClose}
            className="w-full py-3.5 bg-gray-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-all active:scale-[0.98] shadow-lg shadow-gray-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTrackingModal;