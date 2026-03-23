import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { FiUpload, FiUploadCloud, FiMonitor, FiSmartphone, FiImage, FiPlus, FiHash, FiType, FiCheck, FiLink } from 'react-icons/fi';
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
    order: 0,
    link: ''
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
        order: bannerData.order || 0,
        link: bannerData.link || ''
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
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={close} />
      
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        {/* Simple Header with Close Button */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">{bannerData ? 'Edit Banner' : 'Add Banner'}</h3>
          <button onClick={close} className="text-gray-400 hover:text-gray-600 transition-colors">
            <IoClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Labeled Upload Section */}
          <div className="space-y-3">
            <label className="block text-[15px] font-bold text-gray-900">Banner Image</label>
            <div className="flex flex-wrap gap-4">
              {/* Desktop Upload Box */}
              <div className="space-y-1">
                <label className={`w-24 h-24 border-2 border-dashed rounded-md flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${data.desktopImage ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-400 bg-gray-50'}`}>
                  {uploadingDesktop ? (
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  ) : data.desktopImage ? (
                    <img src={data.desktopImage} alt="desktop" className="w-full h-full object-cover rounded-sm" />
                  ) : (
                    <>
                      <FiUploadCloud className="text-gray-400" size={24} />
                      <span className="text-[10px] text-gray-400 font-bold uppercase">Upload</span>
                    </>
                  )}
                  <input hidden accept="image/*" type="file" onChange={(e) => handleUploadImage(e, 'desktop')} />
                </label>
                <p className="text-[10px] text-center font-bold text-gray-400 uppercase">Desktop</p>
              </div>

              {/* Mobile Upload Box */}
              <div className="space-y-1">
                <label className={`w-24 h-24 border-2 border-dashed rounded-md flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${data.mobileImage ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-400 bg-gray-50'}`}>
                  {uploadingMobile ? (
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  ) : data.mobileImage ? (
                    <img src={data.mobileImage} alt="mobile" className="w-full h-full object-cover rounded-sm" />
                  ) : (
                    <>
                      <FiUploadCloud className="text-gray-400" size={24} />
                      <span className="text-[10px] text-gray-400 font-bold uppercase">Upload</span>
                    </>
                  )}
                  <input hidden accept="image/*" type="file" onChange={(e) => handleUploadImage(e, 'mobile')} />
                </label>
                <p className="text-[10px] text-center font-bold text-gray-400 uppercase">Mobile</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[15px] font-medium text-gray-600">Alt Text (SEO)</label>
            <input
              type="text"
              name="altText"
              value={data.altText}
              onChange={handleOnChange}
              placeholder="Type here"
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md outline-none focus:border-blue-500 transition-all font-medium text-gray-700 placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[15px] font-medium text-gray-600">Banner Link (URL)</label>
            <input
              type="text"
              name="link"
              value={data.link}
              onChange={handleOnChange}
              placeholder="Type here"
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md outline-none focus:border-blue-500 transition-all font-medium text-gray-700 placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[15px] font-medium text-gray-600">Display Order</label>
            <input
              type="number"
              name="order"
              value={data.order}
              onChange={handleOnChange}
              placeholder="0"
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md outline-none focus:border-blue-500 transition-all font-medium text-gray-700 placeholder:text-gray-400"
            />
          </div>

          <div className="pt-6 pb-2">
            <button
              type="submit"
              disabled={loading || uploadingDesktop || uploadingMobile}
              className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all active:scale-95 disabled:bg-indigo-300 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Updating...</span>
                </div>
              ) : bannerData ? (
                "Update Banner"
              ) : (
                "Add Banner"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadBannerModel;
