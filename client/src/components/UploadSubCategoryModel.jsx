import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { AiOutlineCamera } from "react-icons/ai";
import { MdOutlineImage } from "react-icons/md";
import uploadImage from '../utils/UploadImage';
import { useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { toast } from 'sonner';
import AxiosToastError from '../utils/AxiosToastError';
import Loading from './Loading';

const UploadSubCategoryModel = ({ close, fetchData }) => {
  const [subCategoryData, setSubCategoryData] = useState({
    name: "",
    image: "",
    category: [],
    altText: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
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

    setLoading(true);
    try {
      const response = await uploadImage(file, 'subcategory');
      const { data: ImageResponse } = response;
      setSubCategoryData((prev) => ({
        ...prev,
        image: ImageResponse.data.url,
      }));
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCategorySelected = (categoryId) => {
    setSubCategoryData((prev) => ({
      ...prev,
      category: prev.category.filter((el) => el._id !== categoryId),
    }));
  };

  const handleSubmitSubCategory = async (e) => {
    e.preventDefault();
    if (!subCategoryData.name || !subCategoryData.image || !subCategoryData.category.length) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await Axios({
        ...SummaryApi.createSubCategory,
        data: subCategoryData,
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
    <section className='fixed inset-0 p-4 bg-neutral-800 bg-opacity-60 z-50 flex items-center justify-center'>
      <div className='bg-white w-full max-w-lg p-4 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between mb-4 sticky top-0 bg-white pb-2 border-b'>
          <h1 className='font-semibold text-lg'>Add Sub Category</h1>
          <button onClick={close} className='text-neutral-600 hover:text-red-600 transition-colors'>
            <IoClose size={25} />
          </button>
        </div>

        <form onSubmit={handleSubmitSubCategory} className='grid gap-4'>
          <div className='grid gap-1'>
            <label htmlFor='name' className='font-medium'>Name</label>
            <input
              type='text'
              id='name'
              name='name'
              placeholder='Enter subcategory name'
              value={subCategoryData.name}
              onChange={handleChange}
              className='bg-blue-50 p-2 border border-blue-100 focus-within:border-primary-200 outline-none rounded'
              required
            />
          </div>

          <div className='grid gap-1'>
            <label htmlFor='altText' className='font-medium'>SEO Alt Text</label>
            <input
              type='text'
              id='altText'
              name='altText'
              placeholder='Enter image description for SEO'
              value={subCategoryData.altText}
              onChange={handleChange}
              className='bg-blue-50 p-2 border border-blue-100 focus-within:border-primary-200 outline-none rounded'
            />
          </div>

          <div className='grid gap-1'>
            <p className='font-medium'>Image</p>
            <div className='flex flex-col sm:flex-row items-center gap-3'>
              <div 
                className='border bg-blue-50 h-36 w-36 flex items-center justify-center rounded cursor-pointer overflow-hidden'
                onClick={() => subCategoryData.image && setShowImagePreview(true)}
              >
                {subCategoryData.image ? (
                  <img
                    src={subCategoryData.image}
                    alt='SubCategory'
                    className='w-full h-full object-scale-down'
                  />
                ) : (
                  <div className='flex flex-col items-center text-neutral-400'>
                    <MdOutlineImage size={40} />
                    <p className='text-xs'>No Image</p>
                  </div>
                )}
              </div>
              <label htmlFor='uploadSubImg'>
                <div className={`px-4 py-2 border border-primary-100 text-primary-200 rounded cursor-pointer hover:bg-primary-100 transition-colors flex items-center gap-2 ${loading && "opacity-50 cursor-not-allowed"}`}>
                  {loading ? <Loading /> : (
                    <>
                      <AiOutlineCamera size={20} />
                      <span>Upload Image</span>
                    </>
                  )}
                </div>
                <input
                  type='file'
                  id='uploadSubImg'
                  className='hidden'
                  onChange={handleUploadSubCategoryImage}
                  disabled={loading}
                />
              </label>
            </div>
          </div>

          <div className='grid gap-1'>
            <label className='font-medium'>Select Category</label>
            <select
              className='bg-blue-50 p-2 border border-blue-100 focus-within:border-primary-200 outline-none rounded'
              onChange={(e) => {
                const value = e.target.value;
                const categoryDetails = allCategory.find((el) => el._id === value);
                if (categoryDetails && !subCategoryData.category.some((cat) => cat._id === value)) {
                  setSubCategoryData((prev) => ({
                    ...prev,
                    category: [...prev.category, categoryDetails],
                  }));
                }
              }}
              value=""
            >
              <option value="" disabled>Select Category</option>
              {allCategory.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className='flex flex-wrap gap-2 mt-2'>
              {subCategoryData.category.map((cat) => (
                <div key={cat._id} className='bg-white border shadow-sm px-2 py-1 rounded flex items-center gap-2'>
                  <span className='text-sm'>{cat.name}</span>
                  <button 
                    type='button'
                    onClick={() => handleRemoveCategorySelected(cat._id)}
                    className='text-red-500 hover:text-red-700 transition-colors'
                  >
                    <IoClose size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className='flex items-center justify-end gap-3 mt-4'>
            <button
              type='button'
              onClick={close}
              className='px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors'
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type='submit'
              className={`px-4 py-2 bg-primary-200 text-white rounded hover:bg-primary-300 transition-colors ${(!subCategoryData.name || !subCategoryData.image || !subCategoryData.category.length || loading) && "opacity-50 cursor-not-allowed"}`}
              disabled={!subCategoryData.name || !subCategoryData.image || !subCategoryData.category.length || loading}
            >
              {loading ? "Loading..." : "Add Sub Category"}
            </button>
          </div>
        </form>
      </div>

      {showImagePreview && (
        <div className='fixed inset-0 bg-neutral-800 bg-opacity-70 z-[60] flex items-center justify-center p-4'>
          <div className='bg-white p-2 rounded-lg max-w-2xl w-full relative'>
             <button 
              onClick={() => setShowImagePreview(false)} 
              className='absolute -top-10 right-0 text-white hover:text-red-500 transition-colors'
             >
                <IoClose size={30} />
             </button>
             <img
              src={subCategoryData.image}
              alt='Preview'
              className='w-full h-auto max-h-[80vh] object-contain rounded'
             />
          </div>
        </div>
      )}
    </section>
  );
};

export default UploadSubCategoryModel;

