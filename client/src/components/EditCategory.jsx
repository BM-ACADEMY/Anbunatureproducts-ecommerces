import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { AiOutlineCamera } from "react-icons/ai"; 
import { MdOutlineImage } from "react-icons/md";

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
  const [showImagePreview, setShowImagePreview] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.updateCategory,
        data: data
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

    setLoading(true);
    try {
      const response = await uploadImage(file, 'category');
      const { data: ImageResponse } = response;
      setData((prev) => ({ ...prev, image: ImageResponse.data.url }));
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='fixed top-0 bottom-0 left-0 right-0 p-4 bg-neutral-800 bg-opacity-60 z-50 flex items-center justify-center'>
      <div className='bg-white w-full max-w-md p-4 rounded-lg shadow-lg'>
        <div className='flex items-center justify-between mb-4'>
          <h1 className='font-semibold text-lg'>Edit Category</h1>
          <button onClick={close} className='text-neutral-600 hover:text-red-600 transition-colors'>
            <IoClose size={25} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='grid gap-4'>
          <div className='grid gap-1'>
            <label htmlFor='categoryName' className='font-medium'>Category Name</label>
            <input
              type='text'
              id='categoryName'
              placeholder='Enter category name'
              value={data.name}
              name='name'
              onChange={handleOnChange}
              className='bg-blue-50 p-2 border border-blue-100 focus-within:border-primary-200 outline-none rounded'
              required
            />
          </div>

          <div className='grid gap-1'>
            <label htmlFor='altText' className='font-medium'>SEO Alt Text</label>
            <input
              type='text'
              id='altText'
              placeholder='Enter image description for SEO'
              value={data.altText}
              name='altText'
              onChange={handleOnChange}
              className='bg-blue-50 p-2 border border-blue-100 focus-within:border-primary-200 outline-none rounded'
            />
          </div>

          <div className='grid gap-1'>
            <p className='font-medium'>Category Image</p>
            <div className='flex flex-col sm:flex-row items-center gap-3'>
              <div 
                className='border bg-blue-50 h-28 w-28 flex items-center justify-center rounded cursor-pointer overflow-hidden'
                onClick={() => data.image && setShowImagePreview(true)}
              >
                {data.image ? (
                  <img
                    src={data.image}
                    alt='Category'
                    className='w-full h-full object-scale-down'
                  />
                ) : (
                  <div className='flex flex-col items-center text-neutral-400'>
                    <MdOutlineImage size={40} />
                    <p className='text-xs'>No Image</p>
                  </div>
                )}
              </div>
              <label htmlFor='uploadImg'>
                <div className={`px-4 py-2 border border-primary-100 text-primary-200 rounded cursor-pointer hover:bg-primary-100 transition-colors flex items-center gap-2 ${(!data.name || loading) && "opacity-50 cursor-not-allowed"}`}>
                  {loading ? <Loading /> : (
                    <>
                      <AiOutlineCamera size={20} />
                      <span>Change Image</span>
                    </>
                  )}
                </div>
                <input
                  type='file'
                  id='uploadImg'
                  className='hidden'
                  onChange={handleUploadCategoryImage}
                  disabled={!data.name || loading}
                />
              </label>
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
              className={`px-4 py-2 bg-primary-200 text-white rounded hover:bg-primary-300 transition-colors ${(!data.name || !data.image || loading) && "opacity-50 cursor-not-allowed"}`}
              disabled={!data.name || !data.image || loading}
            >
              {loading ? "Updating..." : "Update"}
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
              src={data.image}
              alt='Preview'
              className='w-full h-auto max-h-[80vh] object-contain rounded'
             />
          </div>
        </div>
      )}
    </section>
  );
};

export default EditCategory;
