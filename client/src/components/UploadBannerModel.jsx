import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { FiUpload, FiMonitor, FiSmartphone, FiImage, FiPlus, FiHash, FiType, FiCheck } from 'react-icons/fi';
import uploadImage from '../utils/UploadImage';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { toast } from 'sonner';
import AxiosToastError from '../utils/AxiosToastError';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const UploadBannerModel = ({ close, fetchData, bannerData = null }) => {
  const [data, setData] = useState({
    altText: '',
    desktopImage: '',
    mobileImage: '',
    order: 0
  });
  const [loading, setLoading] = useState(false);
  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);

  useEffect(() => {
    if (bannerData) {
      setData({
        _id: bannerData._id,
        altText: bannerData.altText || '',
        desktopImage: bannerData.desktopImage || '',
        mobileImage: bannerData.mobileImage || '',
        order: bannerData.order || 0
      });
    }
  }, [bannerData]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateFile = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 5MB limit.");
      return false;
    }
    return true;
  };

  const handleUploadImage = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!validateFile(file)) return;

    if (type === 'desktop') setUploadingDesktop(true);
    if (type === 'mobile') setUploadingMobile(true);

    try {
        const response = await uploadImage(file, 'banners');
        const { data: imageResponse } = response;
        
        if (imageResponse.success) {
            setData((prev) => ({
                ...prev,
                [type === 'desktop' ? 'desktopImage' : 'mobileImage']: imageResponse.data.url
            }));
            toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} image uploaded`);
        } else {
            toast.error(imageResponse.message || "Upload failed");
        }
    } catch (error) {
        AxiosToastError(error);
    } finally {
        if (type === 'desktop') setUploadingDesktop(false);
        if (type === 'mobile') setUploadingMobile(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.desktopImage || !data.mobileImage) {
        toast.error("Please upload both desktop and mobile images");
        return;
    }

    try {
      setLoading(true);
      const api = bannerData ? SummaryApi.updateBanner : SummaryApi.addBanner;
      const response = await Axios({
        ...api,
        data
      });
      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        close();
        fetchData();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" 
        onClick={close} 
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-zoom-in">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{bannerData ? 'Edit Banner' : 'Upload New Banner'}</h3>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-0.5">Homepage Slider</p>
          </div>
          <button 
            onClick={close}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
          >
            <IoClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Inputs Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <FiType className="text-gray-400" />
                <span>Alt Text (SEO)</span>
              </label>
              <input
                type="text"
                name="altText"
                value={data.altText}
                onChange={handleOnChange}
                placeholder="e.g. Summer Collection 2024"
                className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-green-500 focus:bg-white rounded-xl outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
              />
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <FiHash className="text-gray-400" />
                <span>Display Order</span>
              </label>
              <input
                type="number"
                name="order"
                value={data.order}
                onChange={handleOnChange}
                className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-green-500 focus:bg-white rounded-xl outline-none transition-all font-medium text-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Desktop Upload Container */}
            <div className={`relative group/desktop p-6 rounded-2xl border-2 border-dashed transition-all ${data.desktopImage ? 'border-green-200 bg-green-50/30' : 'border-gray-200 hover:border-green-400 bg-gray-50/50'}`}>
              <div className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${data.desktopImage ? 'bg-green-600 text-white' : 'bg-white text-gray-400'}`}>
                  <FiMonitor size={24} />
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Desktop Image</h4>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight mb-4">Max 5MB • 1920×500 approx.</p>
                
                {data.desktopImage ? (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden shadow-md group">
                    <img src={data.desktopImage} alt="desktop preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="cursor-pointer px-4 py-2 bg-white text-gray-900 text-xs font-bold rounded-lg shadow-xl active:scale-95 transition-transform">
                        Change Image
                        <input hidden accept="image/*" type="file" onChange={(e) => handleUploadImage(e, 'desktop')} />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer w-full py-10 flex flex-col items-center gap-3 active:scale-95 transition-transform">
                    <div className="p-3 rounded-full bg-white text-green-600 shadow-md">
                      <FiUpload size={20} />
                    </div>
                    <span className="text-xs font-bold text-green-600">Click to Upload</span>
                    <input hidden accept="image/*" type="file" onChange={(e) => handleUploadImage(e, 'desktop')} />
                    {uploadingDesktop && <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-2xl animate-pulse"><div className="w-6 h-6 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div></div>}
                  </label>
                )}
              </div>
              {uploadingDesktop && <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-2xl z-30"><div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div></div>}
            </div>

            {/* Mobile Upload Container */}
            <div className={`relative group/mobile p-6 rounded-2xl border-2 border-dashed transition-all ${data.mobileImage ? 'border-green-200 bg-green-50/30' : 'border-gray-200 hover:border-green-400 bg-gray-50/50'}`}>
              <div className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${data.mobileImage ? 'bg-green-600 text-white' : 'bg-white text-gray-400'}`}>
                  <FiSmartphone size={24} />
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Mobile Image</h4>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight mb-4">Max 5MB • 800×1000 approx.</p>
                
                {data.mobileImage ? (
                  <div className="relative w-24 h-32 mx-auto rounded-xl overflow-hidden shadow-md group">
                    <img src={data.mobileImage} alt="mobile preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="cursor-pointer p-2 bg-white text-gray-900 rounded-lg shadow-xl active:scale-95 transition-transform">
                        <FiUpload size={14} />
                        <input hidden accept="image/*" type="file" onChange={(e) => handleUploadImage(e, 'mobile')} />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer w-full py-10 flex flex-col items-center gap-3 active:scale-95 transition-transform">
                    <div className="p-3 rounded-full bg-white text-green-600 shadow-md">
                      <FiUpload size={20} />
                    </div>
                    <span className="text-xs font-bold text-green-600">Click to Upload</span>
                    <input hidden accept="image/*" type="file" onChange={(e) => handleUploadImage(e, 'mobile')} />
                    {uploadingMobile && <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-2xl animate-pulse"></div>}
                  </label>
                )}
              </div>
              {uploadingMobile && <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-2xl z-30"><div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div></div>}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={close}
              disabled={loading || uploadingDesktop || uploadingMobile}
              className="flex-1 px-6 py-4 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all active:scale-95"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              disabled={!data.desktopImage || !data.mobileImage || loading || uploadingDesktop || uploadingMobile}
              className="flex-[2] px-6 py-4 text-sm font-bold text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:cursor-not-allowed rounded-2xl shadow-xl shadow-green-100 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  {bannerData ? <FiCheck size={20} /> : <FiPlus size={20} />}
                  <span>{bannerData ? 'Update Banner' : 'Activate Banner'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadBannerModel;
