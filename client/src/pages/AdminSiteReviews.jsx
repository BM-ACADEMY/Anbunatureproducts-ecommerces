import React, { useEffect, useState } from 'react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { toast } from 'sonner';
import { FaCheckCircle, FaTrash, FaTimesCircle, FaStar, FaPlus, FaTimes } from 'react-icons/fa';

import NoData from '../components/NoData';

const AdminSiteReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newReview, setNewReview] = useState({
        name: '',
        rating: 5,
        comment: ''
    });
    const [submitting, setSubmitting] = useState(false);


    const fetchAllReviews = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.getAllSiteReviews
            });
            if (response.data.success) {
                setReviews(response.data.data);
            }
        } catch (error) {
            toast.error("Failed to fetch reviews");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllReviews();
    }, []);

    const handleVerifyToken = async (id, isVerified) => {
        try {
            const response = await Axios({
                url: `${SummaryApi.verifySiteReview.url}/${id}`,
                method: SummaryApi.verifySiteReview.method,
                data: { isVerified }
            });

            if (response.data.success) {
                toast.success(response.data.message);
                setReviews(prev => prev.map(r => r._id === id ? { ...r, isVerified } : r));
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Verification failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;

        try {
            const response = await Axios({
                url: `${SummaryApi.deleteSiteReview.url}/${id}`,
                method: SummaryApi.deleteSiteReview.method
            });

            if (response.data.success) {
                toast.success(response.data.message);
                setReviews(prev => prev.filter(r => r._id !== id));
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Delete failed");
        }
    };

    const handleAddReview = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await Axios({
                ...SummaryApi.submitSiteReview,
                data: newReview
            });

            if (response.data.success) {
                toast.success("Review added successfully");
                setShowAddModal(false);
                setNewReview({ name: '', rating: 5, comment: '' });
                fetchAllReviews(); // Refresh list to see the new one
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to add review");
        } finally {
            setSubmitting(false);
        }
    };

    return (

        <div className="p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-slate-100 min-h-[80vh]">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Site Reviews</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage and verify reviews shown on the homepage</p>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setShowAddModal(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95"
                    >
                        <FaPlus size={14} /> Add Review
                    </button>
                    <div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-full text-sm font-bold border border-orange-100">
                        Total: {reviews.length}
                    </div>
                </div>
            </div>

            {/* Add Review Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800">Add New Review</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <FaTimes size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddReview} className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Customer Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newReview.name}
                                    onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter name"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                                            className="text-2xl transition-all hover:scale-110"
                                        >
                                            <FaStar className={star <= newReview.rating ? "text-orange-400" : "text-slate-200"} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Comment</label>
                                <textarea 
                                    required
                                    rows="4"
                                    maxLength="200"
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                                    placeholder="Review message (max 200 chars)"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all resize-none font-medium"
                                ></textarea>
                                <div className="text-[10px] text-slate-400 mt-1 text-right">{newReview.comment.length}/200</div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button 
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all disabled:opacity-50 active:scale-95 py-3"
                                >
                                    {submitting ? "Adding..." : "Add Review"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
            ) : reviews.length > 0 ? (
                <div className="overflow-x-auto custom-scrollbar rounded-xl border border-slate-100">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Rating</th>
                                <th className="px-6 py-4 w-1/3">Comment</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {reviews.map((review) => (
                                <tr key={review._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                                                {review.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-bold text-slate-700 text-sm whitespace-nowrap">{review.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex text-orange-400 gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} size={12} className={i < review.rating ? "" : "text-slate-200"} />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-600 line-clamp-2 max-w-xs">{review.comment}</p>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {review.isVerified ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold border border-green-100">
                                                <FaCheckCircle size={10} /> Verified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold border border-amber-100">
                                                <FaTimesCircle size={10} /> Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleVerifyToken(review._id, !review.isVerified)}
                                                className={`p-2 rounded-lg transition-all ${
                                                    review.isVerified 
                                                    ? 'text-amber-500 hover:bg-amber-50' 
                                                    : 'text-green-600 hover:bg-green-50'
                                                }`}
                                                title={review.isVerified ? "Unverify" : "Verify"}
                                            >
                                                {review.isVerified ? <FaTimesCircle size={18} /> : <FaCheckCircle size={18} />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(review._id)}
                                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                                title="Delete"
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <NoData />
            )}
        </div>
    );
};

export default AdminSiteReviews;
