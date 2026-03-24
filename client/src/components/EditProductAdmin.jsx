import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
import CategoryDropdown from './CategoryDropdown';

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
    altText: propsData.altText || '',
    storage_instructions: propsData.storage_instructions || '',
    storage_image: propsData.storage_image || '',
    megaCombo: propsData.megaCombo || false,
    trending: propsData.trending || false
  });

  const [imageFileMap, setImageFileMap] = useState({}); // Maps previewUrl to File object

  const [imageLoading, setImageLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [viewImageURL, setViewImageURL] = useState('');
  const allCategory = useSelector((state) => state.product.allCategory || []);
  const allSubCategory = useSelector((state) => state.product.allSubCategory || []);

  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState('');

  const [openAddAttribute, setOpenAddAttribute] = useState(false);
  const [newAttributeTypeName, setNewAttributeTypeName] = useState('');
  const [attributeNameInputType, setAttributeNameInputType] = useState('select');

  const [selectedAttributeTypeForOption, setSelectedAttributeTypeForOption] = useState('');
  const [newOptionValue, setNewOptionValue] = useState('');
  const [newOptionOriginalPrice, setNewOptionOriginalPrice] = useState('');
  const [newOptionOfferPrice, setNewOptionOfferPrice] = useState('');
  const [newOptionStock, setNewOptionStock] = useState(null);

  const [openAddReview, setOpenAddReview] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMegaComboToggle = (e) => {
    const isChecked = e.target.checked;
    setData((prev) => ({ 
      ...prev, 
      comboOffer: isChecked,
      megaCombo: isChecked 
    }));
  };

  const handleTrendingToggle = (e) => {
    setData((prev) => ({ ...prev, trending: e.target.checked }));
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
    if (newOptionOriginalPrice === '' || isNaN(Number(newOptionOriginalPrice)) || Number(newOptionOriginalPrice) < 0) {
      toast.error('Please enter a valid original price.');
      return;
    }
    if (newOptionOfferPrice === '' || isNaN(Number(newOptionOfferPrice)) || Number(newOptionOfferPrice) < 0) {
      toast.error('Please enter a valid offer price.');
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
                originalPrice: Number(newOptionOriginalPrice),
                offerPrice: Number(newOptionOfferPrice),
                price: Number(newOptionOfferPrice), // Sync for compatibility
                stock: newOptionStock !== null ? Number(newOptionStock) : null,
                unit: "", // Removed unit
              },
            ],
          };
        }
        return attrGroup;
      });
      return { ...prev, attributes: updatedAttributes };
    });

    setNewOptionValue('');
    setNewOptionOriginalPrice('');
    setNewOptionOfferPrice('');
    setNewOptionStock(null);
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

  const handleUploadStorageImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error('Storage image exceeds the 5MB limit.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImageFileMap(prev => ({ ...prev, [previewUrl]: file }));
    setData(prev => ({ ...prev, storage_image: previewUrl }));
  };

  const handleDeleteStorageImage = () => {
    const urlToDelete = data.storage_image;
    if (imageFileMap[urlToDelete]) {
      const { [urlToDelete]: removed, ...remainingMap } = imageFileMap;
      setImageFileMap(remainingMap);
      URL.revokeObjectURL(urlToDelete);
    }
    setData(prev => ({ ...prev, storage_image: '' }));
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

      let storageImageUrl = data.storage_image;
      if (data.storage_image && imageFileMap[data.storage_image]) {
        const uploadResponse = await uploadImage(imageFileMap[data.storage_image], 'product');
        storageImageUrl = uploadResponse.data.data.url;
      }

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
        megaCombo: data.megaCombo,
        trending: data.trending,
        altText: data.altText,
        storage_instructions: data.storage_instructions,
        storage_image: storageImageUrl,
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
    <div className='fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
      <div className='relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-zoom-in'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b bg-white'>
          <h3 className='text-lg font-bold text-gray-800'>Edit Product</h3>
          <button onClick={close} className='text-gray-400 hover:text-red-500 transition-colors'>
            <IoClose size={26} />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <div className='flex-1 overflow-y-auto p-6 bg-slate-50'>
          <form id="editProductForm" onSubmit={handleSubmit} className='space-y-6'>
            {/* Basic Info */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <div className='flex flex-col gap-1.5'>
                <label className='text-[15px] font-bold text-gray-700' htmlFor='name'>Product Name</label>
                <input
                  type='text' id='name' name='name' value={data.name} onChange={handleChange} required
                  placeholder='Enter product name'
                  className='bg-white px-4 py-2.5 outline-none border border-gray-200 rounded-xl focus:border-indigo-500 transition-all font-medium'
                />
              </div>
              <div className='flex flex-col gap-1.5'>
                <label className='text-[15px] font-bold text-gray-700' htmlFor='altText'>SEO Alt Text</label>
                <input
                  type='text' id='altText' name='altText' value={data.altText} onChange={handleChange}
                  placeholder='Describe images for SEO'
                  className='bg-white px-4 py-2.5 outline-none border border-gray-200 rounded-xl focus:border-indigo-500 transition-all font-medium'
                />
              </div>
            </div>

            <div className='flex flex-col gap-1.5'>
              <label className='text-[15px] font-bold text-gray-700' htmlFor='description'>Description</label>
              <textarea
                id='description' name='description' value={data.description} onChange={handleChange} required rows={3}
                placeholder='Enter product description'
                className='bg-white px-4 py-2.5 outline-none border border-gray-200 rounded-xl focus:border-indigo-500 transition-all font-medium resize-none'
              />
            </div>

            <div className='flex items-center gap-2.5 bg-white p-3 rounded-xl border border-gray-100 shadow-sm w-fit'>
            <div className='flex flex-wrap items-center gap-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm'>
                <div className='flex items-center gap-2'>
                  <input
                    type='checkbox' id='editMegaCombo' checked={data.megaCombo} onChange={handleMegaComboToggle}
                    className='w-5 h-5 text-[#279d68] border-gray-300 rounded-lg focus:ring-[#279d68] cursor-pointer'
                  />
                  <label htmlFor='editMegaCombo' className='text-sm font-bold text-slate-700 cursor-pointer uppercase tracking-tight'>Mega Combo Offer</label>
                </div>

                <div className='flex items-center gap-2 ml-auto'>
                  <input
                    type='checkbox' id='editTrending' checked={data.trending} onChange={handleTrendingToggle}
                    className='w-5 h-5 text-[#279d68] border-gray-300 rounded-lg focus:ring-[#279d68] cursor-pointer'
                  />
                  <label htmlFor='editTrending' className='text-sm font-bold text-slate-700 cursor-pointer uppercase tracking-tight'>Trending</label>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className='space-y-3'>
              <label className='text-[15px] font-bold text-gray-700'>Product Images</label>
              <div className='flex flex-wrap items-center gap-4'>
                {data.image.map((img, index) => (
                  <div key={img + index} className='relative w-24 h-36 bg-white rounded-xl border border-gray-200 p-1 group shadow-sm'>
                     <img 
                       src={img} 
                       alt='product' 
                       className='w-full h-full object-cover rounded-lg cursor-pointer' 
                       onClick={() => setViewImageURL(img)}
                     />
                     <button
                        type='button' onClick={() => handleDeleteImage(index)}
                        className='absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all z-10'
                     >
                       <IoClose size={14} />
                     </button>
                  </div>
                ))}
                {data.image.length < 10 && (
                  <label htmlFor='editProductImages' className='cursor-pointer group'>
                     <input type='file' id='editProductImages' className='hidden' accept='image/*' multiple onChange={handleUploadImages} disabled={imageLoading} />
                     <img
                       className='w-24 h-36 object-cover rounded-xl border-2 border-dashed border-gray-300 group-hover:border-[#279d68] transition-all'
                       src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png"
                       alt="uploadArea"
                     />
                  </label>
                )}
                {imageLoading && <div className='w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin' />}
              </div>
            </div>

            {/* Categories and Subcategories using CategoryDropdown */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
               <div className='space-y-2'>
                  <CategoryDropdown 
                    label="Category"
                    options={allCategory}
                    selectedOptions={data.category}
                    placeholder="Select Category"
                    onSelect={(cat) => {
                       if (!data.category.some(c => c._id === cat._id)) {
                         setData(prev => ({ ...prev, category: [...prev.category, cat] }));
                       }
                    }}
                  />
                  <div className='flex flex-wrap gap-2 pt-1'>
                    {data.category.map((c, i) => (
                      <span key={c._id + i} className='bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 border border-indigo-100'>
                         {c.name} <IoClose className='cursor-pointer' onClick={() => handleRemoveCategory(i)} />
                      </span>
                    ))}
                  </div>
               </div>

               <div className='space-y-2'>
                  <CategoryDropdown 
                    label="Sub Category"
                    options={allSubCategory}
                    selectedOptions={data.subCategory}
                    placeholder="Select Sub Category"
                    onSelect={(sub) => {
                       if (!data.subCategory.some(s => s._id === sub._id)) {
                         setData(prev => ({ ...prev, subCategory: [...prev.subCategory, sub] }));
                       }
                    }}
                  />
                  <div className='flex flex-wrap gap-2 pt-1'>
                    {data.subCategory.map((s, i) => (
                      <span key={s._id + i} className='bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 border border-emerald-100'>
                         {s.name} <IoClose className='cursor-pointer' onClick={() => handleRemoveSubCategory(i)} />
                      </span>
                    ))}
                  </div>
               </div>
            </div>

            <hr className='border-gray-200' />

            {/* Storage Instructions */}
            <div className='space-y-4'>
               <h4 className='text-[15px] font-bold text-gray-800'>Storage & Usage Instructions</h4>
               <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                  <div className='flex flex-col gap-1.5'>
                    <label className='text-[13px] font-bold text-gray-500' htmlFor='storage_instructions'>Instructions</label>
                    <textarea
                      id='storage_instructions' name='storage_instructions' value={data.storage_instructions} onChange={handleChange} rows={4}
                      placeholder='Enter storage or usage instructions...'
                      className='bg-white px-4 py-2.5 outline-none border border-gray-200 rounded-xl focus:border-indigo-500 transition-all text-sm font-medium resize-none'
                    />
                  </div>
                  <div className='flex flex-col gap-1.5'>
                    <label className='text-[13px] font-bold text-gray-500'>Instruction Image (Max 5MB)</label>
                    {data.storage_image ? (
                       <div className='relative w-full h-32 bg-white rounded-xl border border-gray-200 p-1 group shadow-sm'>
                          <img src={data.storage_image} alt='storage' className='w-full h-full object-contain rounded-lg cursor-pointer' onClick={() => setViewImageURL(data.storage_image)} />
                          <button
                             type='button' onClick={handleDeleteStorageImage}
                             className='absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all z-10'
                          >
                            <IoClose size={14} />
                          </button>
                       </div>
                    ) : (
                       <label htmlFor='editStorageImage' className='cursor-pointer group'>
                          <input type='file' id='editStorageImage' className='hidden' accept='image/*' onChange={handleUploadStorageImage} />
                          <div className='w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 group-hover:border-[#279d68] transition-all bg-white font-bold text-gray-400'>
                             <IoCloudUploadOutline size={24} className='group-hover:text-[#279d68]' />
                             <span className='text-[11px] uppercase tracking-widest group-hover:text-[#279d68]'>Upload Image</span>
                          </div>
                       </label>
                    )}
                  </div>
               </div>
            </div>

            <hr className='border-gray-200' />

            {/* Custom Fields (More Details) */}
            <div className='space-y-4'>
               <div className='flex items-center justify-between'>
                  <h4 className='text-[15px] font-bold text-gray-800'>Additional Specs</h4>
                  <button
                    type='button' onClick={() => setOpenAddField(true)}
                    className='text-[#279d68] hover:text-white hover:bg-[#279d68] font-bold text-[13px] flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-lg border border-[#279d68]/30 transition-all'
                  >
                    <IoAdd size={18} /> Add Attribute
                  </button>
               </div>
               <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                 {Object.keys(data.more_details).map((k) => (
                   <div key={k} className='bg-white p-3 rounded-xl border border-gray-100 shadow-sm space-y-2'>
                      <label className='text-[12px] font-bold text-slate-400 uppercase tracking-wider'>{k}</label>
                      <div className='flex items-center gap-3'>
                        <input
                          type='text' value={data.more_details[k]}
                          onChange={(e) => handleMoreDetailsChange(k, e.target.value)}
                          className='flex-grow bg-slate-50 px-3 py-2 outline-none border border-gray-100 rounded-lg text-sm font-medium focus:border-[#279d68]'
                        />
                        <button
                           type='button' onClick={() => { const d = {...data.more_details}; delete d[k]; setData(prev => ({...prev, more_details: d})); }}
                           className='p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors'
                        >
                           <IoTrashOutline size={18} />
                        </button>
                      </div>
                   </div>
                 ))}
               </div>
            </div>

            <hr className='border-gray-200' />

            {/* Attributes (Groups) */}
            <div className='space-y-4'>
               <div className='flex items-center justify-between'>
                  <h4 className='text-[15px] font-bold text-gray-800'>Pricing Options (Size/Qty)</h4>
                  <button
                    type='button' onClick={() => setOpenAddAttribute(true)}
                    className='text-[#279d68] hover:text-white hover:bg-[#279d68] font-bold text-[13px] flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-lg border border-[#279d68]/30 transition-all'
                  >
                    <IoAdd size={18} /> New Group
                  </button>
               </div>

               {data.attributes.map((attr) => (
                  <div key={attr.name} className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
                     <div className='bg-slate-50 px-5 py-3 flex items-center justify-between border-b border-gray-100'>
                        <span className='font-bold text-gray-800 text-[14px]'>{attr.name}</span>
                        <button type='button' onClick={() => handleDeleteAttributeType(attr.name)} className='text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg'><IoTrashOutline size={18} /></button>
                     </div>
                     <div className='p-4 space-y-4'>
                        <div className='flex flex-wrap gap-2'>
                           {attr.options.map((opt, ix) => (
                             <span key={ix} className='bg-indigo-50/50 text-indigo-700 px-3 py-1.5 rounded-xl text-[12px] font-bold border border-indigo-100/50 flex items-center gap-2'>
                                {opt.name} · ₹{opt.offerPrice} <span className='line-through text-slate-400 font-medium'>₹{opt.originalPrice}</span>
                                <IoClose className='cursor-pointer hover:text-rose-500' onClick={() => handleDeleteAttributeOption(attr.name, opt.name)} />
                             </span>
                           ))}
                        </div>
                        {selectedAttributeTypeForOption === attr.name ? (
                           <div className='grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-dashed border-indigo-200'>
                              <div className='space-y-1.5'>
                                <label className='text-[11px] font-bold text-slate-400 tracking-wider uppercase'>Value</label>
                                <input type='text' placeholder='e.g. 1kg' value={newOptionValue} onChange={e => setNewOptionValue(e.target.value)} className='w-full px-3 py-2 rounded-xl border border-gray-200 text-sm' />
                              </div>
                              <div className='space-y-1.5'>
                                 <label className='text-[11px] font-bold text-slate-400 tracking-wider uppercase'>Original Price</label>
                                 <input type='number' placeholder='0' value={newOptionOriginalPrice} onChange={e => setNewOptionOriginalPrice(e.target.value)} className='w-full px-3 py-2 rounded-xl border border-gray-200 text-sm' />
                               </div>
                               <div className='space-y-1.5'>
                                 <label className='text-[11px] font-bold text-slate-400 tracking-wider uppercase'>Offer Price</label>
                                 <input type='number' placeholder='0' value={newOptionOfferPrice} onChange={e => setNewOptionOfferPrice(e.target.value)} className='w-full px-3 py-2 rounded-xl border border-gray-200 text-sm' />
                               </div>
                               <div className='space-y-1.5'>
                                 <label className='text-[11px] font-bold text-slate-400 tracking-wider uppercase'>Stock</label>
                                 <input type='number' placeholder='∞' value={newOptionStock || ""} onChange={e => setNewOptionStock(e.target.value === "" ? null : Number(e.target.value))} className='w-full px-3 py-2 rounded-xl border border-gray-200 text-sm' />
                               </div>
                              <div className='col-span-2 md:col-span-4 flex justify-end gap-2 pt-2'>
                                 <button type='button' onClick={() => setSelectedAttributeTypeForOption("")} className='px-4 py-2 text-xs font-bold text-slate-500'>Cancel</button>
                                 <button type='button' onClick={handleAddAttributeOption} className='px-6 py-2 bg-[#279d68] text-white rounded-xl text-xs font-bold shadow-lg shadow-green-100 hover:bg-[#279d68]/90 transition-all'>Add Option</button>
                              </div>
                           </div>
                        ) : (
                           <button type='button' onClick={() => setSelectedAttributeTypeForOption(attr.name)} className='text-[#279d68] text-[13px] font-bold hover:underline tracking-tight'>+ Add Pricing Option</button>
                        )}
                     </div>
                  </div>
               ))}
            </div>

            <hr className='border-gray-200' />

            {/* Manual Reviews */}
            <div className='space-y-4 pb-4'>
               <div className='flex items-center justify-between'>
                  <h4 className='text-[15px] font-bold text-gray-800'>Manual Reviews</h4>
                  <button
                    type='button' onClick={() => setOpenAddReview(true)}
                    className='text-[#279d68] hover:text-white hover:bg-[#279d68] font-bold text-[13px] flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-lg border border-[#279d68]/30 transition-all'
                  >
                    <IoAdd size={18} /> New Review
                  </button>
               </div>
               <div className='grid gap-3'>
                  {data.reviews.map((review, index) => (
                    <div key={index} className='p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex justify-between items-start gap-4'>
                       <div className='grid gap-1'>
                          <div className='flex items-center gap-2'>
                             <p className='font-bold text-slate-800'>{review.name}</p>
                             <div className='flex text-amber-400'>
                                {[...Array(5)].map((_, i) => (
                                  i < review.stars ? <IoStar key={i} /> : <IoStarOutline key={i} />
                                ))}
                             </div>
                          </div>
                          <p className='text-sm text-slate-500 leading-relaxed'>{review.comment}</p>
                       </div>
                       <button
                         type='button' onClick={() => handleDeleteReview(index)}
                         className='text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-all'
                       >
                         <IoTrashOutline size={18} />
                       </button>
                    </div>
                  ))}
               </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className='px-6 py-4 border-t bg-white flex items-center justify-end gap-3'>
          <button
            type='button' onClick={close} disabled={submitLoading}
            className='px-6 py-2.5 text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all'
          >
            Cancel
          </button>
          <button
            type='submit' form="editProductForm" disabled={submitLoading}
            className='px-10 py-2.5 bg-[#279d68] text-white text-sm font-bold rounded-xl shadow-lg shadow-green-100 hover:bg-[#279d68]/90 transition-all disabled:opacity-50 flex items-center gap-2'
          >
            {submitLoading ? <><div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' /> <span>Updating...</span></> : "Update Product"}
          </button>
        </div>

        {/* Inner Modals (Add Field / Add Attribute / Add Review) */}
        {openAddField && (
          <div className='fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm'>
            <div className='bg-white p-6 rounded-2xl w-full max-w-[320px] shadow-2xl animate-zoom-in'>
               <h4 className='text-lg font-bold text-slate-900 mb-1'>New Specification</h4>
               <p className='text-xs text-slate-500 mb-6 font-medium'>e.g. Material, Purity, Usage</p>
               <input
                 autoFocus type='text' placeholder='Field Name' value={fieldName} onChange={e => setFieldName(e.target.value)}
                 className='w-full bg-slate-50 px-4 py-3 outline-none border border-slate-100 rounded-xl mb-6 text-sm font-bold focus:border-[#279d68]'
               />
               <div className='flex gap-3'>
                 <button onClick={() => setOpenAddField(false)} className='flex-1 py-2.5 text-xs font-bold text-slate-500'>Cancel</button>
                 <button onClick={handleAddMoreDetailField} className='flex-1 py-2.5 text-xs font-bold text-white bg-[#279d68] rounded-xl shadow-lg shadow-green-100'>Add</button>
               </div>
            </div>
          </div>
        )}

        {openAddAttribute && (
          <div className='fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm'>
            <div className='bg-white p-6 rounded-2xl w-full max-w-[320px] shadow-2xl animate-zoom-in'>
               <h4 className='text-lg font-bold text-slate-900 mb-1'>New Pricing Group</h4>
               <p className='text-xs text-slate-500 mb-6 font-medium'>e.g. Weight Options, Size Options</p>
               <input
                 autoFocus type='text' placeholder='Group Name' value={newAttributeTypeName} onChange={e => setNewAttributeTypeName(e.target.value)}
                 className='w-full bg-slate-50 px-4 py-3 outline-none border border-slate-100 rounded-xl mb-6 text-sm font-bold focus:border-[#279d68]'
               />
               <div className='flex gap-3'>
                 <button onClick={() => { setOpenAddAttribute(false); setNewAttributeTypeName(''); }} className='flex-1 py-2.5 text-xs font-bold text-slate-500'>Cancel</button>
                 <button onClick={handleAddAttributeType} className='flex-1 py-2.5 text-xs font-bold text-white bg-[#279d68] rounded-xl shadow-lg shadow-green-100'>Add</button>
               </div>
            </div>
          </div>
        )}

        {openAddReview && (
          <div className='fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm'>
            <div className='bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl animate-zoom-in'>
               <h4 className='text-lg font-bold text-slate-900 mb-1'>New Review</h4>
               <p className='text-xs text-slate-500 mb-6 font-medium'>Manual customer feedback</p>
               <div className='space-y-4'>
                  <div className='space-y-1'>
                    <label className='text-[11px] font-bold text-slate-400 uppercase tracking-wider'>Reviewer Name</label>
                    <input
                      type='text' placeholder='Full Name' value={reviewName} onChange={e => setReviewName(e.target.value)}
                      className='w-full bg-slate-50 px-4 py-2.5 outline-none border border-slate-100 rounded-xl text-sm font-medium focus:border-[#279d68]'
                    />
                  </div>
                  <div className='space-y-1'>
                    <label className='text-[11px] font-bold text-slate-400 uppercase tracking-wider'>Stars (1-5)</label>
                    <div className='flex items-center gap-3 text-amber-400 bg-slate-50 p-2.5 rounded-xl border border-slate-100'>
                       {[1, 2, 3, 4, 5].map((s) => (
                          <button key={s} type='button' onClick={() => setReviewStars(s)} className='transition-transform hover:scale-110 active:scale-90'>
                             {reviewStars >= s ? <IoStar size={24} /> : <IoStarOutline size={24} />}
                          </button>
                       ))}
                       <span className='ml-2 text-slate-900 font-bold'>({reviewStars})</span>
                    </div>
                  </div>
                  <div className='space-y-1'>
                    <label className='text-[11px] font-bold text-slate-400 uppercase tracking-wider'>Comment</label>
                    <textarea
                      rows={3} placeholder='Write feedback...' value={reviewComment} onChange={e => setReviewComment(e.target.value)}
                      className='w-full bg-slate-50 px-4 py-2.5 outline-none border border-slate-100 rounded-xl text-sm font-medium focus:border-[#279d68] resize-none'
                    />
                  </div>
               </div>
               <div className='flex gap-3 mt-8'>
                 <button onClick={() => setOpenAddReview(false)} className='flex-1 py-3 text-sm font-bold text-slate-500'>Cancel</button>
                 <button onClick={handleAddReview} className='flex-1 py-3 text-sm font-bold text-white bg-[#279d68] rounded-xl shadow-lg shadow-green-100'>Submit Review</button>
               </div>
            </div>
          </div>
        )}

        {viewImageURL && <ViewImage url={viewImageURL} close={() => setViewImageURL('')} />}
      </div>
    </div>
  );
};

export default EditProductAdmin;
