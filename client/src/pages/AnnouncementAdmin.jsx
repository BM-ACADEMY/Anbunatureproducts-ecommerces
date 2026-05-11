import React, { useEffect, useState } from "react";
import { FiVolume2, FiSave, FiRefreshCw } from "react-icons/fi";
import { LuTruck } from "react-icons/lu";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { toast } from "sonner";

const MAX_CHARS = 120;

const AnnouncementAdmin = () => {
    const [text, setText] = useState("");
    const [savedText, setSavedText] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const fetchAnnouncement = async () => {
        try {
            setFetching(true);
            const response = await Axios({ ...SummaryApi.getAnnouncement });
            if (response.data.success && response.data.data) {
                setText(response.data.data.text || "");
                setSavedText(response.data.data.text || "");
                setIsActive(response.data.data.isActive ?? true);
            }
        } catch (error) {
            // No existing announcement yet
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchAnnouncement();
    }, []);

    const handleSave = async () => {
        if (!text.trim()) {
            toast.error("Announcement text cannot be empty");
            return;
        }
        if (text.length > MAX_CHARS) {
            toast.error(`Text exceeds ${MAX_CHARS} character limit`);
            return;
        }

        setLoading(true);
        try {
            const response = await Axios({
                ...SummaryApi.updateAnnouncement,
                data: { text: text.trim(), isActive }
            });
            if (response.data.success) {
                toast.success("Announcement updated successfully!");
                setSavedText(response.data.data.text);
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    const isModified = text !== savedText;
    const charCount = text.length;
    const isOverLimit = charCount > MAX_CHARS;

    if (fetching) {
        return (
            <div className="flex items-center justify-center py-20">
                <FiRefreshCw size={24} className="animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Announcement Bar</h1>
                <p className="text-slate-500 font-medium text-sm mt-1">
                    Manage the scrolling text shown at the top of your website header.
                </p>
            </div>

            {/* Live Preview */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                    <FiVolume2 size={16} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Preview</span>
                </div>
                <div className="bg-[#fdf5e6] py-2.5 overflow-hidden whitespace-nowrap border-b border-gray-100">
                    <div className="inline-block animate-marquee">
                        <div className="flex items-center space-x-12">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center space-x-2">
                                    <LuTruck size={18} className="text-green-700" />
                                    <span className="text-sm font-semibold text-gray-800 uppercase tracking-widest whitespace-nowrap">
                                        {text || "Your announcement text here..."}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Editor Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-800">Edit Announcement Text</h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Maximum {MAX_CHARS} characters allowed</p>
                </div>

                <div className="p-6 space-y-5">
                    {/* Text Input */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">
                            Announcement Message
                        </label>
                        <div className="relative">
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS + 10))}
                                maxLength={MAX_CHARS + 10}
                                rows={3}
                                placeholder="e.g. Free delivery on orders above ₹500 across India"
                                className={`w-full px-5 py-4 rounded-2xl border-2 transition-all font-semibold text-slate-700 outline-none resize-none ${isOverLimit
                                        ? "border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-4 focus:ring-red-50"
                                        : "border-slate-200 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50/50"
                                    }`}
                            />
                        </div>
                        {/* Character Counter */}
                        <div className="flex items-center justify-between px-1">
                            <span className="text-[11px] font-bold text-slate-400">
                                {isOverLimit ? "⚠️ Text too long" : ""}
                            </span>
                            <span className={`text-xs font-black tabular-nums ${isOverLimit ? "text-red-500" : charCount > MAX_CHARS * 0.9 ? "text-amber-500" : "text-slate-400"
                                }`}>
                                {charCount} / {MAX_CHARS}
                            </span>
                        </div>
                    </div>

                    {/* Active Toggle */}
                    {/* Active Toggle */}
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div>
                            <p className="text-sm font-bold text-slate-700">Show Announcement</p>
                            <p className="text-[11px] text-slate-400 font-medium">Visibility on website</p>
                        </div>
                        <button
                            onClick={() => setIsActive(!isActive)}
                            className={`relative w-10 h-6 rounded-full transition-colors duration-300 ${isActive ? "bg-green-500" : "bg-slate-300"
                                }`}
                        >
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${isActive ? "translate-x-4" : "translate-x-0"
                                }`} />
                        </button>
                    </div>

                    {/* Save Button */}
                    {/* Save Button */}
                    <div className="flex justify-end pt-2"> {/* Added a wrapper to align it to the right */}
                        <button
                            onClick={handleSave}
                            disabled={!isModified || isOverLimit || loading}
                            className={`px-8 py-2.5 rounded-xl font-bold flex items-center justify-center gap-3 text-sm transition-all ${!isModified || isOverLimit || loading
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    : "bg-slate-900 text-white hover:bg-black shadow-md active:scale-[0.98]"
                                }`}
                        >
                            {loading ? (
                                <><FiRefreshCw className="animate-spin" size={16} /> Saving...</>
                            ) : (
                                <><FiSave size={16} /> Save Announcement</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementAdmin;
