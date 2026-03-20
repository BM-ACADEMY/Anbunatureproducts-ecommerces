import React, { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import NoData from '../components/NoData';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import CofirmBox from '../components/CofirmBox';
import { toast } from 'sonner';
import AxiosToastError from '../utils/AxiosToastError';
import { FiPlus, FiTrash2, FiMonitor, FiSmartphone, FiHash, FiEdit3 } from 'react-icons/fi';
import UploadBannerModel from '../components/UploadBannerModel';

const BannerAdmin = () => {
    const [openUploadBanner, setOpenUploadBanner] = useState(false);
    const [loading, setLoading] = useState(false);
    const [bannerData, setBannerData] = useState([]);
    const [openConfimBoxDelete, setOpenConfirmBoxDelete] = useState(false);
    const [deleteBannerId, setDeleteBannerId] = useState("");
    const [editData, setEditData] = useState(null);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const response = await Axios({ ...SummaryApi.getBanners });
            const { data: responseData } = response;

            if (responseData.success) {
                setBannerData(responseData.data);
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBanner = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.deleteBanner,
                data: { id: deleteBannerId }
            });

            const { data: responseData } = response;

            if (responseData.success) {
                toast.success(responseData.message);
                fetchBanners();
                setOpenConfirmBoxDelete(false);
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Homepage Banners</h1>
                    <p className="text-gray-500 text-sm mt-1 font-medium">
                        Manage your homepage slider. ({bannerData.length}/5 banners)
                    </p>
                </div>

                <button
                    disabled={bannerData.length >= 5}
                    onClick={() => {
                        setEditData(null);
                        setOpenUploadBanner(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-green-100 transition-all active:scale-95 whitespace-nowrap"
                >
                    <FiPlus size={20} />
                    <span>Add Banner</span>
                </button>
            </div>

            {/* No Data */}
            {!bannerData[0] && !loading && <NoData />}

            {/* Banner Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {bannerData.map((banner) => (
                    <div 
                        key={banner._id} 
                        className="group bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                        {/* Images Section */}
                        <div className="flex flex-col lg:flex-row h-full">
                            {/* Desktop View */}
                            <div className="relative flex-1 bg-gray-50">
                                <img
                                    src={banner.desktopImage}
                                    alt={banner.altText}
                                    className="w-full h-48 lg:h-[260px] object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">
                                    <FiMonitor size={12} />
                                    <span>Desktop</span>
                                </div>
                            </div>
                            
                            {/* Mobile View */}
                            <div className="relative w-full lg:w-48 bg-gray-100 border-t lg:border-t-0 lg:border-l border-gray-100">
                                <img
                                    src={banner.mobileImage}
                                    alt={banner.altText}
                                    className="w-full h-48 lg:h-full object-cover"
                                />
                                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-green-600/80 backdrop-blur-md rounded-lg text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">
                                    <FiSmartphone size={12} />
                                    <span>Mobile</span>
                                </div>
                            </div>
                        </div>

                        {/* Content & Actions */}
                        <div className="p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                                        <FiHash size={14} className="text-gray-400" />
                                        <span>Display Order: <span className="text-gray-900 font-bold">{banner.order}</span></span>
                                    </div>
                                    <div className="text-gray-400 text-xs italic">
                                        Alt: {banner.altText || "No text provided"}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setEditData(banner);
                                            setOpenUploadBanner(true);
                                        }}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-green-600 border border-green-600/20 hover:bg-green-600 hover:text-white rounded-xl transition-all active:scale-95 group/btn"
                                    >
                                        <FiEdit3 size={16} />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setOpenConfirmBoxDelete(true);
                                            setDeleteBannerId(banner._id);
                                        }}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-red-500 hover:text-white bg-red-50 hover:bg-red-500 rounded-xl transition-all active:scale-95 group/btn"
                                    >
                                        <FiTrash2 size={16} className="transition-colors group-hover/btn:text-white" />
                                        <span>Remove</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Loading */}
            {loading && <Loading />}

            {/* Modals */}
            {openUploadBanner && (
                <UploadBannerModel
                    fetchData={fetchBanners}
                    close={() => {
                        setOpenUploadBanner(false);
                        setEditData(null);
                    }}
                    bannerData={editData}
                />
            )}

            {openConfimBoxDelete && (
                <CofirmBox
                    confirm={handleDeleteBanner}
                    cancel={() => setOpenConfirmBoxDelete(false)}
                    close={() => setOpenConfirmBoxDelete(false)}
                />
            )}
        </div>
    );
};

export default BannerAdmin;
