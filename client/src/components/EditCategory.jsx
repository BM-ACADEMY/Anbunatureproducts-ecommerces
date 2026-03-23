import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';

import uploadImage from '../utils/UploadImage';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { toast } from 'sonner';
import AxiosToastError from '../utils/AxiosToastError';
import Loading from './Loading';

const EditCategory = ({ close, fetchData, data: CategoryData }) => {
  const [data, setData] = useState({
    _id: CategoryData._id,
    name: CategoryData.name,
    image: CategoryData.image,
    altText: CategoryData.altText || ''
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
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
        ...SummaryApi.updateCategory,
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
          <h3 className='text-lg font-medium text-gray-800'>Edit Category</h3>
          <button onClick={close} className='text-gray-400 hover:text-red-500 transition-colors'>
            <IoClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-6 space-y-5'>
          {/* Image Upload */}
          <div>
            <p className='text-base font-medium mb-2'>Category Image</p>
            <div className='flex flex-wrap items-center gap-3'>
              <label htmlFor='uploadImgEdit' className='cursor-pointer'>
                <input
                  type='file'
                  id='uploadImgEdit'
                  className='hidden'
                  accept='image/*'
                  onChange={handleUploadCategoryImage}
                  disabled={loading}
                />
                <img 
                  className='max-w-24 w-24 h-24 object-cover rounded border border-gray-200' 
                  src={data.image || "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png"} 
                  alt="uploadArea" 
                />
              </label>
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
            <label className='text-base font-medium' htmlFor='altText'>SEO Alt Text</label>
            <input
              type='text'
              id='altText'
              name='altText'
              placeholder='Type here'
              value={data.altText}
              onChange={handleOnChange}
              className='outline-none py-2 px-3 rounded border border-gray-500/40 focus:border-indigo-500 transition-colors'
            />
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
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategory;
