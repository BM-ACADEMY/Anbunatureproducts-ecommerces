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
  const [desktopImageFile, setDesktopImageFile] = useState(null);
  const [mobileImageFile, setMobileImageFile] = useState(null);
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

    // Create local preview
    const previewUrl = URL.createObjectURL(file);
    if (type === 'desktop') {
        setDesktopImageFile(file);
        setData(prev => ({ ...prev, desktopImage: previewUrl }));
        toast.success("Desktop image preview ready");
    } else {
        setMobileImageFile(file);
        setData(prev => ({ ...prev, mobileImage: previewUrl }));
        toast.success("Mobile image preview ready");
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

      let desktopUrl = data.desktopImage;
      let mobileUrl = data.mobileImage;

      // Upload desktop image if new
      if (desktopImageFile) {
        setUploadingDesktop(true);
        const res = await uploadImage(desktopImageFile, 'banners');
        if (res.data.success) {
            desktopUrl = res.data.data.url;
        } else {
            toast.error("Failed to upload desktop image");
            setLoading(false);
            setUploadingDesktop(false);
            return;
        }
        setUploadingDesktop(false);
      }

      // Upload mobile image if new
      if (mobileImageFile) {
        setUploadingMobile(true);
        const res = await uploadImage(mobileImageFile, 'banners');
        if (res.data.success) {
            mobileUrl = res.data.data.url;
        } else {
            toast.error("Failed to upload mobile image");
            setLoading(false);
            setUploadingMobile(false);
            return;
        }
        setUploadingMobile(false);
      }

      const api = bannerData ? SummaryApi.updateBanner : SummaryApi.addBanner;
      const response = await Axios({
        ...api,
        data: {
            ...data,
            desktopImage: desktopUrl,
            mobileImage: mobileUrl
        }
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
            <label className="block text-base font-medium text-gray-800">Banner Image</label>
            <div className="flex flex-wrap gap-4">
              {/* Desktop Upload Box */}
              <div className="flex flex-col items-center gap-1">
                <label htmlFor="uploadDesktop" className="cursor-pointer">
                  <input 
                    hidden 
                    id="uploadDesktop"
                    accept="image/*" 
                    type="file" 
                    onChange={(e) => handleUploadImage(e, 'desktop')} 
                    disabled={uploadingDesktop}
                  />
                  <img 
                    className="w-24 h-24 object-cover rounded border border-gray-200" 
                    src={data.desktopImage || "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png"} 
                    alt="desktop" 
                  />
                </label>
                <p className="text-[10px] text-center font-bold text-gray-400 uppercase whitespace-nowrap">Desktop (1920x600)</p>
                {uploadingDesktop && <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />}
              </div>

              {/* Mobile Upload Box */}
              <div className="flex flex-col items-center gap-1">
                <label htmlFor="uploadMobile" className="cursor-pointer">
                  <input 
                    hidden 
                    id="uploadMobile"
                    accept="image/*" 
                    type="file" 
                    onChange={(e) => handleUploadImage(e, 'mobile')} 
                    disabled={uploadingMobile}
                  />
                  <img 
                    className="w-24 h-24 object-cover rounded border border-gray-200" 
                    src={data.mobileImage || "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png"} 
                    alt="mobile" 
                  />
                </label>
                <p className="text-[10px] text-center font-bold text-gray-400 uppercase whitespace-nowrap">Mobile (600x300)</p>
                {uploadingMobile && <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />}
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
