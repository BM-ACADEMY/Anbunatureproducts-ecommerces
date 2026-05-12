import React from 'react';
import { motion } from 'framer-motion';
import { FiShoppingBag } from 'react-icons/fi';

const NoData = ({ message = "No Data Found", description = "We couldn't find what you're looking for.", children }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center w-full min-h-[400px]">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center"
      >
        <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-emerald-50 rounded-full animate-pulse opacity-60" />
          <FiShoppingBag size={42} className="text-emerald-500 relative z-10" />
        </div>
        
        <h3 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">{message}</h3>
        <p className="text-slate-500 text-sm leading-relaxed max-w-sm mb-10">
          {description}
        </p>
        
        {children}
      </motion.div>
    </div>
  );
};

export default NoData;
