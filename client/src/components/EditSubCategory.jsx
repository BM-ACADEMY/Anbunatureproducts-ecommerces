import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

import uploadImage from '../utils/UploadImage';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import Loading from './Loading';
import CategoryDropdown from './CategoryDropdown';

const EditSubCategory = ({ close, data, fetchData }) => {
  const [subCategoryData, setSubCategoryData] = useState({
    _id: data._id,
    name: data.name,
    image: data.image,
    category: data.category?._id || data.category || "", // Support both populated and ID
    altText: data.altText || "",
  });
  
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [selectedCategoryDetails, setSelectedCategoryDetails] = useState(data.category && typeof data.category === 'object' ? data.category : null);
  const allCategory = useSelector((state) => state.product.allCategory);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubCategoryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadSubCategoryImage = async (e) => {
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
    setSubCategoryData((prev) => ({
      ...prev,
      image: previewUrl,
    }));
  };

  const handleRemoveCategorySelected = () => {
    setSubCategoryData((prev) => ({
      ...prev,
      category: "",
    }));
    setSelectedCategoryDetails(null);
  };

  const handleSubmitSubCategory = async (e) => {
    e.preventDefault();
    if (!subCategoryData.name || !subCategoryData.image || !subCategoryData.category) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = subCategoryData.image;

      // Upload image if a new file is selected
      if (imageFile) {
        const uploadResponse = await uploadImage(imageFile, 'subcategory');
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
        ...SummaryApi.updateSubCategory,
        data: {
          ...subCategoryData,
          image: imageUrl
        },
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
    <div className='fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
      <div className='relative bg-white rounded shadow-lg w-full max-w-lg overflow-visible flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b'>
          <h3 className='text-lg font-medium text-gray-800'>Edit Sub Category</h3>
          <button onClick={close} className='text-gray-400 hover:text-red-500 transition-colors'>
            <IoClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmitSubCategory} className='p-6 space-y-5'>
          {/* Image Upload */}
          <div>
            <p className='text-base font-medium mb-2'>Sub Category Image</p>
            <div className='flex flex-wrap items-center gap-4'>
              <div className='relative group'>
                <img 
                  className='w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm' 
                  src={subCategoryData.image || "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png"} 
                  alt={subCategoryData.altText || subCategoryData.name || "Subcategory image"} 
                />
                {subCategoryData.image && (
                  <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center'>
                    <span className='text-white text-xs font-bold'>Change</span>
                  </div>
                )}
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor='uploadSubImgEdit' className='cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 font-medium text-sm rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-100'>
                  <input
                    type='file'
                    id='uploadSubImgEdit'
                    className='hidden'
                    accept='image/*'
                    onChange={handleUploadSubCategoryImage}
                    disabled={loading}
                  />
                  {subCategoryData.image ? 'Replace Image' : 'Upload Image'}
                </label>
                <span className='text-[11px] text-slate-400 font-medium'>Max 2MB • JPG, PNG, WebP</span>
              </div>
              {loading && <div className='w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin' />}
            </div>
          </div>

          {/* SubCategory Name */}
          <div className='flex flex-col gap-1'>
            <label className='text-base font-medium' htmlFor='name'>Sub Category Name</label>
            <input
              type='text'
              id='name'
              name='name'
              placeholder='Type here'
              value={subCategoryData.name}
              onChange={handleChange}
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
              value={subCategoryData.altText}
              onChange={handleChange}
              className='outline-none py-2 px-3 rounded border border-gray-500/40 focus:border-indigo-500 transition-colors'
            />
          </div>

          {/* Category Select */}
          <div className='flex flex-col gap-1'>
            <CategoryDropdown
              label="Main Category"
              placeholder="Add Category..."
              options={allCategory}
              selectedOptions={selectedCategoryDetails ? [selectedCategoryDetails] : []}
              onSelect={(categoryDetails) => {
                setSubCategoryData((prev) => ({
                  ...prev,
                  category: categoryDetails._id,
                }));
                setSelectedCategoryDetails(categoryDetails);
              }}
            />
            
            <div className='flex flex-wrap gap-2 mt-2'>
              {selectedCategoryDetails && (
                <div className='bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-full flex items-center gap-2 text-xs font-bold'>
                  <span>{selectedCategoryDetails.name}</span>
                  <button 
                    type='button'
                    onClick={handleRemoveCategorySelected}
                    className='text-indigo-400 hover:text-red-500 transition-colors'
                  >
                    <IoClose size={14} />
                  </button>
                </div>
              )}
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
              disabled={!subCategoryData.name || !subCategoryData.image || !subCategoryData.category || loading}
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

export default EditSubCategory;
