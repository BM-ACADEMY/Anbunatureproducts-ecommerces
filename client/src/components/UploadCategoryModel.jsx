import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useSelector } from 'react-redux';

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

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const allCategory = useSelector((state) => state.product.allCategory);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(allCategory.length >= 10){
        toast.error("Maximum 10 categories allowed. Please delete existing ones to add more.");
        return;
    }

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
    <div className='fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
      <div className='relative bg-white rounded shadow-lg w-full max-w-lg overflow-hidden flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b'>
          <h3 className='text-lg font-medium text-gray-800'>Add Category</h3>
          <button onClick={close} className='text-gray-400 hover:text-red-500 transition-colors'>
            <IoClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-6 space-y-5'>
          {/* Image Upload */}
          <div>
            <p className='text-base font-medium mb-2'>Category Image</p>
            <div className='flex flex-wrap items-center gap-4'>
              <div className='relative group'>
                <img 
                  className='w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm' 
                  src={data.image || "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png"} 
                  alt={data.altText || data.name || "Category image upload"} 
                />
                {data.image && (
                  <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center'>
                    <span className='text-white text-xs font-bold'>Change</span>
                  </div>
                )}
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor='uploadImg' className='cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 font-medium text-sm rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-100'>
                  <input
                    type='file'
                    id='uploadImg'
                    className='hidden'
                    accept='image/*'
                    onChange={handleUploadCategoryImage}
                    disabled={loading}
                  />
                  {data.image ? 'Replace Image' : 'Upload Image'}
                </label>
                <span className='text-[11px] text-slate-400 font-medium'>Max 2MB • JPG, PNG, WebP</span>
              </div>
              {loading && <div className='w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin' />}
            </div>
          </div>

          {/* Category Name */}
          <div className='flex flex-col gap-1'>
            <label className='text-base font-medium' htmlFor='categoryName'>Category Name</label>
            <input
              type='text'
              id='categoryName'
              name='name'
              placeholder='Type here'
              value={data.name}
              onChange={handleOnChange}
              className='outline-none py-2 px-3 rounded border border-gray-500/40 focus:border-indigo-500 transition-colors'
              required
            />
          </div>

          {/* Alt Text */}
          <div className='flex flex-col gap-1'>
            <div className='flex items-center justify-between'>
              <label className='text-base font-medium' htmlFor='altText'>SEO Alt Text</label>
              
            </div>
            <div className='relative'>
              <input
                type='text' id='altText' name='altText' value={data.altText} 
                onChange={(e) => { if (e.target.value.length <= 125) handleOnChange(e); }}
                placeholder='Type here'
                className='w-full outline-none py-2 px-3 pr-12 rounded border border-gray-500/40 focus:border-indigo-500 transition-colors'
              />
              <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold ${data.altText.length > 110 ? 'text-amber-500' : 'text-gray-400'}`}>
                {data.altText.length}/125
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex items-center gap-4 pt-2'>
            <button
              type='button'
              onClick={close}
              className='flex-1 py-2.5 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 transition-colors'
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={!data.name || !data.image || loading}
              className='flex-1 py-2.5 bg-indigo-500 text-white font-medium rounded hover:bg-indigo-600 transition-colors disabled:bg-indigo-300'
            >
              {loading ? "Adding..." : "ADD"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadCategoryModel;
