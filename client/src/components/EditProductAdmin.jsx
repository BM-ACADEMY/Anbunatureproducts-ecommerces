// EditProductAdmin.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IoCloudUploadOutline, IoClose, IoAdd, IoTrashOutline, IoStar, IoStarOutline } from "react-icons/io5";
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from './ViewImage';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';
import { toast } from 'sonner';

const predefinedAttributeNames = ['Size', 'Weight', 'Material', 'Memory', 'Storage', 'Processor', 'Color', 'Capacity'];

const EditProductAdmin = ({ close, data: propsData, fetchProductData }) => {
  const [data, setData] = useState({
    _id: propsData._id || '',
    name: propsData.name || '',
    image: propsData.image || [],
    category: propsData.category || [],
    subCategory: propsData.subCategory || [],
    description: propsData.description || '',
    more_details: propsData.more_details || {},
    attributes: propsData.attributes || [],
    reviews: propsData.reviews || [],
    comboOffer: propsData.comboOffer || false,
    altText: propsData.altText || '' // Added altText field
  });

  const [imageFileMap, setImageFileMap] = useState({}); // Maps previewUrl to File object

  const [imageLoading, setImageLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [viewImageURL, setViewImageURL] = useState('');
  const allCategory = useSelector((state) => state.product.allCategory || []);
  const allSubCategory = useSelector((state) => state.product.allSubCategory || []);
  const [selectCategory, setSelectCategory] = useState('');
  const [selectSubCategory, setSelectSubCategory] = useState('');

  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState('');

  const [openAddAttribute, setOpenAddAttribute] = useState(false);
  const [newAttributeTypeName, setNewAttributeTypeName] = useState('');
  const [attributeNameInputType, setAttributeNameInputType] = useState('select');

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
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleComboOfferToggle = (e) => {
    setData((prev) => ({
      ...prev,
      comboOffer: e.target.checked,
    }));
  };
  const handleUploadImages = (e) => {
    const files = e.target.files;
    if (!files) return;

    const newImageFiles = Array.from(files);
    const newImageData = {};

    newImageFiles.forEach(file => {
      const previewUrl = URL.createObjectURL(file);
      newImageData[previewUrl] = file;
    });

    setImageFileMap(prev => ({ ...prev, ...newImageData }));
    setData((prev) => ({
      ...prev,
      image: [...prev.image, ...Object.keys(newImageData)],
    }));
  };

  const handleDeleteImage = (index) => {
    const urlToDelete = data.image[index];
    const newImages = [...data.image];
    newImages.splice(index, 1);
    
    // Cleanup if it was a local preview
    if (imageFileMap[urlToDelete]) {
      const { [urlToDelete]: removed, ...remainingMap } = imageFileMap;
      setImageFileMap(remainingMap);
      URL.revokeObjectURL(urlToDelete);
    }
    
    setData((prev) => ({ ...prev, image: newImages }));
  };

  const handleRemoveCategory = (index) => {
    setData((prev) => ({ ...prev, category: prev.category.filter((_, i) => i !== index) }));
  };

  const handleRemoveSubCategory = (index) => {
    setData((prev) => ({ ...prev, subCategory: prev.subCategory.filter((_, i) => i !== index) }));
  };

  const handleAddMoreDetailField = () => {
    if (!fieldName.trim()) {
      toast.error('Field name cannot be empty.');
      return;
    }
    setData((prev) => ({ ...prev, more_details: { ...prev.more_details, [fieldName]: '' } }));
    setFieldName('');
    setOpenAddField(false);
  };

  const handleMoreDetailsChange = (key, value) => {
    setData((prev) => ({ ...prev, more_details: { ...prev.more_details, [key]: value } }));
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
    setAttributeNameInputType('select');
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

  const handleDeleteAttributeType = (attributeTypeToDelete) => {
    setData((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((attrGroup) => attrGroup.name !== attributeTypeToDelete),
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

      const imageUrls = await Promise.all(
        data.image.map(async (url) => {
          if (imageFileMap[url]) {
            const uploadResponse = await uploadImage(imageFileMap[url], 'product');
            return uploadResponse.data.data.url;
          }
          return url;
        })
      );

      const productDataToSend = {
        _id: data._id,
        name: data.name,
        image: imageUrls,
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
        ...SummaryApi.updateProductDetails,
        data: productDataToSend,
      });

      if (response.data.success) {
        successAlert(response.data.message);
        
        // Cleanup local previews
        Object.keys(imageFileMap).forEach(url => URL.revokeObjectURL(url));
        setImageFileMap({});

        close();
        fetchProductData();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <section className='fixed inset-0 bg-neutral-900 bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto'>
       <div className='bg-white w-full max-w-4xl p-6 rounded-lg shadow-xl relative animate-zoom-in my-8'>
          <div className='flex items-center justify-between mb-6'>
             <h2 className='font-bold text-xl'>Edit Product</h2>
             <button onClick={close} className='p-2 hover:bg-neutral-100 rounded-full transition-all'>
                <IoClose size={24} />
             </button>
          </div>

          <form className='grid gap-6' onSubmit={handleSubmit}>
            <div className='grid gap-1'>
               <label htmlFor='name' className='font-medium'>Name</label>
               <input 
                 type='text'
                 id='name'
                 name='name'
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
               <label htmlFor='editProductImages' className='bg-blue-50 h-24 border border-dashed border-primary-200 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100 transition-all'>
                  {imageLoading ? <Loading /> : (
                    <>
                      <IoCloudUploadOutline size={30} className='text-primary-200' />
                      <p className='text-sm mt-1 text-neutral-600'>Upload More Images</p>
                    </>
                  )}
                  <input 
                    type='file'
                    id='editProductImages'
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

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
               <div className='grid gap-1'>
                  <label className='font-medium'>Category</label>
                  <select 
                    className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded cursor-pointer'
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

               <div className='grid gap-1'>
                  <label className='font-medium'>Sub Category</label>
                  <select 
                    className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded cursor-pointer'
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
            </div>

            <hr />

            {/* More Details */}
            <div className='grid gap-4'>
               <div className='flex items-center justify-between'>
                  <h3 className='font-semibold italic text-neutral-600'>More Details Section</h3>
                  <button 
                    type='button'
                    onClick={() => setOpenAddField(true)}
                    className='text-primary-200 hover:bg-primary-100 p-1 px-3 rounded flex items-center gap-1 text-sm font-medium border border-primary-100 transition-all'
                  >
                    <IoAdd size={18} /> Add Field
                  </button>
               </div>
               
               {Object.keys(data.more_details).map((k) => (
                 <div key={k} className='grid gap-1'>
                    <label className='font-medium text-sm text-neutral-500 capitalize'>{k}</label>
                    <div className='flex items-center gap-2'>
                       <input 
                         type='text'
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

            <hr />

            {/* Attributes */}
            <div className='grid gap-4'>
               <div className='flex items-center justify-between'>
                  <h3 className='font-semibold italic text-neutral-600'>Product (Size or quantity)</h3>
                  <button 
                    type='button'
                    onClick={() => setOpenAddAttribute(true)}
                    className='text-primary-200 hover:bg-primary-100 p-1 px-3 rounded flex items-center gap-1 text-sm font-medium border border-primary-100 transition-all'
                  >
                    <IoAdd size={18} /> Add New Attribute Type
                  </button>
               </div>

               {data.attributes.map((attrGroup) => (
                  <div key={attrGroup.name} className='border p-4 rounded bg-neutral-50 shadow-inner'>
                     <div className='flex items-center justify-between mb-3'>
                        <h4 className='font-bold text-primary-200'>{attrGroup.name}</h4>
                        <button 
                          type='button'
                          onClick={() => handleDeleteAttributeType(attrGroup.name)}
                          className='text-red-500 p-1 hover:bg-red-50 rounded'
                        >
                          <IoTrashOutline size={20} />
                        </button>
                     </div>

                     <div className='flex flex-wrap gap-2 mb-4'>
                        {attrGroup.options.map((option, idx) => (
                          <span key={option.name + idx} className='bg-white border border-primary-100 text-primary-200 px-3 py-1 rounded-md flex items-center gap-2 text-xs font-semibold'>
                             {option.name} ({option.price > 0 ? '+' : ''}{option.price}) {option.unit}
                             <IoClose className='cursor-pointer text-neutral-400 hover:text-red-500' onClick={() => handleDeleteAttributeOption(attrGroup.name, option.name)} />
                          </span>
                        ))}
                     </div>

                     <div className='grid gap-3'>
                        <button 
                          type='button'
                          onClick={() => setSelectedAttributeTypeForOption(attrGroup.name)}
                          className='w-fit text-primary-200 text-xs font-bold hover:underline'
                        >
                          + Add Option to {attrGroup.name}
                        </button>

                        {selectedAttributeTypeForOption === attrGroup.name && (
                           <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-white p-4 border rounded shadow-md mt-2'>
                              <div className='grid gap-1'>
                                 <label className='text-xs font-medium text-neutral-500'>Value</label>
                                 <input 
                                   type='text' 
                                   placeholder='e.g. 1kg, Red'
                                   className='bg-blue-50 p-2 outline-none border rounded text-sm'
                                   value={newOptionValue}
                                   onChange={e => setNewOptionValue(e.target.value)}
                                 />
                              </div>
                              <div className='grid gap-1'>
                                 <label className='text-xs font-medium text-neutral-500'>Price Add</label>
                                 <input 
                                   type='number' 
                                   placeholder='0'
                                   className='bg-blue-50 p-2 outline-none border rounded text-sm'
                                   value={newOptionPrice}
                                   onChange={e => setNewOptionPrice(e.target.value)}
                                 />
                              </div>
                              <div className='grid gap-1'>
                                 <label className='text-xs font-medium text-neutral-500'>Stock</label>
                                 <input 
                                   type='number' 
                                   placeholder='Leave empty for none'
                                   className='bg-blue-50 p-2 outline-none border rounded text-sm'
                                   value={newOptionStock === null ? "" : newOptionStock}
                                   onChange={e => setNewOptionStock(e.target.value === "" ? null : Number(e.target.value))}
                                 />
                              </div>
                              <div className='grid gap-1'>
                                 <label className='text-xs font-medium text-neutral-500'>Unit</label>
                                 <input 
                                   type='text' 
                                   placeholder='e.g. kg'
                                   className='bg-blue-50 p-2 outline-none border rounded text-sm'
                                   value={newOptionUnit}
                                   onChange={e => setNewOptionUnit(e.target.value)}
                                 />
                              </div>
                              <div className='flex gap-2 sm:col-span-4 justify-end mt-2'>
                                 <button 
                                   type='button'
                                   onClick={() => setSelectedAttributeTypeForOption("")}
                                   className='px-4 py-2 text-xs border rounded hover:bg-neutral-50 font-medium'
                                 >
                                   Cancel
                                 </button>
                                 <button 
                                   type='button'
                                   onClick={handleAddAttributeOption}
                                   className='px-4 py-2 text-xs bg-primary-200 text-white rounded hover:bg-primary-200/90 shadow-md font-medium transition-all'
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

            <hr />

            {/* Reviews */}
            <div className='grid gap-4'>
               <div className='flex items-center justify-between'>
                  <h3 className='font-semibold italic text-neutral-600'>Product Reviews (Manual)</h3>
                  <button 
                    type='button'
                    onClick={() => setOpenAddReview(true)}
                    className='text-primary-200 hover:bg-primary-100 p-1 px-3 rounded flex items-center gap-1 text-sm font-medium border border-primary-100 transition-all'
                  >
                    <IoAdd size={18} /> Add New Review
                  </button>
               </div>

               <div className='grid gap-3'>
                  {data.reviews.map((review, index) => (
                    <div key={index} className='p-4 bg-neutral-50 rounded-lg border flex justify-between items-start gap-4'>
                       <div className='grid gap-1'>
                          <div className='flex items-center gap-2'>
                             <p className='font-bold text-neutral-800'>{review.name}</p>
                             <div className='flex text-yellow-500'>
                                {[...Array(5)].map((_, i) => (
                                  i < review.stars ? <IoStar key={i} /> : <IoStarOutline key={i} />
                                ))}
                             </div>
                          </div>
                          <p className='text-sm text-neutral-600 leading-relaxed'>{review.comment}</p>
                       </div>
                       <button 
                         type='button'
                         onClick={() => handleDeleteReview(index)}
                         className='text-red-500 hover:bg-red-100 p-2 rounded-full transition-all'
                       >
                         <IoTrashOutline size={18} />
                       </button>
                    </div>
                  ))}
               </div>
            </div>

            <div className='flex gap-4 mt-4'>
               <button 
                 type='button'
                 onClick={close}
                 className='flex-grow border border-neutral-300 py-3 rounded-lg font-bold hover:bg-neutral-50 transition-all'
               >
                 Cancel
               </button>
               <button 
                 type='submit'
                 disabled={submitLoading}
                 className='flex-grow bg-primary-100 text-primary-200 hover:bg-primary-200 hover:text-white py-3 rounded-lg font-bold transition-all shadow-md'
               >
                 {submitLoading ? "Updating..." : "Update Product"}
               </button>
            </div>
          </form>
       </div>

       {/* Add Field Dialog */}
       {openAddField && (
          <div className='fixed inset-0 bg-neutral-900 bg-opacity-70 flex items-center justify-center z-[60] p-4'>
             <div className='bg-white p-6 rounded-lg w-full max-w-sm shadow-2xl animate-zoom-in'>
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
                   <button onClick={handleAddMoreDetailField} className='px-4 py-2 bg-primary-200 text-white rounded hover:bg-primary-200/90 font-medium shadow-md'>Add</button>
                </div>
             </div>
          </div>
       )}

       {/* Add Attribute Dialog */}
       {openAddAttribute && (
          <div className='fixed inset-0 bg-neutral-900 bg-opacity-70 flex items-center justify-center z-[60] p-4'>
             <div className='bg-white p-6 rounded-lg w-full max-w-sm shadow-2xl animate-zoom-in'>
                <div className='flex items-center justify-between mb-4'>
                   <h3 className='font-bold text-lg'>Add Attribute Type</h3>
                   <button onClick={() => { setOpenAddAttribute(false); setNewAttributeTypeName(''); }}><IoClose size={24} /></button>
                </div>
                
                <div className='grid gap-4 mb-4'>
                   <div className='grid gap-1'>
                      <label className='text-xs font-medium text-neutral-500'>Input Type</label>
                      <select 
                        className='bg-blue-50 p-2 border rounded outline-none focus:border-primary-200'
                        value={attributeNameInputType}
                        onChange={e => setAttributeNameInputType(e.target.value)}
                      >
                         <option value="select">Select Predefined</option>
                         <option value="custom">Custom</option>
                      </select>
                   </div>

                   {attributeNameInputType === 'select' ? (
                      <div className='grid gap-1'>
                         <label className='text-xs font-medium text-neutral-500'>Predefined</label>
                         <select 
                           className='bg-blue-50 p-2 border rounded outline-none focus:border-primary-200'
                           value={newAttributeTypeName}
                           onChange={e => setNewAttributeTypeName(e.target.value)}
                         >
                            <option value="">Choose Attribute</option>
                            {predefinedAttributeNames.map(n => <option key={n} value={n}>{n}</option>)}
                         </select>
                      </div>
                   ) : (
                      <div className='grid gap-1'>
                         <label className='text-xs font-medium text-neutral-500'>Custom Name</label>
                         <input 
                           type='text'
                           autoFocus
                           placeholder='e.g. Color'
                           className='bg-blue-50 p-3 outline-none border focus:border-primary-200 rounded'
                           value={newAttributeTypeName}
                           onChange={e => setNewAttributeTypeName(e.target.value)}
                           onKeyDown={e => e.key === 'Enter' && handleAddAttributeType()}
                         />
                      </div>
                   )}
                </div>

                <div className='flex justify-end gap-3'>
                   <button onClick={() => { setOpenAddAttribute(false); setNewAttributeTypeName(''); }} className='px-4 py-2 border rounded hover:bg-neutral-50 font-medium'>Cancel</button>
                   <button onClick={handleAddAttributeType} className='px-4 py-2 bg-primary-200 text-white rounded hover:bg-primary-200/90 font-medium shadow-md'>Add</button>
                </div>
             </div>
          </div>
       )}

       {/* Add Review Dialog */}
       {openAddReview && (
          <div className='fixed inset-0 bg-neutral-900 bg-opacity-70 flex items-center justify-center z-[60] p-4'>
             <div className='bg-white p-6 rounded-lg w-full max-w-md shadow-2xl animate-zoom-in'>
                <div className='flex items-center justify-between mb-4'>
                   <h3 className='font-bold text-lg'>Add New Review</h3>
                   <button onClick={() => setOpenAddReview(false)}><IoClose size={24} /></button>
                </div>
                <div className='grid gap-4'>
                   <div className='grid gap-1'>
                      <label className='text-sm font-medium text-neutral-600'>Reviewer Name</label>
                      <input 
                        type='text'
                        placeholder='Full Name'
                        className='bg-blue-50 p-3 outline-none border focus:border-primary-200 rounded'
                        value={reviewName}
                        onChange={e => setReviewName(e.target.value)}
                      />
                   </div>
                   <div className='grid gap-1'>
                      <label className='text-sm font-medium text-neutral-600'>Stars (1-5)</label>
                      <div className='flex items-center gap-3 text-yellow-500'>
                         {[1, 2, 3, 4, 5].map((s) => (
                            <button 
                              key={s} 
                              type='button'
                              onClick={() => setReviewStars(s)}
                              className='transition-transform hover:scale-125 active:scale-90 active:duration-75'
                            >
                               {reviewStars >= s ? <IoStar size={32} /> : <IoStarOutline size={32} />}
                            </button>
                         ))}
                         <span className='ml-2 text-neutral-800 font-extrabold text-lg'>({reviewStars})</span>
                      </div>
                   </div>
                   <div className='grid gap-1'>
                      <label className='text-sm font-medium text-neutral-600'>Comment</label>
                      <textarea 
                        rows={3}
                        placeholder='Write your feedback...'
                        className='bg-blue-50 p-3 outline-none border focus:border-primary-200 rounded resize-none'
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                      />
                   </div>
                </div>
                <div className='flex justify-end gap-3 mt-8'>
                   <button onClick={() => setOpenAddReview(false)} className='px-5 py-2 border rounded hover:bg-neutral-100 font-bold transition-all'>Cancel</button>
                   <button onClick={handleAddReview} className='px-5 py-2 bg-primary-200 text-white rounded hover:bg-primary-200/90 font-bold shadow-lg transition-all'>Add Review</button>
                </div>
             </div>
          </div>
       )}

       {viewImageURL && <ViewImage url={viewImageURL} close={() => setViewImageURL('')} />}
    </section>
  );
};

export default EditProductAdmin;
