import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { FaStar, FaGoogle } from 'react-icons/fa';
import Logo from '../assets/logo.png';

// Import Swiper styles

import 'swiper/css';
import 'swiper/css/pagination';

const TestimonialSection = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalReviews: 0, averageRating: 0 });
    const navigate = useNavigate();

    const fetchVerifiedReviews = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.getVerifiedSiteReviews
            });
            if (response.data.success) {
                setReviews(response.data.data);
                setStats({
                    totalReviews: response.data.totalReviews,
                    averageRating: response.data.averageRating
                });
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchVerifiedReviews();
    }, []);

    return (
        <section className="py-12 md:py-20 overflow-hidden">
            <div className="container mx-auto px-4 md:px-10">
                <h2 className="text-2xl md:text-4xl font-bold text-center text-slate-900 mb-16 font-outfit">
                    Here is What our Customers Say
                </h2>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 items-center lg:items-start">
                    {/* Header for Mobile/Tablet (sm, md) - logo and button row */}
                    <div className="lg:hidden flex justify-between items-center w-full mb-10 px-2">
                        <img src={Logo} alt="Naatu Sakkarai Logo" className="h-14 md:h-20 w-auto object-contain" />
                        <button 
                            onClick={() => navigate('/write-review')}
                            className="bg-[#f39c12] hover:bg-[#e67e22] text-white font-bold py-2.5 px-6 rounded-full flex items-center justify-between gap-4 transition-all transform hover:scale-105 shadow-md text-sm md:text-base"
                        >
                           Write a Review
                        </button>
                    </div>

                    {/* Left Section: Summary & Action for Desktop (lg+) */}
                    <div className="w-full lg:w-[30%] hidden lg:flex flex-col items-center lg:items-start">
                        <div className="mb-6">
                            <img src={Logo} alt="Naatu Sakkarai Logo" className="h-20 w-auto object-contain" />
                        </div>
                        
                        <div className="flex flex-col items-center lg:items-start mb-6 w-full">
                            <div className="text-5xl font-bold text-slate-900 mb-3">
                                {stats.averageRating > 0 ? `${stats.averageRating}/5` : "5.0/5"}
                            </div>
                            <div className="flex gap-1 text-orange-400 text-2xl mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={i < Math.round(stats.averageRating || 5) ? "" : "opacity-30"} />
                                ))}
                            </div>
                            <div className="text-sm text-slate-500 mb-4 font-medium">
                                Based on {stats.totalReviews || 0} reviews
                            </div>

                            
                            <button 
                                onClick={() => navigate('/write-review')}
                                className="bg-[#f39c12] hover:bg-[#e67e22] text-white font-bold py-3 px-8 rounded-full flex items-center justify-between gap-4 transition-all transform hover:scale-105 shadow-md"
                            >
                                Write a Review
                            </button>
                        </div>
                    </div>

                    {/* Right Section: Testimonial Slider */}
                    <div className="w-full lg:w-[70%]">
                        {loading ? (
                            <div className="flex justify-center items-center h-48">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                            </div>
                        ) : reviews.length > 0 ? (
                            <Swiper
                                modules={[Autoplay, Pagination]}
                                spaceBetween={30}
                                slidesPerView={1}
                                autoplay={{
                                    delay: 5000,
                                    disableOnInteraction: false,
                                }}
                                pagination={{
                                    clickable: true,
                                    bulletClass: 'swiper-pagination-bullet',
                                    bulletActiveClass: 'swiper-pagination-bullet-active'
                                }}
                                breakpoints={{
                                    768: { slidesPerView: 2 },
                                    1024: { slidesPerView: 2 }
                                }}
                                className="pb-16 testimonial-swiper !px-2"
                            >
                                {reviews.map((review) => (
                                    <SwiperSlide key={review._id}>
                                        <div className="bg-white p-8 md:p-10 rounded-xl border border-slate-200 h-full flex flex-col min-h-[320px] shadow-sm">
                                            <p className="text-slate-700 text-base md:text-lg mb-10 leading-relaxed font-normal">
                                                {review.comment}
                                            </p>
                                            
                                            <div className="mt-auto flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-full overflow-hidden bg-[#feeec8] flex items-center justify-center flex-shrink-0">
                                                    <svg viewBox="0 0 24 24" className="w-12 h-12 text-[#f39c12]" fill="currentColor">
                                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                                                    </svg>
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="flex text-orange-400 text-sm mb-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar key={i} className={i < review.rating ? "" : "text-slate-200"} />
                                                        ))}
                                                    </div>
                                                    <span className="font-bold text-slate-900 text-lg font-outfit">{review.name}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <div className="bg-white border border-dashed border-slate-300 rounded-xl p-16 text-center text-slate-400 font-medium">
                                No testimonials yet. Be the first to leave a review!
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: `
                .testimonial-swiper .swiper-pagination {
                    bottom: 0 !important;
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                }
                .testimonial-swiper .swiper-pagination-bullet {
                    width: 10px;
                    height: 10px;
                    background: #ccc;
                    opacity: 1;
                    margin: 0 !important;
                    transition: all 0.3s ease;
                }
                .testimonial-swiper .swiper-pagination-bullet-active {
                    background: #76a33a !important;
                }
            `}} />
        </section>
    );

};

export default TestimonialSection;
