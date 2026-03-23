import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { FiUploadCloud, FiType, FiHash } from 'react-icons/fi';
import { MdOutlineImage } from "react-icons/md";

import uploadImage from '../utils/UploadImage';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { toast } from 'sonner';
import AxiosToastError from '../utils/AxiosToastError';
import Loading from './Loading';

const UploadCategoryModel = ({ close, fetchData }) => {
  const [data, setData] = useState({
    name: '',
    image: '',
    altText: ''
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      let imageUrl = data.image;

      // Upload image if a new file is selected
      if (imageFile) {
        const uploadResponse = await uploadImage(imageFile, 'category');
        const { data: uploadData } = uploadResponse;
        if (uploadData.success) {
          imageUrl = uploadData.data.url;
        } else {
          toast.error("Failed to upload image");
          setLoading(false);
          return;
        }
      }

      const response = await Axios({
        ...SummaryApi.addCategory,
        data: {
          ...data,
          image: imageUrl
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

  const handleUploadCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Size validation: 2MB limit
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    // Create local preview
    const previewUrl = URL.createObjectURL(file);
    setImageFile(file);
    setData((prev) => ({
      ...prev,
      image: previewUrl
    }));
  };

  return (
    <div className='fixed inset-0 z-[1000] flex items-center justify-center p-4'>
      <div className='absolute inset-0 bg-black/50 overflow-hidden' onClick={close} />
      
      <div className='relative bg-white rounded-sm shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b bg-gray-50/50'>
          <h3 className='text-lg font-bold text-gray-800 flex items-center gap-2'>
            Add Category
          </h3>
          <button onClick={close} className='p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all'>
            <IoClose size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-8 space-y-7'>
          {/* Category Name */}
          <div className='space-y-2'>
            <label htmlFor='categoryName' className='block text-[14px] font-bold text-gray-700 uppercase tracking-tight ml-1'>
               Category Name
            </label>
            <div className='relative group'>
              <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors'>
                <FiType size={18} />
              </div>
              <input
                type='text'
                id='categoryName'
                name='name'
                placeholder='Type here'
                value={data.name}
                onChange={handleOnChange}
                className='w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-gray-700 placeholder:text-gray-400'
                required
              />
            </div>
          </div>

          {/* Image Upload Section */}
          <div className='space-y-3'>
            <label className='block text-[14px] font-bold text-gray-700 uppercase tracking-tight ml-1'>
               Category Image
            </label>
            <div className='flex flex-wrap items-start gap-5'>
              {/* Preview Box */}
              <div 
                className={`relative w-32 h-32 border-2 rounded-2xl flex items-center justify-center overflow-hidden transition-all group ${data.image ? 'border-indigo-100 bg-indigo-50/30' : 'border-dashed border-gray-200 bg-gray-50'}`}
                onClick={() => data.image && setShowImagePreview(true)}
              >
                {data.image ? (
                  <>
                    <img src={data.image} alt='Category' className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' />
                    <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-zoom-in'>
                      <span className='text-[10px] text-white font-bold uppercase tracking-wider backdrop-blur-sm px-2 py-1 rounded-full'>Preview</span>
                    </div>
                  </>
                ) : (
                  <div className='flex flex-col items-center gap-1 text-gray-300'>
                    <MdOutlineImage size={32} />
                    <span className='text-[10px] font-bold uppercase'>No Image</span>
                  </div>
                )}
              </div>

              {/* Upload Box */}
              <label htmlFor='uploadImg' className='flex-grow h-32 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all active:scale-[0.98] group'>
                {loading ? (
                    <div className='flex flex-col items-center gap-2'>
                        <div className='w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin' />
                        <span className='text-xs font-bold text-indigo-600'>Processing...</span>
                    </div>
                ) : (
                  <>
                    <div className='p-3 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:bg-indigo-600 group-hover:text-white transition-all'>
                      <FiUploadCloud size={24} />
                    </div>
                    <div className='text-center'>
                      <p className='text-xs font-bold text-gray-700 uppercase tracking-wider'>Click to upload</p>
                      <p className='text-[10px] text-gray-400 mt-0.5'>Max Size: 2MB</p>
                    </div>
                  </>
                )}
                <input
                  type='file'
                  id='uploadImg'
                  className='hidden'
                  accept='image/*'
                  onChange={handleUploadCategoryImage}
                  disabled={loading}
                />
              </label>
            </div>
          </div>

          {/* SEO Alt Text */}
          <div className='space-y-2 pt-2'>
            <label htmlFor='altText' className='block text-[14px] font-bold text-gray-700 uppercase tracking-tight ml-1'>
               SEO Alt Text
            </label>
            <div className='relative group'>
              <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors'>
                <FiHash size={18} />
              </div>
              <input
                type='text'
                id='altText'
                name='altText'
                placeholder='Type here'
                value={data.altText}
                onChange={handleOnChange}
                className='w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-gray-700 placeholder:text-gray-400'
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className='flex items-center gap-4 pt-6'>
            <button
              type='button'
              onClick={close}
              className='flex-1 px-6 py-3.5 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all active:scale-95'
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={!data.name || !data.image || loading}
              className='flex-[2] px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all active:scale-95 disabled:bg-indigo-300 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]'
            >
              {loading ? (
                <div className='flex items-center gap-2'>
                   <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                   <span>Adding...</span>
                </div>
              ) : "Add Category"}
            </button>
          </div>
        </form>
      </div>

      {showImagePreview && (
        <div className='fixed inset-0 bg-black/80 z-[1100] flex items-center justify-center p-4 backdrop-blur-sm' onClick={() => setShowImagePreview(false)}>
          <div className='relative max-w-4xl w-full animate-in fade-in zoom-in duration-300' onClick={e => e.stopPropagation()}>
             <button 
              onClick={() => setShowImagePreview(false)} 
              className='absolute -top-12 right-0 text-white hover:text-indigo-400 transition-colors p-2'
             >
                <IoClose size={32} />
             </button>
             <img
              src={data.image}
              alt='Preview'
              className='w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl'
             />
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadCategoryModel;
