import React from "react";
import { FiCheck, FiClock, FiTruck, FiShoppingBag, FiAlertCircle } from "react-icons/fi";

const trackingSteps = [
  {
    label: "Order Received",
    description: "Your order has been received.",
    status: "Pending",
    icon: FiShoppingBag,
  },
  {
    label: "Processing",
    description: "Your order is being processed and prepared.",
    status: "Processing",
    icon: FiClock,
  },
  {
    label: "Shipped",
    description: "Your order has been packed and dispatched.",
    status: "Shipped",
    icon: FiTruck,
  },
  {
    label: "Delivered",
    description: "Your order has been delivered.",
    status: "Delivered",
    icon: FiCheck,
  },
];

const TrackingStepper = ({ trackingStatus, activeStep, isCancelled }) => {
  // Determine active index from either prop
  const currentStatusIndex = trackingStatus 
    ? trackingSteps.findIndex(step => step.status === trackingStatus)
    : activeStep ?? 0;

  return (
    <div className="w-full py-4 px-2">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 relative">
        {trackingSteps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentStatusIndex || (index === currentStatusIndex && trackingStatus === "Delivered");
          const isActive = index === currentStatusIndex && !isCancelled;
          const isPast = index < currentStatusIndex;

          return (
            <div key={step.label} className="flex flex-row md:flex-col items-center flex-1 w-full relative group">
              {/* Connector Line */}
              {index !== trackingSteps.length - 1 && (
                <div className={`hidden md:block absolute top-5 left-1/2 w-full h-0.5 transition-colors duration-500 ${isPast ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
              {index !== trackingSteps.length - 1 && (
                <div className={`md:hidden absolute left-5 top-10 w-0.5 h-12 transition-colors duration-500 ${isPast ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}

              {/* Icon Circle */}
              <div 
                className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-500 shadow-sm ${
                  isCancelled 
                    ? 'border-red-200 bg-red-50 text-red-500' 
                    : isPast || (index === currentStatusIndex && !isCancelled)
                      ? 'border-green-500 bg-green-500 text-white' 
                      : 'border-gray-200 bg-white text-gray-400'
                } ${isActive ? 'ring-4 ring-green-100 scale-110' : ''}`}
              >
                {isCancelled && index === currentStatusIndex ? (
                  <FiAlertCircle size={20} />
                ) : isPast ? (
                  <FiCheck size={20} />
                ) : (
                  <Icon size={20} />
                )}
              </div>

              {/* Text Labels */}
              <div className="ml-4 md:ml-0 md:mt-4 text-left md:text-center max-w-[120px]">
                <p className={`text-[11px] font-bold uppercase tracking-widest transition-colors duration-300 ${
                  isCancelled && index === currentStatusIndex
                    ? 'text-red-600'
                    : isActive || isPast
                      ? 'text-gray-900'
                      : 'text-gray-400'
                }`}>
                  {step.label}
                </p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5 line-clamp-1 md:line-clamp-2 leading-relaxed">
                  {isCancelled && index === currentStatusIndex ? 'Order Cancelled' : step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackingStepper;