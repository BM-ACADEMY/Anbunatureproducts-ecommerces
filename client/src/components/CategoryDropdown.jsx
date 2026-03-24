import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const CategoryDropdown = ({ 
  options = [], 
  onSelect, 
  placeholder = "Select item", 
  selectedOptions = [],
  label = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  const isSelected = (id) => selectedOptions.some(item => item._id === id);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && <label className="block text-[15px] font-bold text-gray-700 mb-1.5">{label}</label>}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-white px-4 py-2.5 border rounded-xl transition-all duration-200 outline-none
          ${isOpen ? 'border-indigo-500 ring-2 ring-indigo-50/50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}
        `}
      >
        <span className={`text-[15px] font-medium ${selectedOptions.length > 0 ? 'text-gray-800' : 'text-gray-400'}`}>
          {placeholder}
        </span>
        <ChevronDown 
          size={18} 
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-[1100] w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden">
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {options.length > 0 ? (
              options.map((option) => {
                const selected = isSelected(option._id);
                return (
                  <button
                    key={option._id}
                    type="button"
                    disabled={selected}
                    onClick={() => handleSelect(option)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors
                      ${selected 
                        ? 'bg-slate-50 cursor-not-allowed opacity-60' 
                        : 'hover:bg-indigo-50/50 cursor-pointer'}
                    `}
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 bg-white">
                      <img 
                        src={option.image} 
                        alt={option.name} 
                        className="w-full h-full object-contain"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/40'}
                      />
                    </div>
                    <span className={`flex-1 text-sm font-semibold tracking-tight ${selected ? 'text-gray-400' : 'text-gray-700'}`}>
                      {option.name}
                    </span>
                    {selected && <Check size={14} className="text-indigo-600" />}
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-gray-400 font-medium">
                No items found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
