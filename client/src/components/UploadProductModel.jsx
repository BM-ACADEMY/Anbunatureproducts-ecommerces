import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { IoClose, IoAdd, IoTrashOutline, IoStar, IoStarOutline, IoCloudUploadOutline } from "react-icons/io5";
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';
import { toast } from 'sonner';

import CategoryDropdown from './CategoryDropdown';
import Cropper from 'react-easy-crop';
import { getCroppedImgBlob } from '../utils/cropImage';

const UploadProductModel = ({ close, fetchData }) => {
  const [data, setData] = useState({
    name: '',
    image: [],
    category: '', // Changed to single string ID
    subCategory: [],
    description: '',
    more_details: {},
    attributes: [],
    reviews: [],
    comboOffer: false,
    megaCombo: false,
    trending: false,
    publish: true,
    altText: '',
    storage_instructions: '',
    storage_image: '',
    demoVideoLink: ''
  });

  const [imageFileMap, setImageFileMap] = useState({}); // Maps previewUrl to File object
  const [imageLoading, setImageLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const allCategory = useSelector((state) => state.product.allCategory || []);
  const allSubCategory = useSelector((state) => state.product.allSubCategory || []);
  const [selectCategory, setSelectCategory] = useState('');
  const [selectSubCategory, setSelectSubCategory] = useState('');
  const [selectedCategoryDetails, setSelectedCategoryDetails] = useState(null);

  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState('');

  // Crop State
  const [openCrop, setOpenCrop] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const [openAddAttribute, setOpenAddAttribute] = useState(false);
  const [newAttributeTypeName, setNewAttributeTypeName] = useState('');

  const [selectedAttributeTypeForOption, setSelectedAttributeTypeForOption] = useState('');
  const [newOptionValue, setNewOptionValue] = useState('');
  const [newOptionOriginalPrice, setNewOptionOriginalPrice] = useState('');
  const [newOptionOfferPrice, setNewOptionOfferPrice] = useState('');
  const [newOptionStock, setNewOptionStock] = useState(null);
  const [editingGroupName, setEditingGroupName] = useState(null); // Track which group is being renamed
  const [groupRenameValue, setGroupRenameValue] = useState('');

  const [openAddReview, setOpenAddReview] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  const [isEditingOption, setIsEditingOption] = useState(false);
  const [editingOptionOriginalName, setEditingOptionOriginalName] = useState('');

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

  const handleUploadImages = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (data.image.length >= 10) {
      toast.error("You can only upload a maximum of 10 images.");
      return;
    }

    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error(`Image exceeds the 2MB limit: ${file.name}`);
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setCropImageSrc(reader.result);
      setOpenCrop(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    });
    reader.readAsDataURL(file);
    e.target.value = null; // reset input
  };

  const handleCropSave = async () => {
    try {
      const croppedImageBlob = await getCroppedImgBlob(cropImageSrc, croppedAreaPixels);
      const croppedFile = new File([croppedImageBlob], 'product_image.jpg', { type: 'image/jpeg' });
      
      const previewUrl = URL.createObjectURL(croppedFile);
      setImageFileMap(prev => ({ ...prev, [previewUrl]: croppedFile }));
      setData((prev) => ({
        ...prev,
        image: [...prev.image, previewUrl],
      }));
      setOpenCrop(false);
      setCropImageSrc(null);
    } catch (error) {
      console.error(error);
      toast.error("Error cropping image");
    }
  };

  const handleCropCancel = () => {
    setOpenCrop(false);
    setCropImageSrc(null);
  };

  const handleDeleteImage = (index) => {
    const urlToDelete = data.image[index];
    const newImages = [...data.image];
    newImages.splice(index, 1);

    if (imageFileMap[urlToDelete]) {
      const { [urlToDelete]: removed, ...remainingMap } = imageFileMap;
      setImageFileMap(remainingMap);
      URL.revokeObjectURL(urlToDelete);
    }
    setData((prev) => ({ ...prev, image: newImages }));
  };

  const handleRemoveCategory = () => {
    setData((prev) => ({ ...prev, category: '', subCategory: [] }));
    setSelectedCategoryDetails(null);
  };

  const handleRemoveSubCategory = (index) => {
    setData((prev) => ({ ...prev, subCategory: prev.subCategory.filter((_, i) => i !== index) }));
  };

  const handleAddMoreDetailField = () => {
    if (!fieldName.trim()) return;
    setData((prev) => ({ ...prev, more_details: { ...prev.more_details, [fieldName]: '' } }));
    setFieldName('');
    setOpenAddField(false);
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
  
  const handleRenameGroupName = (oldName) => {
    if (!groupRenameValue.trim()) {
      toast.error('Group name cannot be empty.');
      return;
    }
    if (data.attributes.some((attr) => attr.name.toLowerCase() === groupRenameValue.trim().toLowerCase() && attr.name !== oldName)) {
      toast.error(`Attribute type "${groupRenameValue}" already exists.`);
      return;
    }
    setData((prev) => ({
      ...prev,
      attributes: prev.attributes.map(attr => 
        attr.name === oldName ? { ...attr, name: groupRenameValue.trim() } : attr
      ),
    }));
    setEditingGroupName(null);
    setGroupRenameValue('');
  };

  const handleAddAttributeOption = () => {
    if (!selectedAttributeTypeForOption) { toast.error('Please select an attribute type.'); return; }
    if (!newOptionValue.trim()) { toast.error('Attribute option value cannot be empty.'); return; }
    if (newOptionOriginalPrice === '' || isNaN(Number(newOptionOriginalPrice)) || Number(newOptionOriginalPrice) < 0) {
      toast.error('Please enter a valid original price.'); return;
    }
    // Offer price is now optional
    const offerPrice = newOptionOfferPrice === '' ? Number(newOptionOriginalPrice) : Number(newOptionOfferPrice);
    if (isNaN(offerPrice) || offerPrice < 0) {
      toast.error('Please enter a valid offer price.'); return;
    }

    setData((prev) => {
      const updatedAttributes = prev.attributes.map((attrGroup) => {
        if (attrGroup.name === selectedAttributeTypeForOption) {
          if (attrGroup.options.some((opt) => opt.name.toLowerCase() === newOptionValue.trim().toLowerCase())) {
            toast.error(`Option "${newOptionValue.trim()}" already exists.`); return attrGroup;
          }
          return {
            ...attrGroup,
            options: [...attrGroup.options, {
              name: newOptionValue.trim(),
              originalPrice: Number(newOptionOriginalPrice),
              offerPrice: offerPrice,
              price: offerPrice, // Sync for compatibility
              stock: newOptionStock !== null ? Number(newOptionStock) : null,
              unit: "", // Removed unit
            }]
          };
        }
        return attrGroup;
      });
      return { ...prev, attributes: updatedAttributes };
    });

    setNewOptionValue(''); setNewOptionOriginalPrice(''); setNewOptionOfferPrice(''); setNewOptionStock(null); setSelectedAttributeTypeForOption('');
  };

  const handleEditAttributeOption = (groupName, option) => {
    setSelectedAttributeTypeForOption(groupName);
    setNewOptionValue(option.name);
    setEditingOptionOriginalName(option.name);
    setNewOptionOriginalPrice(option.originalPrice);
    setNewOptionOfferPrice(option.offerPrice);
    setNewOptionStock(option.stock);
    setIsEditingOption(true);
  };

  const handleUpdateAttributeOption = () => {
    if (!selectedAttributeTypeForOption) return;
    if (!newOptionValue.trim()) { toast.error('Value cannot be empty'); return; }

    const offerPrice = newOptionOfferPrice === '' ? Number(newOptionOriginalPrice) : Number(newOptionOfferPrice);

    setData(prev => ({
      ...prev,
      attributes: prev.attributes.map(attr => {
        if (attr.name === selectedAttributeTypeForOption) {
          return {
            ...attr,
            options: attr.options.map(opt => {
              if (opt.name === editingOptionOriginalName) {
                return {
                  ...opt,
                  name: newOptionValue.trim(),
                  originalPrice: Number(newOptionOriginalPrice),
                  offerPrice: offerPrice,
                  price: offerPrice,
                  stock: newOptionStock !== null ? Number(newOptionStock) : null,
                };
              }
              return opt;
            })
          };
        }
        return attr;
      })
    }));

    // Reset
    setNewOptionValue('');
    setNewOptionOriginalPrice('');
    setNewOptionOfferPrice('');
    setNewOptionStock(null);
    setSelectedAttributeTypeForOption('');
    setIsEditingOption(false);
    setEditingOptionOriginalName('');
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
    if (imageFileMap[data.storage_image]) {
      const { [data.storage_image]: removed, ...remainingMap } = imageFileMap;
      setImageFileMap(remainingMap);
      URL.revokeObjectURL(data.storage_image);
    }
    setData(prev => ({ ...prev, storage_image: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      if (!data.image.length) { toast.error('Please upload at least one image.'); setSubmitLoading(false); return; }
      if (data.image.length > 10) { toast.error('You can only upload a maximum of 10 images.'); setSubmitLoading(false); return; }
      if (!data.category) { toast.error('Please select a main category.'); setSubmitLoading(false); return; }
      if (!data.name.trim() || !data.description.trim()) { toast.error('Fill Name and Description.'); setSubmitLoading(false); return; }

      // Check product count for each selected subcategory
      for (const sub of data.subCategory) {
        const subDetails = allSubCategory.find(s => s._id === sub._id);
        if (subDetails && subDetails.productCount >= 50) {
          toast.error(`Subcategory "${subDetails.name}" is full. Maximum 50 products allowed.`);
          setSubmitLoading(false);
          return;
        }
      }

      // Check if price exists if trying to publish
      const hasPrice = data.attributes.some(attr => 
        attr.options && attr.options.some(opt => (opt.offerPrice > 0 || opt.originalPrice > 0))
      );

      if (data.publish && !hasPrice) {
        toast.error("Cannot publish a product without a price. Please add a pricing option first.");
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

      const response = await Axios({
        ...SummaryApi.createProduct,
        data: { 
          ...data, 
          image: imageUrls, 
          storage_image: storageImageUrl,
          category: data.category, 
          subCategory: data.subCategory.map(s => s._id) 
        },
      });

      if (response.data.success) {
        successAlert(response.data.message);
        Object.keys(imageFileMap).forEach(url => URL.revokeObjectURL(url));
        close();
        fetchData();
      }
    } catch (error) { AxiosToastError(error); } finally { setSubmitLoading(false); }
  };

  return (
    <div className='fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
      <div className='relative bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-zoom-in'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b bg-white'>
          <h3 className='text-lg font-bold text-gray-800'>Add New Product</h3>
          <button onClick={close} className='text-gray-400 hover:text-red-500 transition-colors'>
            <IoClose size={26} />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <div className='flex-1 overflow-y-auto p-6 bg-slate-50'>
          <form id="uploadProductForm" onSubmit={handleSubmit} className='space-y-6'>
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
                <div className='flex items-center justify-between'>
                  <label className='text-[15px] font-bold text-gray-700' htmlFor='altText'>SEO Alt Text</label>
                </div>
                <div className='relative'>
                  <input
                    type='text' id='altText' name='altText' value={data.altText} onChange={(e) => {
                      if (e.target.value.length <= 125) handleChange(e);
                    }}
                    placeholder='Describe images for SEO'
                    className='w-full bg-white px-4 py-2.5 pr-12 outline-none border border-gray-200 rounded-xl focus:border-indigo-500 transition-all font-medium'
                  />
                  <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold ${data.altText.length > 110 ? 'text-amber-500' : 'text-gray-400'}`}>
                    {data.altText.length}/125
                  </span>
                </div>
                <p className='text-[10px] text-gray-400 font-medium ml-1'>Recommended: Brief, descriptive, and under 125 characters.</p>
              </div>
            </div>

            <div className='flex flex-col gap-1.5'>
              <label className='text-[15px] font-bold text-gray-700' htmlFor='description'>Description</label>
              <textarea
                id='description' name='description' value={data.description} onChange={handleChange} required rows={6}
                placeholder='Enter product description'
                className='bg-white px-4 py-2.5 outline-none border border-gray-200 rounded-xl focus:border-indigo-500 transition-all font-medium resize-none'
              />
            </div>

            <div className='flex flex-col gap-1.5'>
                <label className='text-[15px] font-bold text-gray-700' htmlFor='demoVideoLink'>Demo Video Link (YouTube/Vimeo)</label>
                <input
                  type='text' id='demoVideoLink' name='demoVideoLink' value={data.demoVideoLink} onChange={handleChange}
                  placeholder='Paste video link here'
                  className='bg-white px-4 py-2.5 outline-none border border-gray-200 rounded-xl focus:border-indigo-500 transition-all font-medium'
                />
            </div>

            <div className='flex flex-wrap items-center gap-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm'>
                <div className='flex items-center gap-2'>
                  <input
                    type='checkbox' id='comboOffer' checked={data.comboOffer} onChange={(e) => setData(prev => ({ ...prev, comboOffer: e.target.checked }))}
                    className='w-5 h-5 text-[#279d68] border-gray-300 rounded-lg focus:ring-[#279d68] cursor-pointer'
                  />
                  <label htmlFor='comboOffer' className='text-sm font-bold text-slate-700 cursor-pointer uppercase tracking-tight'>Combo Offer</label>
                </div>

                <div className='flex items-center gap-2'>
                  <input
                    type='checkbox' id='megaCombo' checked={data.megaCombo} onChange={(e) => setData(prev => ({ ...prev, megaCombo: e.target.checked }))}
                    className='w-5 h-5 text-[#279d68] border-gray-300 rounded-lg focus:ring-[#279d68] cursor-pointer'
                  />
                  <label htmlFor='megaCombo' className='text-sm font-bold text-slate-700 cursor-pointer uppercase tracking-tight'>Mega Combo</label>
                </div>

                <div className='flex items-center gap-2'>
                  <input
                    type='checkbox' id='trending' checked={data.trending} onChange={handleTrendingToggle}
                    className='w-5 h-5 text-[#279d68] border-gray-300 rounded-lg focus:ring-[#279d68] cursor-pointer'
                  />
                  <label htmlFor='trending' className='text-sm font-bold text-slate-700 cursor-pointer uppercase tracking-tight'>Trending</label>
                </div>

                <div className='flex items-center gap-2 ml-auto'>
                  <input
                    type='checkbox' id='publish' checked={data.publish} onChange={(e) => setData(prev => ({ ...prev, publish: e.target.checked }))}
                    className='w-5 h-5 text-[#279d68] border-gray-300 rounded-lg focus:ring-[#279d68] cursor-pointer'
                  />
                  <label htmlFor='publish' className='text-sm font-bold text-slate-700 cursor-pointer uppercase tracking-tight'>Published</label>
                </div>
            </div>

            {/* Images */}
            <div className='space-y-3'>
              <label className='text-[15px] font-bold text-gray-700'>Product Images</label>
              <div className='flex flex-wrap items-center gap-4'>
                {data.image.map((img, index) => (
                  <div key={img + index} className='relative w-24 h-32 bg-white rounded-xl border border-gray-200 p-1 group shadow-sm'>
                     <img src={img} alt='product' className='w-full h-full object-cover rounded-lg' />
                     <button
                        type='button' onClick={() => handleDeleteImage(index)}
                        className='absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all z-10'
                     >
                       <IoClose size={14} />
                     </button>
                  </div>
                ))}
                {data.image.length < 10 && (
                  <label htmlFor='productImages' className='cursor-pointer group'>
                     <input type='file' id='productImages' className='hidden' accept='image/*' onChange={handleUploadImages} disabled={imageLoading} />
                     <img
                       className='w-24 h-32 object-cover rounded-xl border-2 border-dashed border-gray-300 group-hover:border-indigo-400 transition-all'
                       src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png"
                       alt="uploadArea"
                     />
                  </label>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
               <div className='space-y-2'>
                 <CategoryDropdown
                   label="Main Category"
                   placeholder="Select Category"
                   options={allCategory}
                   selectedOptions={selectedCategoryDetails ? [selectedCategoryDetails] : []}
                   onSelect={(cat) => {
                     setData(prev => ({ ...prev, category: cat._id, subCategory: [] }));
                     setSelectedCategoryDetails(cat);
                   }}
                 />
                 <div className='flex flex-wrap gap-2'>
                    {selectedCategoryDetails && (
                      <span className='bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 border border-indigo-100'>
                         {selectedCategoryDetails.name} <IoClose className='cursor-pointer hover:text-red-500' onClick={handleRemoveCategory} />
                      </span>
                    )}
                 </div>
               </div>

               <div className='space-y-2'>
                 <CategoryDropdown
                   label="Sub Category"
                   placeholder="Select Subcategories"
                   options={allSubCategory.filter(sub => 
                     sub.category && (Array.isArray(sub.category) 
                       ? sub.category.some(c => c === data.category || c._id === data.category)
                       : (sub.category === data.category || sub.category._id === data.category))
                   )}
                   selectedOptions={data.subCategory}
                   onSelect={(sub) => {
                     if (!data.subCategory.some(s => s._id === sub._id)) {
                       setData(prev => ({ ...prev, subCategory: [...prev.subCategory, sub] }));
                     }
                   }}
                 />
                 <div className='flex flex-wrap gap-2'>
                    {data.subCategory.map((s, i) => (
                      <span key={s._id + i} className='bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 border border-emerald-100'>
                         {s.name} <IoClose className='cursor-pointer hover:text-red-500' onClick={() => handleRemoveSubCategory(i)} />
                      </span>
                    ))}
                 </div>
               </div>
            </div>

            <hr className='border-gray-200' />

            {/* Custom Fields */}
            <div className='space-y-4'>
               <div className='flex items-center justify-between'>
                  <h4 className='text-[15px] font-bold text-gray-800'>Additional Specification</h4>
                  <button
                    type='button' onClick={() => setOpenAddField(true)}
                    className='text-indigo-600 hover:text-indigo-700 font-bold text-[13px] flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100'
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
                          onChange={(e) => setData(prev => ({ ...prev, more_details: { ...prev.more_details, [k]: e.target.value } }))}
                          className='flex-grow bg-slate-50 px-3 py-2 outline-none border border-gray-100 rounded-lg text-sm font-medium focus:border-indigo-400'
                        />
                        <button
                           type='button' onClick={() => setData(prev => { const d = {...prev.more_details}; delete d[k]; return {...prev, more_details: d}; })}
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

            {/* Storage Instructions */}
            <div className='space-y-4'>
               <h4 className='text-[15px] font-bold text-gray-800'>Storage & Quality Instructions</h4>
               <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                  <div className='flex flex-col gap-1.5'>
                    <label className='text-[13px] font-bold text-gray-500' htmlFor='storage_instructions'>Instructions</label>
                    <textarea
                      id='storage_instructions' name='storage_instructions' value={data.storage_instructions} onChange={handleChange} rows={4}
                      placeholder='Enter storage or quality instructions...'
                      className='bg-white px-4 py-2.5 outline-none border border-gray-200 rounded-xl focus:border-indigo-500 transition-all text-sm font-medium resize-none'
                    />
                  </div>
                  <div className='flex flex-col gap-1.5'>
                    <label className='text-[13px] font-bold text-gray-500'>Instruction Image (Max 5MB)</label>
                    {data.storage_image ? (
                       <div className='relative w-full h-32 bg-white rounded-xl border border-gray-200 p-1 group shadow-sm'>
                          <img src={data.storage_image} alt='storage' className='w-full h-full object-contain rounded-lg' />
                          <button
                             type='button' onClick={handleDeleteStorageImage}
                             className='absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all z-10'
                          >
                             <IoClose size={14} />
                          </button>
                       </div>
                    ) : (
                       <label htmlFor='storageImage' className='cursor-pointer group'>
                          <input type='file' id='storageImage' className='hidden' accept='image/*' onChange={handleUploadStorageImage} />
                          <div className='w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 group-hover:border-indigo-400 transition-all bg-white font-bold text-gray-400'>
                             <IoCloudUploadOutline size={24} className='group-hover:text-indigo-500' />
                             <span className='text-[11px] uppercase tracking-widest group-hover:text-indigo-500'>Upload Image</span>
                          </div>
                       </label>
                    )}
                  </div>
               </div>
            </div>

            <hr className='border-gray-200' />

            {/* Sizes/Options */}
            <div className='space-y-4'>
               <div className='flex items-center justify-between'>
                  <h4 className='text-[15px] font-bold text-gray-800'>Pricing Options (Size/Qty)</h4>
                  <button
                    type='button' onClick={() => setOpenAddAttribute(true)}
                    className='text-indigo-600 hover:text-indigo-700 font-bold text-[13px] flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100'
                  >
                    <IoAdd size={18} /> New Group
                  </button>
               </div>

               {data.attributes.map((attr) => (
                  <div key={attr.name} className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
                     <div className='bg-slate-50 px-5 py-3 flex items-center justify-between border-b border-gray-100'>
                        {editingGroupName === attr.name ? (
                          <div className='flex items-center gap-2 flex-grow mr-4'>
                            <input 
                              type='text' 
                              value={groupRenameValue} 
                              onChange={(e) => setGroupRenameValue(e.target.value)}
                              className='bg-white px-3 py-1 border border-indigo-300 rounded outline-none text-sm font-bold w-full focus:ring-1 focus:ring-indigo-400'
                              autoFocus
                            />
                            <button 
                              type='button' 
                              onClick={() => handleRenameGroupName(attr.name)}
                              className='bg-indigo-500 text-white px-3 py-1 rounded text-xs font-bold'
                            >
                              Save
                            </button>
                            <button 
                              type='button' 
                              onClick={() => { setEditingGroupName(null); setGroupRenameValue(''); }}
                              className='text-slate-400 text-xs font-bold'
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className='flex items-center gap-2'>
                            <span className='font-bold text-gray-800 text-[14px]'>{attr.name}</span>
                            <button 
                              type='button' 
                              onClick={() => { setEditingGroupName(attr.name); setGroupRenameValue(attr.name); }}
                              className='text-indigo-400 hover:text-indigo-600 p-1 rounded-lg transition-colors'
                              title="Edit Group Name"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </button>
                          </div>
                        )}
                        <button type='button' onClick={() => setData(prev => ({ ...prev, attributes: prev.attributes.filter(a => a.name !== attr.name) }))} className='text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg'><IoTrashOutline size={18} /></button>
                     </div>
                     <div className='p-4 space-y-4'>
                        <div className='flex flex-wrap gap-2'>
                           {attr.options.map((opt, ix) => (
                             <span 
                               key={ix} 
                               className='bg-indigo-50/50 text-indigo-700 px-3 py-1.5 rounded-xl text-[12px] font-bold border border-indigo-100/50 flex items-center gap-2 cursor-pointer hover:bg-indigo-100/50 transition-colors group'
                               onClick={() => handleEditAttributeOption(attr.name, opt)}
                               title="Click to edit"
                             >
                                {opt.name} · ₹{opt.offerPrice} {opt.originalPrice > opt.offerPrice && <span className='line-through text-slate-400 font-medium ml-1'>₹{opt.originalPrice}</span>}
                                <IoClose className='cursor-pointer text-slate-400 hover:text-rose-500' onClick={(e) => { e.stopPropagation(); setData(prev => ({ ...prev, attributes: prev.attributes.map(a => a.name === attr.name ? { ...a, options: a.options.filter((_, idx) => idx !== ix) } : a) })); }} />
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
                                 <button type='button' onClick={() => { setSelectedAttributeTypeForOption(""); setIsEditingOption(false); setEditingOptionOriginalName(''); setNewOptionValue(''); setNewOptionOriginalPrice(''); setNewOptionOfferPrice(''); setNewOptionStock(null); }} className='px-4 py-2 text-xs font-bold text-slate-500'>Cancel</button>
                                 <button type='button' onClick={isEditingOption ? handleUpdateAttributeOption : handleAddAttributeOption} className='px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all'>
                                   {isEditingOption ? 'Update Option' : 'Add Option'}
                                 </button>
                              </div>
                           </div>
                        ) : (
                           <button type='button' onClick={() => setSelectedAttributeTypeForOption(attr.name)} className='text-indigo-600 text-[13px] font-bold hover:underline tracking-tight'>+ Add Pricing Option</button>
                        )}
                     </div>
                  </div>
               ))}
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
            type='submit' form="uploadProductForm" disabled={submitLoading}
            className='px-10 py-2.5 bg-[#279d68] text-white text-sm font-bold rounded-xl shadow-lg shadow-green-100 hover:bg-[#279d68]/90 transition-all disabled:opacity-50 flex items-center gap-2'
          >
            {submitLoading ? <><div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' /> <span>Uploading...</span></> : "Create Product"}
          </button>
        </div>

        {/* Inner Modals (Add Field / Add Attribute) */}
        {openAddField && (
          <div className='fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm'>
            <div className='bg-white p-6 rounded-2xl w-full max-w-[320px] shadow-2xl animate-in fade-in zoom-in duration-200'>
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
            <div className='bg-white p-6 rounded-2xl w-full max-w-[320px] shadow-2xl animate-in fade-in zoom-in duration-200'>
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

        {/* Cropper Modal */}
        {openCrop && cropImageSrc && (
          <div className='fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm'>
            <div className='bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200'>
              <div className='flex items-center justify-between px-6 py-4 border-b bg-white'>
                <h3 className='text-lg font-bold text-gray-800'>Crop Product Image (1:1 Aspect Ratio)</h3>
                <button onClick={handleCropCancel} className='text-gray-400 hover:text-red-500 transition-colors'>
                  <IoClose size={24} />
                </button>
              </div>
              
              <div className='relative h-[400px] w-full bg-slate-900'>
                <Cropper
                  image={cropImageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              
              <div className='p-6 bg-gray-50 flex flex-col gap-4 border-t border-gray-100'>
                <div className='flex items-center gap-4'>
                  <span className='text-xs font-bold text-gray-400 uppercase tracking-wider'>Zoom</span>
                  <input
                    type='range'
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(e) => setZoom(e.target.value)}
                    className='flex-grow h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600'
                  />
                </div>
                <div className='flex gap-3'>
                  <button onClick={handleCropCancel} className='flex-1 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-white border border-gray-200 hover:bg-slate-50 transition-all'>
                    Cancel
                  </button>
                  <button onClick={handleCropSave} className='flex-[2] py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all'>
                    Crop & Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UploadProductModel;
