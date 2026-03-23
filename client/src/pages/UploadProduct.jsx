// UploadProduct.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IoCloudUploadOutline, IoClose, IoAdd, IoTrashOutline, IoStar, IoStarOutline } from "react-icons/io5";
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';
import { toast } from 'sonner';

const UploadProduct = () => {
  const [data, setData] = useState({
    name: '',
    image: [],
    category: [],
    subCategory: [],
    description: '',
    more_details: {},
    attributes: [],
    reviews: [],
    comboOffer: false,
    altText: '' // Added altText field
  });

  const [imageLoading, setImageLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [ViewImageURL, setViewImageURL] = useState('');
  const allCategory = useSelector((state) => state.product.allCategory || []);
  const [selectCategory, setSelectCategory] = useState('');
  const [selectSubCategory, setSelectSubCategory] = useState('');
  const allSubCategory = useSelector((state) => state.product.allSubCategory || []);

  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState('');

  const [openAddAttribute, setOpenAddAttribute] = useState(false);
  const [newAttributeTypeName, setNewAttributeTypeName] = useState('');

  const [selectedAttributeTypeForOption, setSelectedAttributeTypeForOption] = useState('');
  const [newOptionValue, setNewOptionValue] = useState('');
  const [newOptionPrice, setNewOptionPrice] = useState('');
  const [newOptionStock, setNewOptionStock] = useState(null);
  const [newOptionUnit, setNewOptionUnit] = useState('');

  const [openAddReview, setOpenAddReview] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleComboOfferToggle = (e) => {
    setData((prev) => ({
      ...prev,
      comboOffer: e.target.checked,
    }));
  };

  const handleUploadImages = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Frontend validation: 2MB limit
    const MAX_SIZE = 2 * 1024 * 1024;
    const invalidFiles = Array.from(files).filter(file => file.size > MAX_SIZE);
    
    if (invalidFiles.length > 0) {
      toast.error(`Some images exceed the 2MB limit: ${invalidFiles.map(f => f.name).join(', ')}`);
      return;
    }

    setImageLoading(true);
    try {
      const uploadPromises = Array.from(files).map((file) => uploadImage(file, 'product'));
      const responses = await Promise.all(uploadPromises);

      const newImageUrls = responses
        .filter((response) => response?.data?.data?.url)
        .map((response) => response.data.data.url);

      setData((prev) => ({
        ...prev,
        image: [...prev.image, ...newImageUrls],
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
      AxiosToastError(error);
    } finally {
      setImageLoading(false);
    }
  };

  const handleDeleteImage = (index) => {
    const newImages = [...data.image];
    newImages.splice(index, 1);
    setData((prev) => ({ ...prev, image: newImages }));
  };

  const handleRemoveCategory = (index) => {
    const newCategories = [...data.category];
    newCategories.splice(index, 1);
    setData((prev) => ({ ...prev, category: newCategories }));
  };

  const handleRemoveSubCategory = (index) => {
    const newSubCategories = [...data.subCategory];
    newSubCategories.splice(index, 1);
    setData((prev) => ({ ...prev, subCategory: newSubCategories }));
  };

  const handleAddMoreDetailField = () => {
    if (!fieldName.trim()) return;

    setData((prev) => ({
      ...prev,
      more_details: {
        ...prev.more_details,
        [fieldName]: '',
      },
    }));
    setFieldName('');
    setOpenAddField(false);
  };

  const handleMoreDetailsChange = (key, value) => {
    setData((prev) => ({
      ...prev,
      more_details: {
        ...prev.more_details,
        [key]: value,
      },
    }));
  };

  const handleAddAttributeType = () => {
    if (!newAttributeTypeName.trim()) {
      toast.error('Attribute type name cannot be empty.');
      return;
    }

    if (data.attributes.some((attr) => attr.name.toLowerCase() === newAttributeTypeName.trim().toLowerCase())) {
      toast.error(`Attribute type "${newAttributeTypeName}" already exists.`);
      return;
    }

    setData((prev) => ({
      ...prev,
      attributes: [...prev.attributes, { name: newAttributeTypeName.trim(), options: [] }],
    }));
    setNewAttributeTypeName('');
    setOpenAddAttribute(false);
  };

  const handleAddAttributeOption = () => {
    if (!selectedAttributeTypeForOption) {
      toast.error('Please select an attribute type.');
      return;
    }
    if (!newOptionValue.trim()) {
      toast.error('Attribute option value cannot be empty.');
      return;
    }
    if (newOptionPrice === '' || isNaN(Number(newOptionPrice)) || Number(newOptionPrice) < 0) {
      toast.error('Please enter a valid price for the attribute option.');
      return;
    }
    if (newOptionStock !== null && (isNaN(Number(newOptionStock)) || Number(newOptionStock) < 0)) {
       toast.error('Please enter a valid number for stock, or leave it empty.');
      return;
    }

    setData((prev) => {
      const updatedAttributes = prev.attributes.map((attrGroup) => {
        if (attrGroup.name === selectedAttributeTypeForOption) {
          const isDuplicate = attrGroup.options.some(
            (option) => option.name.toLowerCase() === newOptionValue.trim().toLowerCase()
          );
          if (isDuplicate) {
            toast.error(`Option "${newOptionValue.trim()}" already exists for ${selectedAttributeTypeForOption}.`);
            return attrGroup;
          }

          return {
            ...attrGroup,
            options: [
              ...attrGroup.options,
              {
                name: newOptionValue.trim(),
                price: Number(newOptionPrice),
                stock: newOptionStock !== null ? Number(newOptionStock) : null,
                unit: newOptionUnit.trim(),
              },
            ],
          };
        }
        return attrGroup;
      });
      return { ...prev, attributes: updatedAttributes };
    });

    setNewOptionValue('');
    setNewOptionPrice('');
    setNewOptionStock(null);
    setNewOptionUnit('');
    setSelectedAttributeTypeForOption('');
  };

  const handleDeleteAttributeOption = (attributeTypeName, optionValueToDelete) => {
    setData((prev) => ({
      ...prev,
      attributes: prev.attributes.map((attrGroup) => {
        if (attrGroup.name === attributeTypeName) {
          return {
            ...attrGroup,
            options: attrGroup.options.filter((option) => option.name !== optionValueToDelete),
          };
        }
        return attrGroup;
      }),
    }));
  };

  const handleDeleteAttributeType = (attributeTypeName) => {
    setData((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((attrGroup) => attrGroup.name !== attributeTypeName),
    }));
  };

  const handleAddReview = () => {
    if (!reviewName.trim() || !reviewComment.trim() || reviewStars === 0) {
      toast.error('Please fill in reviewer name, stars (1-5), and comment for the review.');
      return;
    }

    const newReview = {
      name: reviewName.trim(),
      stars: reviewStars,
      comment: reviewComment.trim(),
    };

    setData((prev) => ({
      ...prev,
      reviews: [...prev.reviews, newReview],
    }));

    setReviewName('');
    setReviewStars(0);
    setReviewComment('');
    setOpenAddReview(false);
  };

  const handleDeleteReview = (indexToDelete) => {
    setData((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((_, index) => index !== indexToDelete),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const filteredMoreDetails = Object.fromEntries(
        Object.entries(data.more_details).filter(([, value]) => value !== '')
      );

      if (data.image.length === 0) {
        toast.error('Please upload at least one image.');
        setSubmitLoading(false);
        return;
      }
      if (data.category.length === 0) {
        toast.error('Please select at least one category.');
        setSubmitLoading(false);
        return;
      }
      if (!data.name.trim() || !data.description.trim()) {
        toast.error('Please fill in Name and Description.');
        setSubmitLoading(false);
        return;
      }

      let hasAnyAttributePrice = false;
      if (data.attributes.length > 0) {
        for (const attrGroup of data.attributes) {
          if (attrGroup.options && attrGroup.options.some((option) => typeof option.price === 'number' && !isNaN(option.price) && option.price >= 0)) {
            hasAnyAttributePrice = true;
            break;
          }
        }
      }

      const productDataToSend = {
        name: data.name,
        image: data.image,
        category: data.category.map((c) => c._id),
        subCategory: data.subCategory.map((s) => s._id),
        description: data.description,
        more_details: filteredMoreDetails,
        attributes: data.attributes,
        reviews: data.reviews,
        comboOffer: data.comboOffer,
        altText: data.altText, // Include altText
      };

      const response = await Axios({
        ...SummaryApi.createProduct,
        data: productDataToSend,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        successAlert(responseData.message);
        setData({
          name: '',
          image: [],
          category: [],
          subCategory: [],
          description: '',
          more_details: {},
          attributes: [],
          reviews: [],
          comboOffer: false,
          altText: ''
        });
        setSelectCategory('');
        setSelectSubCategory('');
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <section className='p-4'>
       <div className='p-3 bg-white shadow-sm flex items-center justify-between rounded'>
          <h2 className='font-semibold text-lg'>Upload Product</h2>
       </div>

       <div className='grid gap-6 mt-6 bg-white p-6 shadow-sm rounded'>
          <form className='grid gap-4' onSubmit={handleSubmit}>
            <div className='grid gap-1'>
               <label htmlFor='name' className='font-medium'>Name</label>
               <input 
                 type='text'
                 id='name'
                 name='name'
                 placeholder='Enter product name'
                 className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                 value={data.name}
                 onChange={handleChange}
                 required
               />
            </div>

            <div className='grid gap-1'>
               <label htmlFor='description' className='font-medium'>Description</label>
               <textarea 
                 id='description'
                 name='description'
                 placeholder='Enter product description'
                 rows={3}
                 className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded resize-none'
                 value={data.description}
                 onChange={handleChange}
                 required
               />
            </div>

            <div className='flex items-center gap-2'>
               <input 
                 type='checkbox'
                 id='comboOffer'
                 className='w-5 h-5 cursor-pointer'
                 checked={data.comboOffer}
                 onChange={handleComboOfferToggle}
               />
               <label htmlFor='comboOffer' className='font-medium cursor-pointer'>Enable Combo Offer</label>
            </div>

            {/* Image Upload */}
            <div className='grid gap-1'>
               <label className='font-medium'>Images (Max 2MB each)</label>
               <label htmlFor='productImages' className='bg-blue-50 h-24 border border-dashed border-primary-200 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100 transition-all'>
                  {imageLoading ? <Loading /> : (
                    <>
                      <IoCloudUploadOutline size={30} className='text-primary-200' />
                      <p className='text-sm mt-1 text-neutral-600'>Upload Product Images</p>
                    </>
                  )}
                  <input 
                    type='file'
                    id='productImages'
                    className='hidden'
                    accept='image/*'
                    multiple
                    onChange={handleUploadImages}
                  />
               </label>
               <div className='flex flex-wrap gap-3 mt-2'>
                  {data.image.map((img, index) => (
                    <div key={img + index} className='relative w-24 h-24 bg-blue-50 rounded border p-1 group'>
                       <img 
                         src={img} 
                         alt='product' 
                         className='w-full h-full object-scale-down cursor-pointer'
                         onClick={() => setViewImageURL(img)}
                       />
                       <button 
                         type='button'
                         onClick={() => handleDeleteImage(index)}
                         className='absolute bottom-0 right-0 bg-red-500 text-white p-1 rounded-tl-md opacity-0 group-hover:opacity-100 transition-all'
                       >
                         <IoTrashOutline size={16} />
                       </button>
                    </div>
                  ))}
               </div>
            </div>

            {/* Alt Text for SEO */}
            <div className='grid gap-1'>
               <label htmlFor='altText' className='font-medium text-primary-200 flex items-center gap-1'>
                  SEO Alt Image Text
               </label>
               <input 
                 type='text'
                 id='altText'
                 name='altText'
                 placeholder='Describe images for SEO'
                 className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                 value={data.altText}
                 onChange={handleChange}
               />
            </div>

            {/* Category selection */}
            <div className='grid gap-1'>
               <label className='font-medium'>Category</label>
               <select 
                 className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded cursor-pointer text-neutral-600'
                 value={selectCategory}
                 onChange={(e) => {
                    const value = e.target.value;
                    const category = allCategory.find(el => el._id === value);
                    if (category && !data.category.some(c => c._id === category._id)) {
                      setData(prev => ({ ...prev, category: [...prev.category, category] }));
                      setSelectCategory("");
                    }
                 }}
               >
                  <option value="">Select Category</option>
                  {allCategory.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
               </select>
               <div className='flex flex-wrap gap-2 mt-1'>
                  {data.category.map((c, index) => (
                    <span key={c._id + index} className='bg-primary-100 text-primary-200 px-3 py-1 rounded-full text-xs flex items-center gap-2 font-medium'>
                       {c.name}
                       <IoClose className='cursor-pointer' onClick={() => handleRemoveCategory(index)} />
                    </span>
                  ))}
               </div>
            </div>

            {/* SubCategory selection */}
            <div className='grid gap-1'>
               <label className='font-medium'>Sub Category</label>
               <select 
                 className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded cursor-pointer text-neutral-600'
                 value={selectSubCategory}
                 onChange={(e) => {
                    const value = e.target.value;
                    const subCategory = allSubCategory.find(el => el._id === value);
                    if (subCategory && !data.subCategory.some(s => s._id === subCategory._id)) {
                      setData(prev => ({ ...prev, subCategory: [...prev.subCategory, subCategory] }));
                      setSelectSubCategory("");
                    }
                 }}
               >
                  <option value="">Select Sub Category</option>
                  {allSubCategory.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
               </select>
               <div className='flex flex-wrap gap-2 mt-1'>
                  {data.subCategory.map((s, index) => (
                    <span key={s._id + index} className='bg-primary-100 text-primary-200 px-3 py-1 rounded-full text-xs flex items-center gap-2 font-medium'>
                       {s.name}
                       <IoClose className='cursor-pointer' onClick={() => handleRemoveSubCategory(index)} />
                    </span>
                  ))}
               </div>
            </div>

            <hr className='my-2' />

            {/* More Details */}
            <div className='grid gap-4'>
               <div className='flex items-center justify-between'>
                  <h3 className='font-semibold'>More Details Section</h3>
                  <button 
                    type='button'
                    onClick={() => setOpenAddField(true)}
                    className='text-primary-200 hover:bg-primary-100 p-1 px-2 rounded flex items-center gap-1 text-sm font-medium border border-primary-100 transition-all'
                  >
                    <IoAdd size={18} /> Add Field
                  </button>
               </div>
               
               {Object.keys(data.more_details).map((k) => (
                 <div key={k} className='grid gap-1'>
                    <label className='font-medium text-sm text-neutral-600 capitalize'>{k}</label>
                    <div className='flex items-center gap-2'>
                       <input 
                         type='text'
                         placeholder={`Enter ${k}`}
                         value={data.more_details[k]}
                         onChange={(e) => handleMoreDetailsChange(k, e.target.value)}
                         className='flex-grow bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                         required
                       />
                       <button 
                          type='button'
                          onClick={() => {
                             const newDetails = { ...data.more_details };
                             delete newDetails[k];
                             setData(prev => ({ ...prev, more_details: newDetails }));
                          }}
                          className='p-2 text-red-500 hover:bg-red-50 rounded'
                       >
                          <IoTrashOutline size={20} />
                       </button>
                    </div>
                 </div>
               ))}
            </div>

            <hr className='my-2' />

            {/* Attributes */}
            <div className='grid gap-4'>
               <div className='flex items-center justify-between'>
                  <h3 className='font-semibold'>Product (Size or quantity)</h3>
                  <button 
                    type='button'
                    onClick={() => setOpenAddAttribute(true)}
                    className='text-primary-200 hover:bg-primary-100 p-1 px-2 rounded flex items-center gap-1 text-sm font-medium border border-primary-100 transition-all'
                  >
                    <IoAdd size={18} /> Add New Attribute Type
                  </button>
               </div>

               {data.attributes.map((attrGroup) => (
                  <div key={attrGroup.name} className='border p-4 rounded bg-neutral-50'>
                     <div className='flex items-center justify-between mb-3'>
                        <h4 className='font-medium text-primary-200'>{attrGroup.name}</h4>
                        <button 
                          type='button'
                          onClick={() => handleDeleteAttributeType(attrGroup.name)}
                          className='text-red-500 p-1 hover:bg-red-50 rounded'
                        >
                          <IoTrashOutline size={18} />
                        </button>
                     </div>

                     <div className='flex flex-wrap gap-2 mb-4'>
                        {attrGroup.options.map((option, idx) => (
                          <span key={option.name + idx} className='bg-white border border-primary-100 text-primary-200 px-3 py-1 rounded flex items-center gap-2 text-xs font-medium'>
                             {option.name} ({option.price > 0 ? '+' : ''}{option.price}) {option.unit}
                             <IoClose className='cursor-pointer' onClick={() => handleDeleteAttributeOption(attrGroup.name, option.name)} />
                          </span>
                        ))}
                     </div>

                     <div className='grid gap-3'>
                        <button 
                          type='button'
                          onClick={() => setSelectedAttributeTypeForOption(attrGroup.name)}
                          className='w-fit text-primary-200 text-xs font-semibold hover:underline'
                        >
                          + Add Option to {attrGroup.name}
                        </button>

                        {selectedAttributeTypeForOption === attrGroup.name && (
                           <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 bg-white p-3 border rounded shadow-sm'>
                              <input 
                                type='text' 
                                placeholder='Value (e.g. 1kg, Red)'
                                className='bg-blue-50 p-2 outline-none border rounded text-sm'
                                value={newOptionValue}
                                onChange={e => setNewOptionValue(e.target.value)}
                              />
                              <input 
                                type='number' 
                                placeholder='Price'
                                className='bg-blue-50 p-2 outline-none border rounded text-sm'
                                value={newOptionPrice}
                                onChange={e => setNewOptionPrice(e.target.value)}
                              />
                              <input 
                                type='number' 
                                placeholder='Stock'
                                className='bg-blue-50 p-2 outline-none border rounded text-sm'
                                value={newOptionStock === null ? "" : newOptionStock}
                                onChange={e => setNewOptionStock(e.target.value === "" ? null : Number(e.target.value))}
                              />
                              <input 
                                type='text' 
                                placeholder='Unit'
                                className='bg-blue-50 p-2 outline-none border rounded text-sm'
                                value={newOptionUnit}
                                onChange={e => setNewOptionUnit(e.target.value)}
                              />
                              <div className='flex gap-2 sm:col-span-4 justify-end mt-1'>
                                 <button 
                                   type='button'
                                   onClick={() => setSelectedAttributeTypeForOption("")}
                                   className='px-3 py-1 text-xs border rounded hover:bg-neutral-50'
                                 >
                                   Cancel
                                 </button>
                                 <button 
                                   type='button'
                                   onClick={handleAddAttributeOption}
                                   className='px-3 py-1 text-xs bg-primary-200 text-white rounded hover:bg-primary-200/90 shadow-sm transition-all'
                                 >
                                   Add Option
                                 </button>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
               ))}
            </div>

            <hr className='my-2' />

            {/* Reviews */}
            <div className='grid gap-4'>
               <div className='flex items-center justify-between'>
                  <h3 className='font-semibold'>Product Reviews (Manual)</h3>
                  <button 
                    type='button'
                    onClick={() => setOpenAddReview(true)}
                    className='text-primary-200 hover:bg-primary-100 p-1 px-2 rounded flex items-center gap-1 text-sm font-medium border border-primary-100 transition-all'
                  >
                    <IoAdd size={18} /> Add New Review
                  </button>
               </div>

               <div className='grid gap-3'>
                  {data.reviews.map((review, index) => (
                    <div key={index} className='p-3 bg-neutral-50 rounded border flex justify-between gap-4'>
                       <div className='grid gap-1'>
                          <div className='flex items-center gap-2'>
                             <p className='font-semibold text-sm'>{review.name}</p>
                             <div className='flex text-yellow-500'>
                                {[...Array(5)].map((_, i) => (
                                  i < review.stars ? <IoStar key={i} /> : <IoStarOutline key={i} />
                                ))}
                             </div>
                          </div>
                          <p className='text-sm text-neutral-600'>{review.comment}</p>
                       </div>
                       <button 
                         type='button'
                         onClick={() => handleDeleteReview(index)}
                         className='text-red-500 hover:bg-red-50 p-1 h-fit rounded'
                       >
                         <IoTrashOutline size={18} />
                       </button>
                    </div>
                  ))}
               </div>
            </div>

            <button 
              type='submit'
              disabled={submitLoading}
              className='mt-4 bg-primary-100 text-primary-200 hover:bg-primary-200 hover:text-white py-3 rounded font-bold transition-all shadow-sm'
            >
              {submitLoading ? "Uploading..." : "Submit Product"}
            </button>
          </form>
       </div>

       {/* Dialogs */}
       {openAddField && (
          <div className='fixed inset-0 bg-neutral-900 bg-opacity-70 flex items-center justify-center z-50 p-4'>
             <div className='bg-white p-6 rounded-lg w-full max-w-sm shadow-xl animate-zoom-in'>
                <div className='flex items-center justify-between mb-4'>
                   <h3 className='font-bold text-lg'>Add More Detail Field</h3>
                   <button onClick={() => setOpenAddField(false)}><IoClose size={24} /></button>
                </div>
                <input 
                  type='text'
                  autoFocus
                  placeholder='Field Name (e.g. Material)'
                  className='w-full bg-blue-50 p-3 outline-none border focus:border-primary-200 rounded mb-4'
                  value={fieldName}
                  onChange={e => setFieldName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddMoreDetailField()}
                />
                <div className='flex justify-end gap-3'>
                   <button onClick={() => setOpenAddField(false)} className='px-4 py-2 border rounded hover:bg-neutral-50 font-medium'>Cancel</button>
                   <button onClick={handleAddMoreDetailField} className='px-4 py-2 bg-primary-200 text-white rounded hover:bg-primary-200/90 font-medium shadow-sm'>Add</button>
                </div>
             </div>
          </div>
       )}

       {openAddAttribute && (
          <div className='fixed inset-0 bg-neutral-900 bg-opacity-70 flex items-center justify-center z-50 p-4'>
             <div className='bg-white p-6 rounded-lg w-full max-w-sm shadow-xl animate-zoom-in'>
                <div className='flex items-center justify-between mb-4'>
                   <h3 className='font-bold text-lg'>Add Attribute Type</h3>
                   <button onClick={() => { setOpenAddAttribute(false); setNewAttributeTypeName(''); }}><IoClose size={24} /></button>
                </div>
                <input 
                  type='text'
                  autoFocus
                  placeholder='Name (e.g. Size, Color)'
                  className='w-full bg-blue-50 p-3 outline-none border focus:border-primary-200 rounded mb-4'
                  value={newAttributeTypeName}
                  onChange={e => setNewAttributeTypeName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddAttributeType()}
                />
                <div className='flex justify-end gap-3'>
                   <button onClick={() => { setOpenAddAttribute(false); setNewAttributeTypeName(''); }} className='px-4 py-2 border rounded hover:bg-neutral-50 font-medium'>Cancel</button>
                   <button onClick={handleAddAttributeType} className='px-4 py-2 bg-primary-200 text-white rounded hover:bg-primary-200/90 font-medium shadow-sm'>Add</button>
                </div>
             </div>
          </div>
       )}

       {openAddReview && (
          <div className='fixed inset-0 bg-neutral-900 bg-opacity-70 flex items-center justify-center z-50 p-4'>
             <div className='bg-white p-6 rounded-lg w-full max-w-md shadow-xl animate-zoom-in'>
                <div className='flex items-center justify-between mb-4'>
                   <h3 className='font-bold text-lg'>Add New Review</h3>
                   <button onClick={() => setOpenAddReview(false)}><IoClose size={24} /></button>
                </div>
                <div className='grid gap-4'>
                   <div className='grid gap-1'>
                      <label className='text-sm font-medium'>Reviewer Name</label>
                      <input 
                        type='text'
                        placeholder='Full Name'
                        className='bg-blue-50 p-3 outline-none border focus:border-primary-200 rounded'
                        value={reviewName}
                        onChange={e => setReviewName(e.target.value)}
                      />
                   </div>
                   <div className='grid gap-1'>
                      <label className='text-sm font-medium'>Stars (0-5)</label>
                      <div className='flex items-center gap-2 text-yellow-500'>
                         {[1, 2, 3, 4, 5].map((s) => (
                            <button 
                              key={s} 
                              type='button'
                              onClick={() => setReviewStars(s)}
                              className='transition-transform hover:scale-110 active:scale-95'
                            >
                               {reviewStars >= s ? <IoStar size={28} /> : <IoStarOutline size={28} />}
                            </button>
                         ))}
                         <span className='ml-2 text-neutral-600 font-bold'>({reviewStars})</span>
                      </div>
                   </div>
                   <div className='grid gap-1'>
                      <label className='text-sm font-medium'>Comment</label>
                      <textarea 
                        rows={3}
                        placeholder='Write your review here...'
                        className='bg-blue-50 p-3 outline-none border focus:border-primary-200 rounded resize-none'
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                      />
                   </div>
                </div>
                <div className='flex justify-end gap-3 mt-6'>
                   <button onClick={() => setOpenAddReview(false)} className='px-4 py-2 border rounded hover:bg-neutral-50 font-medium transition-all'>Cancel</button>
                   <button onClick={handleAddReview} className='px-4 py-2 bg-primary-200 text-white rounded hover:bg-primary-200/90 font-medium shadow-md transition-all'>Add Review</button>
                </div>
             </div>
          </div>
       )}

       {ViewImageURL && <ViewImage url={ViewImageURL} close={() => setViewImageURL('')} />}
    </section>
  );
};

export default UploadProduct;