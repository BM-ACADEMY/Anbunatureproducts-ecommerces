import React, { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import NoData from '../components/NoData';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import CofirmBox from '../components/CofirmBox';
import { toast } from 'sonner';
import AxiosToastError from '../utils/AxiosToastError';
import { FiPlus, FiTrash2, FiMonitor, FiSmartphone, FiHash, FiEdit3, FiLink } from 'react-icons/fi';
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
                        className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
                    >
                        {/* Images Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-px bg-gray-100 h-64 lg:h-72">
                            {/* Desktop View */}
                            <div className="sm:col-span-8 relative bg-white overflow-hidden group/img">
                                <img
                                    src={banner.desktopImage}
                                    alt={banner.altText}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-lg text-gray-700 text-[10px] font-bold uppercase tracking-wider shadow-sm border border-gray-100">
                                    <FiMonitor size={12} className="text-blue-500" />
                                    <span>Desktop</span>
                                </div>
                            </div>
                            
                            {/* Mobile View */}
                            <div className="sm:col-span-4 relative bg-gray-50 overflow-hidden group/img">
                                <img
                                    src={banner.mobileImage}
                                    alt={banner.altText}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-lg text-gray-700 text-[10px] font-bold uppercase tracking-wider shadow-sm border border-gray-100">
                                    <FiSmartphone size={12} className="text-emerald-500" />
                                    <span>Mobile</span>
                                </div>
                            </div>
                        </div>

                        {/* Content & Actions */}
                        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white border-t border-gray-100">
                            <div className="space-y-3 flex-1">
                                <div className="flex items-center gap-3">
                                    <div className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-[11px] font-bold uppercase tracking-wider">
                                        Order #{banner.order}
                                    </div>
                                    {banner.link && (
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-md text-[11px] font-bold uppercase tracking-wider">
                                            <FiLink size={10} />
                                            <span>Clickable</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-gray-400 group/link overflow-hidden">
                                        <FiLink size={13} className="flex-shrink-0 text-gray-300" />
                                        <span className="text-[14px] font-medium text-gray-600 truncate">
                                            {banner.link || "Internal Slide (No Link)"}
                                        </span>
                                    </div>
                                    <p className="text-[12px] text-gray-400 font-medium pl-5 truncate">
                                        <span className="uppercase text-[10px] font-bold text-gray-300 mr-2 tracking-tighter">SEO:</span> 
                                        {banner.altText || "Default Banner"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 sm:border-l sm:pl-6 border-gray-100">
                                <button
                                    onClick={() => {
                                        setEditData(banner);
                                        setOpenUploadBanner(true);
                                    }}
                                    className="p-2.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
                                    title="Edit Creative"
                                >
                                    <FiEdit3 size={18} />
                                </button>
                                <button
                                    onClick={() => {
                                        setOpenConfirmBoxDelete(true);
                                        setDeleteBannerId(banner._id);
                                    }}
                                    className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                                    title="Remove Banner"
                                >
                                    <FiTrash2 size={18} />
                                </button>
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
