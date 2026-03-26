import React from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const AddressCard = ({ 
    address, 
    isSelected, 
    onSelect, 
    onEdit, 
    onDelete,
    showRadio = true,
    showActions = true
}) => {
    return (
        <div
            onClick={() => onSelect?.(address._id)}
            className={`relative border-2 rounded-2xl p-5 transition-all duration-300 cursor-pointer ${
                isSelected
                ? "border-blue-300 bg-blue-50/40 shadow-md"
                : "border-gray-100 hover:border-gray-200 bg-white hover:shadow-sm"
            }`}
        >
            <div className="flex gap-4 items-start">
                {showRadio && (
                    <div className="mt-1 flex-shrink-0">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected ? "border-blue-500 scale-110" : "border-gray-300"
                        }`}>
                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-in zoom-in duration-200" />}
                        </div>
                    </div>
                )}
                
                <div className="flex-grow min-w-0">
                    <h4 className="text-[15px] font-bold text-slate-800 leading-tight mb-2 uppercase">
                        {address.address_line}
                    </h4>
                    {address.address_line_2 && (
                        <p className="text-[14px] text-slate-600 font-medium mb-1">
                            {address.address_line_2}
                        </p>
                    )}
                    <p className="text-[13px] text-slate-500 font-medium tracking-tight mb-1">
                        {address.city}, {address.state}
                    </p>
                    <p className="text-[13px] text-slate-400 font-bold mb-3 tracking-wider">
                        {address.pincode}
                    </p>

                    <div className="flex items-center gap-2">
                        <div className="bg-[#EFF6FF] px-1.5 py-0.5 rounded border border-[#DBEAFE]">
                            <span className="text-[10px] font-black text-[#3B82F6] leading-none">PH</span>
                        </div>
                        <span className="text-[14px] font-bold text-slate-700 tracking-tight">
                            {address.mobile}
                        </span>
                    </div>
                </div>
            </div>

            {showActions && (
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-end gap-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.(address);
                        }}
                        className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                        title="Edit Address"
                    >
                        <FiEdit2 size={16} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(address._id);
                        }}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete Address"
                    >
                        <FiTrash2 size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddressCard;
