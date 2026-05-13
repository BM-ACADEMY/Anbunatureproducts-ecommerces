import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const founderPhoto = '/assets/Founder/lalitha.webp';

const FounderSection = () => {
    return (
        <section className="py-16 md:py-24 bg-[#fcf8ed] px-4 sm:px-6 lg:px-10 overflow-hidden">
            <div className="container mx-auto max-w-6xl">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative bg-[#e9e4d9] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-xl flex flex-col md:flex-row items-center"
                >
                    {/* Left Content Side */}
                    <div className="flex-1 p-8 md:p-16 z-10">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-6 py-2 bg-white rounded-full text-[0.7rem] md:text-xs font-bold tracking-widest text-[#059669] uppercase mb-8 shadow-sm border border-emerald-50"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Founder's Vision
                        </motion.div>

                        <div className="relative">
                            <Quote className="absolute -top-6 -left-6 w-12 h-12 text-emerald-600/10" />
                            <h2 className="text-lg md:text-xl lg:text-[1.35rem] font-medium leading-relaxed text-gray-800 font-serif italic mb-8">
                                My journey as a graduated nurse and a mother helped me understand the importance of natural, organic, traditional, and healthy living. I have always believed that health and wellness begin at home. My concern for families and society inspired me to start Anbu Natural with a vision to provide natural, traditional, trustworthy, and wellness-focused products made with love and responsibility.
                            </h2>
                            <p className="text-sm md:text-base text-gray-600 font-light leading-relaxed mb-8">
                                Through this journey, I hope to support healthier lifestyles and create a positive impact in the lives of people and communities through our products.
                            </p>
                        </div>

                        <div className="mt-auto">
                            <div className="h-px w-20 bg-emerald-600/30 mb-5"></div>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 font-outfit">Lalitha</h3>
                            <p className="text-[#d97706] font-semibold tracking-widest text-xs md:text-sm uppercase mt-1">Founder, Anbu Natural</p>
                        </div>
                    </div>

                    {/* Right Image Side */}
                    <div className="relative w-full md:w-[45%] h-[400px] md:h-[650px] overflow-hidden flex items-end">
                        {/* Yellow Diagonal Stripe */}
                        <div 
                            className="absolute inset-0 bg-[#f59e0b] transform skew-x-[-12deg] translate-x-12 scale-110"
                            style={{ width: '120%', left: '15%' }}
                        ></div>
                        
                        {/* Founder Image */}
                        <motion.img 
                            initial={{ opacity: 0, scale: 1.1 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            src={founderPhoto} 
                            alt="Lalitha - Founder of Anbu Natural" 
                            className="relative z-10 w-full h-full object-cover object-top filter contrast-[1.05] drop-shadow-2xl"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FounderSection;
