import React from 'react';
import { IoClose } from 'react-icons/io5';
import { FiAlertTriangle } from 'react-icons/fi';

const CofirmBox = ({ cancel, confirm, close }) => {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" 
        onClick={close} 
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-zoom-in">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <FiAlertTriangle size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Permanent Delete</h3>
            </div>
            <button 
              onClick={close}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
            >
              <IoClose size={20} />
            </button>
          </div>
          
          <div className="mb-8">
            <p className="text-gray-600 leading-relaxed">
              Are you sure you want to permanently delete this? This action cannot be undone.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={cancel}
              className="flex-1 px-4 py-3 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={confirm}
              className="flex-1 px-4 py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-lg shadow-red-200 transition-all active:scale-95"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CofirmBox;
