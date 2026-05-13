import React from 'react';
import { motion } from 'framer-motion';

const WellnessClock = () => {
  return (
    <section className="py-12 md:py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-[#1a1a1a] mb-4 font-outfit tracking-tight">
            Daily Wellness Clock
          </h2>
          <div className="w-24 h-1.5 bg-[#279d68] mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Goodness in every moment, wellness in every day. Follow our natural routine for a better you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative max-w-3xl mx-auto shadow-2xl rounded-3xl overflow-hidden bg-slate-50 border-4 border-white"
        >
          <img 
            src="/assets/wellness/daily_wellness_clock.webp" 
            alt="Anbu Natural Daily Wellness Clock - A guide to natural living through the day" 
            className="w-full h-auto object-cover"
            loading="lazy"
          />
          
          {/* Subtle Overlay for Premium Feel */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
        </motion.div>
        
        <div className="mt-12 flex flex-wrap justify-center gap-6 md:gap-12">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-[#279d68]"></span>
                100% Natural
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-[#279d68]"></span>
                No Preservatives
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-[#279d68]"></span>
                Made With Love
            </div>
        </div>
      </div>
    </section>
  );
};

export default WellnessClock;
