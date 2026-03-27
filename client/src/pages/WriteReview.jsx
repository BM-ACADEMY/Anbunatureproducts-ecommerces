import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { FaStar, FaUser } from 'react-icons/fa';
import Breadcrumbs from '../components/Breadcrumbs';


const WriteReview = () => {
    const [formData, setFormData] = useState({
        name: '',
        rating: 5,
        comment: ''
    });


    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visibleCount, setVisibleCount] = useState(6);
    
    const navigate = useNavigate();

    useEffect(() => {
        fetchVerifiedReviews();
    }, []);



    const fetchVerifiedReviews = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.getVerifiedSiteReviews
            });
            if (response.data.success) {
                setReviews(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 6);
    };


    const handleRatingChange = (newRating) => {
        setFormData(prev => ({ ...prev, rating: newRating }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'comment' && value.length > 200) return;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await Axios({
                ...SummaryApi.submitSiteReview,
                data: {
                    name: formData.name,
                    rating: formData.rating,
                    comment: formData.comment
                }
            });


            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen bg-[#fdf5e6] py-12 px-4 md:px-10">
            <div className="max-w-[1400px] mx-auto">
                <div className="mb-6 -mt-4">
                    <Breadcrumbs />
                </div>
                {/* Header */}
                <div className="text-center mb-16">
                    <p className="text-[#88b04b] font-bold text-lg mb-2">Why People Love Us</p>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 font-outfit">Reviews from our naatu's family</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Left side: Existing reviews grid */}
                    <div className="w-full lg:w-[65%] flex flex-col gap-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-fit">
                            {reviews.length > 0 ? (
                                reviews.slice(0, visibleCount).map((review) => (
                                    <div key={review._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col min-h-[180px]">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                                <FaUser size={18} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 text-sm">{review.name}</span>
                                                <div className="flex text-orange-400 text-[10px]">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar key={i} className={i < review.rating ? "" : "text-slate-200"} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-slate-600 text-sm leading-relaxed mb-2 line-clamp-3">
                                                {review.comment}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full h-64 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl text-slate-400">
                                    No reviews to display yet.
                                </div>
                            )}
                        </div>
                        
                        {reviews.length > visibleCount && (
                            <div className="flex justify-center mt-4">
                                <button 
                                    onClick={handleLoadMore}
                                    className="bg-[#76a33a] hover:bg-[#688f33] text-white font-bold py-2.5 px-10 rounded-[10px] shadow-sm transition-all transform hover:scale-105 active:scale-95"
                                >
                                    Load More
                                </button>
                            </div>
                        )}
                    </div>


                    {/* Right side: Form Card */}
                    <div className="w-full lg:w-[35%]">
                        <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-50 p-8 md:p-10 sticky top-10">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Rating */}
                                <div className="flex items-center">
                                    <label className="text-xs font-bold text-slate-700 w-24">
                                        <span className="text-red-500 mr-1">*</span>Rating:
                                    </label>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => handleRatingChange(star)}
                                                className="text-xl transition-all"
                                            >
                                                <FaStar className={star <= formData.rating ? "text-orange-400" : "text-slate-200"} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Name */}
                                <div className="flex items-center">
                                    <label className="text-xs font-bold text-slate-700 w-24">
                                        <span className="text-red-500 mr-1">*</span>Name:
                                    </label>
                                    <input 
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter Name"
                                        className="flex-1 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#88b04b] transition-all"
                                        required
                                    />
                                </div>

                                {/* Comment */}
                                <div className="flex items-start">

                                    <label className="text-xs font-bold text-slate-700 w-24 mt-3">
                                        <span className="text-red-500 mr-1">*</span>Comment:
                                    </label>
                                    <div className="flex-1 relative">
                                        <textarea 
                                            name="comment"
                                            value={formData.comment}
                                            onChange={handleChange}
                                            placeholder="Enter Message"
                                            rows="6"
                                            className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#88b04b] transition-all resize-none"
                                            required
                                        ></textarea>
                                        <div className="absolute bottom-2 right-3 text-[10px] text-slate-400">
                                            {formData.comment.length}/200
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-center pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-[#76a33a] hover:bg-[#688f33] text-white font-bold py-2 px-12 rounded-lg shadow-sm transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? "..." : "Submit"}
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WriteReview;

