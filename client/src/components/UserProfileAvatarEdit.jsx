import React, { useState } from 'react';
import { FaRegUserCircle, FaUpload } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { updatedAvatar } from '../store/userSlice';
import { IoClose } from "react-icons/io5";

const UserProfileAvatarEdit = ({ open, close }) => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleUploadAvatarImage = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.uploadAvatar,
        data: formData,
      });
      const { data: responseData } = response;
      dispatch(updatedAvatar(responseData.data.avatar));

      setTimeout(() => {
        close();
      }, 1000); 
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-200" 
        onClick={close} 
      />
      
      {/* Modal content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
          <h2 className="text-lg font-black text-gray-900 tracking-tight">Profile Picture</h2>
          <button 
            onClick={close}
            className="p-2 hover:bg-rose-50 hover:text-rose-500 text-gray-400 rounded-full transition-all"
          >
            <IoClose size={22} />
          </button>
        </div>

        <div className="p-8 flex flex-col items-center">
            <div className="relative group">
                <div className='w-24 h-24 bg-indigo-50 flex items-center justify-center rounded-3xl overflow-hidden shadow-lg border-2 border-white ring-4 ring-indigo-50/50 transition-transform duration-300 group-hover:scale-105'>
                  {user.avatar ? (
                    <img alt={user.name} src={user.avatar} className='w-full h-full object-cover' />
                  ) : (
                    <FaRegUserCircle size={48} className="text-indigo-200" />
                  )}
                </div>
                {loading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-3xl">
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="mt-8 w-full">
              <label htmlFor='uploadProfile' className="block w-full">
                <div className={`w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl font-black text-sm transition-all shadow-lg active:scale-[0.98] cursor-pointer ${
                    loading 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                }`}>
                  {loading ? (
                      <span>Processing...</span>
                  ) : (
                      <>
                        <FaUpload size={16} />
                        Update Avatar
                      </>
                  )}
                </div>
                <input 
                  onChange={handleUploadAvatarImage} 
                  type='file' 
                  id='uploadProfile' 
                  className='hidden' 
                  disabled={loading}
                />
              </label>
            </form>
            
            <p className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                Supported: JPG, PNG, WEBP (Max 2MB)
            </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileAvatarEdit;

