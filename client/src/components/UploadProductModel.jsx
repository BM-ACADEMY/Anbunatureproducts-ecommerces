import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IoClose, IoAdd, IoTrashOutline, IoStar, IoStarOutline } from "react-icons/io5";
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';
import { toast } from 'sonner';

const UploadProductModel = ({ close, fetchData }) => {
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
    altText: ''
  });

  const [imageFileMap, setImageFileMap] = useState({}); // Maps previewUrl to File object
  const [imageLoading, setImageLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const allCategory = useSelector((state) => state.product.allCategory || []);
  const allSubCategory = useSelector((state) => state.product.allSubCategory || []);
  const [selectCategory, setSelectCategory] = useState('');
  const [selectSubCategory, setSelectSubCategory] = useState('');

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
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleComboOfferToggle = (e) => {
    setData((prev) => ({ ...prev, comboOffer: e.target.checked }));
  };

  const handleUploadImages = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const MAX_SIZE = 2 * 1024 * 1024;
    const invalidFiles = Array.from(files).filter(file => file.size > MAX_SIZE);

    if (invalidFiles.length > 0) {
      toast.error(`Some images exceed the 2MB limit: ${invalidFiles.map(f => f.name).join(', ')}`);
      return;
    }

    const newImageData = {};
    Array.from(files).forEach(file => {
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

  const handleAddAttributeOption = () => {
    if (!selectedAttributeTypeForOption) { toast.error('Please select an attribute type.'); return; }
    if (!newOptionValue.trim()) { toast.error('Attribute option value cannot be empty.'); return; }
    if (newOptionPrice === '' || isNaN(Number(newOptionPrice)) || Number(newOptionPrice) < 0) {
      toast.error('Please enter a valid price.'); return;
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
              price: Number(newOptionPrice),
              stock: newOptionStock !== null ? Number(newOptionStock) : null,
              unit: newOptionUnit.trim(),
            }]
          };
        }
        return attrGroup;
      });
      return { ...prev, attributes: updatedAttributes };
    });

    setNewOptionValue(''); setNewOptionPrice(''); setNewOptionStock(null); setNewOptionUnit(''); setSelectedAttributeTypeForOption('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      if (data.image.length === 0) { toast.error('Please upload at least one image.'); setSubmitLoading(false); return; }
      if (data.category.length === 0) { toast.error('Please select at least one category.'); setSubmitLoading(false); return; }
      if (!data.name.trim() || !data.description.trim()) { toast.error('Fill Name and Description.'); setSubmitLoading(false); return; }

      const imageUrls = await Promise.all(
        data.image.map(async (url) => {
          if (imageFileMap[url]) {
            const uploadResponse = await uploadImage(imageFileMap[url], 'product');
            return uploadResponse.data.data.url;
          }
          return url;
        })
      );

      const response = await Axios({
        ...SummaryApi.createProduct,
        data: { ...data, image: imageUrls, category: data.category.map(c => c._id), subCategory: data.subCategory.map(s => s._id) },
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
      <div className='relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-zoom-in'>
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
              <input
                type='checkbox' id='comboOffer' checked={data.comboOffer} onChange={handleComboOfferToggle}
                className='w-5 h-5 cursor-pointer accent-indigo-600'
              />
              <label htmlFor='comboOffer' className='text-[15px] font-bold text-gray-700 cursor-pointer'>Enable Combo Offer</label>
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
                     <input type='file' id='productImages' className='hidden' accept='image/*' multiple onChange={handleUploadImages} disabled={imageLoading} />
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
              <div className='space-y-1.5'>
                <label className='text-[15px] font-bold text-gray-700'>Main Category</label>
                <select
                  className='w-full bg-white px-4 py-2.5 outline-none border border-gray-200 rounded-xl focus:border-indigo-500 transition-all font-medium cursor-pointer'
                  value={selectCategory}
                  onChange={(e) => {
                    const val = e.target.value;
                    const cat = allCategory.find(el => el._id === val);
                    if (cat && !data.category.some(c => c._id === cat._id)) {
                      setData(prev => ({ ...prev, category: [...prev.category, cat] }));
                      setSelectCategory("");
                    }
                  }}
                >
                  <option value="">Select Categories</option>
                  {allCategory.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                <div className='flex flex-wrap gap-2 pt-1'>
                  {data.category.map((c, i) => (
                    <span key={c._id + i} className='bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 border border-indigo-100'>
                       {c.name} <IoClose className='cursor-pointer' onClick={() => handleRemoveCategory(i)} />
                    </span>
                  ))}
                </div>
              </div>

              <div className='space-y-1.5'>
                <label className='text-[15px] font-bold text-gray-700'>Sub Category</label>
                <select
                  className='w-full bg-white px-4 py-2.5 outline-none border border-gray-200 rounded-xl focus:border-indigo-500 transition-all font-medium cursor-pointer'
                  value={selectSubCategory}
                  onChange={(e) => {
                    const val = e.target.value;
                    const sub = allSubCategory.find(el => el._id === val);
                    if (sub && !data.subCategory.some(s => s._id === sub._id)) {
                      setData(prev => ({ ...prev, subCategory: [...prev.subCategory, sub] }));
                      setSelectSubCategory("");
                    }
                  }}
                >
                  <option value="">Select Subcategories</option>
                  {allSubCategory.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
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

            {/* Custom Fields */}
            <div className='space-y-4'>
               <div className='flex items-center justify-between'>
                  <h4 className='text-[15px] font-bold text-gray-800'>Additional Specs</h4>
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
                        <span className='font-bold text-gray-800 text-[14px]'>{attr.name}</span>
                        <button type='button' onClick={() => setData(prev => ({ ...prev, attributes: prev.attributes.filter(a => a.name !== attr.name) }))} className='text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg'><IoTrashOutline size={18} /></button>
                     </div>
                     <div className='p-4 space-y-4'>
                        <div className='flex flex-wrap gap-2'>
                           {attr.options.map((opt, ix) => (
                             <span key={ix} className='bg-indigo-50/50 text-indigo-700 px-3 py-1.5 rounded-xl text-[12px] font-bold border border-indigo-100/50 flex items-center gap-2'>
                                {opt.name} · ₹{opt.price} {opt.unit && `· ${opt.unit}`}
                                <IoClose className='cursor-pointer hover:text-rose-500' onClick={() => setData(prev => ({ ...prev, attributes: prev.attributes.map(a => a.name === attr.name ? { ...a, options: a.options.filter((_, idx) => idx !== ix) } : a) }))} />
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
                                <label className='text-[11px] font-bold text-slate-400 tracking-wider uppercase'>Price</label>
                                <input type='number' placeholder='0' value={newOptionPrice} onChange={e => setNewOptionPrice(e.target.value)} className='w-full px-3 py-2 rounded-xl border border-gray-200 text-sm' />
                              </div>
                              <div className='space-y-1.5'>
                                <label className='text-[11px] font-bold text-slate-400 tracking-wider uppercase'>Stock</label>
                                <input type='number' placeholder='∞' value={newOptionStock || ""} onChange={e => setNewOptionStock(e.target.value === "" ? null : Number(e.target.value))} className='w-full px-3 py-2 rounded-xl border border-gray-200 text-sm' />
                              </div>
                              <div className='space-y-1.5'>
                                <label className='text-[11px] font-bold text-slate-400 tracking-wider uppercase'>Unit</label>
                                <input type='text' placeholder='e.g. g' value={newOptionUnit} onChange={e => setNewOptionUnit(e.target.value)} className='w-full px-3 py-2 rounded-xl border border-gray-200 text-sm' />
                              </div>
                              <div className='col-span-2 md:col-span-4 flex justify-end gap-2 pt-2'>
                                 <button type='button' onClick={() => setSelectedAttributeTypeForOption("")} className='px-4 py-2 text-xs font-bold text-slate-500'>Cancel</button>
                                 <button type='button' onClick={handleAddAttributeOption} className='px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all'>Add Option</button>
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
            className='px-10 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2'
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
                 className='w-full bg-slate-50 px-4 py-3 outline-none border border-slate-100 rounded-xl mb-6 text-sm font-bold focus:border-indigo-400'
               />
               <div className='flex gap-3'>
                 <button onClick={() => setOpenAddField(false)} className='flex-1 py-2.5 text-xs font-bold text-slate-500'>Cancel</button>
                 <button onClick={handleAddMoreDetailField} className='flex-1 py-2.5 text-xs font-bold text-white bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100'>Add</button>
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
                 className='w-full bg-slate-50 px-4 py-3 outline-none border border-slate-100 rounded-xl mb-6 text-sm font-bold focus:border-indigo-400'
               />
               <div className='flex gap-3'>
                 <button onClick={() => { setOpenAddAttribute(false); setNewAttributeTypeName(''); }} className='flex-1 py-2.5 text-xs font-bold text-slate-500'>Cancel</button>
                 <button onClick={handleAddAttributeType} className='flex-1 py-2.5 text-xs font-bold text-white bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100'>Add</button>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadProductModel;
