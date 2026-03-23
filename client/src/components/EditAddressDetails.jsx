import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { toast } from 'sonner';
import AxiosToastError from '../utils/AxiosToastError';
import { useGlobalContext } from '../provider/GlobalProvider';
import { FiX, FiCheck, FiSave } from "react-icons/fi";

const EditAddressDetails = ({ close, data }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      _id: data._id,
      userId: data.userId,
      address_line: data.address_line,
      city: data.city,
      state: data.state,
      country: data.country,
      pincode: data.pincode,
      mobile: data.mobile
    }
  });

  const { fetchAddress } = useGlobalContext();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.updateAddress,
        data: formData
      });

      if (response.data.success) {
        toast.success(response.data.message);
        close();
        reset();
        fetchAddress();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] overflow-y-auto custom-scrollbar'>
      <div className='bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200'>
        {/* Header */}
        <div className='px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30'>
          <div>
            <h2 className='font-bold text-xl text-gray-800 tracking-tight'>Edit Address</h2>
            <p className='text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5'>Update your location details</p>
          </div>
          <button onClick={close} className='p-2 hover:bg-rose-50 hover:text-rose-500 text-gray-400 rounded-full transition-all'>
            <FiX size={20} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)} className='p-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            {[ 
              { id: 'address_line', label: 'Address Line', colSpan: 'md:col-span-2' },
              { id: 'city', label: 'City' },
              { id: 'state', label: 'State' },
              { id: 'pincode', label: 'Pincode' },
              { id: 'country', label: 'Country' },
              { id: 'mobile', label: 'Mobile No.', colSpan: 'md:col-span-2' }
            ].map(({ id, label, colSpan }) => (
              <div key={id} className={`${colSpan || ''} space-y-1.1`}>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}</label>
                <input
                  {...register(id, { required: `${label} is required` })}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-2xl text-sm font-medium outline-none transition-all focus:bg-white focus:ring-4 ${
                    errors[id] ? "border-rose-200 focus:ring-rose-50 focus:border-rose-500" : "border-gray-100 focus:ring-indigo-50 focus:border-indigo-500"
                  }`}
                />
                {errors[id] && (
                  <p className="text-[10px] text-rose-500 font-bold mt-1 ml-1">{errors[id].message}</p>
                )}
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-50">
            <button
              type="button"
              onClick={close}
              className="flex-1 px-6 py-3.5 text-sm font-bold text-gray-400 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <FiSave size={18} />
                  <span>Update Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditAddressDetails;

