import React, { useEffect, useState } from "react";
import { FiHeart, FiSave, FiRefreshCw, FiPlus, FiTrash2, FiEdit } from "react-icons/fi";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { toast } from "sonner";

const FoundationAdmin = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [amounts, setAmounts] = useState([10, 20, 50, 100]);
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [newAmount, setNewAmount] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [originalData, setOriginalData] = useState(null);

    const fetchFoundation = async () => {
        try {
            setFetching(true);
            const response = await Axios({ ...SummaryApi.getFoundation });
            if (response.data.success && response.data.data) {
                const data = response.data.data;
                setTitle(data.title || "");
                setDescription(data.description || "");
                setAmounts(data.amounts || [10, 20, 50, 100]);
                setIsActive(data.isActive ?? true);
                setOriginalData({
                    title: data.title || "",
                    description: data.description || "",
                    amounts: data.amounts || [10, 20, 50, 100],
                    isActive: data.isActive ?? true
                });
            }
        } catch (error) {
            console.error("Error fetching foundation settings", error);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchFoundation();
    }, []);

    const startEditing = () => {
        setIsEditing(true);
    };

    const cancelEditing = () => {
        if (originalData) {
            setTitle(originalData.title);
            setDescription(originalData.description);
            setAmounts(originalData.amounts);
            setIsActive(originalData.isActive);
        }
        setIsEditing(false);
        setNewAmount("");
    };

    const handleSave = async () => {
        if (!title.trim()) {
            toast.error("Title cannot be empty");
            return;
        }

        setLoading(true);
        try {
            const response = await Axios({
                ...SummaryApi.updateFoundation,
                data: { title: title.trim(), description: description.trim(), amounts, isActive }
            });
            if (response.data.success) {
                toast.success("Foundation settings updated successfully!");
                setOriginalData({ title: title.trim(), description: description.trim(), amounts, isActive });
                setIsEditing(false);
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    const addAmount = () => {
        const val = parseInt(newAmount);
        if (isNaN(val) || val <= 0) {
            toast.error("Please enter a valid positive amount");
            return;
        }
        if (amounts.includes(val)) {
            toast.error("Amount already exists");
            return;
        }
        setAmounts([...amounts, val].sort((a, b) => a - b));
        setNewAmount("");
    };

    const removeAmount = (amount) => {
        setAmounts(amounts.filter(a => a !== amount));
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center py-20">
                <FiRefreshCw size={24} className="animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-gray-800">Foundation Settings</h1>
                    <p className="text-gray-500 text-sm mt-0.5">
                        Configure donation options for the checkout process.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {!isEditing ? (
                        <button
                            onClick={startEditing}
                            className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-all flex items-center gap-2"
                        >
                            <FiEdit size={14} /> Edit Settings
                        </button>
                    ) : (
                        <button
                            onClick={cancelEditing}
                            className="px-4 py-1.5 bg-white text-gray-600 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                    )}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-md border border-gray-200">
                        <span className="text-xs font-medium text-gray-600">Status:</span>
                        <div className={`w-2 h-2 rounded-full ${isActive ? "bg-green-500" : "bg-gray-300"}`}></div>
                        <span className="text-xs font-medium text-gray-700">{isActive ? "Active" : "Inactive"}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Preview Section (Left) */}
                <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-5 sticky top-24">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-pink-50 rounded-md">
                                    <FiHeart size={14} className="text-pink-400" />
                                </div>
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Live Preview</span>
                            </div>
                            <img src="/assets/common/logoheader.webp" alt="Logo" className="h-6 w-auto opacity-80" />
                        </div>
                        
                        <div className="bg-white rounded-xl border border-gray-100 shadow-md p-5 space-y-4">
                            <div className="space-y-1">
                                <h4 className="text-md font-semibold text-gray-800 leading-tight">{title || "Support our Cause"}</h4>
                                <p className="text-xs text-gray-500 line-clamp-2">{description || "Your contribution makes a difference."}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                                {amounts.slice(0, 6).map((amount) => (
                                    <div
                                        key={amount}
                                        className="px-3 py-2 rounded-lg border border-gray-200 text-center text-sm font-medium text-gray-700 hover:border-blue-400 hover:text-blue-600 cursor-pointer transition-all"
                                    >
                                        ₹{amount}
                                    </div>
                                ))}
                            </div>
                            
                            <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-400 italic">
                                <span>100% goes to cause</span>
                                <span>Tax exempt</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-400 text-center mt-4">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Editor Section (Right) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-opacity ${!isEditing ? "opacity-75" : "opacity-100"}`}>
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-800">General Configuration</h3>
                            <button
                                disabled={!isEditing}
                                onClick={() => setIsActive(!isActive)}
                                className={`text-xs px-2.5 py-1 rounded-full transition-colors ${isActive ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-100 text-gray-600 border border-gray-200"
                                    } ${!isEditing ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                            >
                                {isActive ? "Enabled" : "Disabled"}
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">Display Title</label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className={`w-full px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none text-gray-700 transition-all text-sm ${!isEditing ? "bg-gray-50 text-gray-500" : "bg-white"}`}
                                    placeholder="e.g., Donate to Anbu Foundation"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">Description Text</label>
                                <textarea
                                    rows={3}
                                    disabled={!isEditing}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className={`w-full px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none text-gray-700 transition-all text-sm resize-none ${!isEditing ? "bg-gray-50 text-gray-500" : "bg-white"}`}
                                    placeholder="Briefly explain the cause..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-opacity ${!isEditing ? "opacity-75" : "opacity-100"}`}>
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-800">Donation Amounts</h3>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="flex flex-wrap gap-2">
                                {amounts.length > 0 ? (
                                    amounts.map(amt => (
                                        <div key={amt} className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100 group transition-all hover:border-blue-300">
                                            <span className="text-sm font-medium text-blue-700">₹{amt}</span>
                                            {isEditing && (
                                                <button 
                                                    onClick={() => removeAmount(amt)} 
                                                    className="text-blue-400 hover:text-red-500 transition-colors"
                                                    title="Remove amount"
                                                >
                                                    <FiTrash2 size={12} />
                                                </button>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-400 italic py-2">No donation amounts defined.</p>
                                )}
                            </div>

                            <div className="pt-4 border-t border-gray-50">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">Add Custom Amount</label>
                                <div className="flex gap-2 max-w-md">
                                    <div className="relative flex-1">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                                        <input
                                            type="number"
                                            disabled={!isEditing}
                                            value={newAmount}
                                            onChange={(e) => setNewAmount(e.target.value)}
                                            className={`w-full pl-7 pr-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 outline-none text-sm text-gray-700 ${!isEditing ? "bg-gray-50 text-gray-500" : "bg-white"}`}
                                            placeholder="Enter amount"
                                        />
                                    </div>
                                    <button
                                        disabled={!isEditing}
                                        onClick={addAmount}
                                        className={`bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-blue-50 transition-all whitespace-nowrap ${!isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        <FiPlus size={14} /> Add Amount
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="flex justify-end pt-2">
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="px-10 py-2.5 bg-blue-600 text-white rounded-md font-medium flex items-center justify-center gap-2 text-sm hover:bg-blue-700 shadow-md transition-all disabled:bg-gray-300 disabled:shadow-none active:scale-[0.98]"
                            >
                                {loading ? <FiRefreshCw className="animate-spin" size={16} /> : <FiSave size={16} />}
                                Save Foundation Settings
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FoundationAdmin;

