import React, { useState, useCallback } from 'react';
import { FaRegUserCircle, FaUpload, FaCheck, FaUndo } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { updatedAvatar } from '../store/userSlice';
import { IoClose } from "react-icons/io5";
import Cropper from 'react-easy-crop';
import { getCroppedImgBlob } from '../utils/cropImage';
import { toast } from 'sonner';

const UserProfileAvatarEdit = ({ open, close }) => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageSrc(reader.result));
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAvatarImage = async () => {
    try {
      setLoading(true);
      const croppedImage = await getCroppedImgBlob(imageSrc, croppedAreaPixels);
      
      const formData = new FormData();
      formData.append('avatar', croppedImage, 'avatar.jpg');

      const response = await Axios({
        ...SummaryApi.uploadAvatar,
        data: formData,
      });
      
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success("Avatar updated successfully!");
        dispatch(updatedAvatar(responseData.data.avatar));
        setTimeout(() => {
          close();
        }, 500);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={close} 
      />
      
      {/* Modal content */}
      <div className={`relative bg-white rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col transition-all ${imageSrc ? 'w-full max-w-xl' : 'w-full max-w-sm'}`}>
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-lg font-bold text-gray-800">Edit Profile Picture</h2>
          <button 
            onClick={close}
            className="p-2 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-full transition-all"
          >
            <IoClose size={20} />
          </button>
        </div>

        <div className="flex-grow flex flex-col justify-center overflow-hidden">
          {imageSrc ? (
            <div className="relative h-[400px] bg-slate-900">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
          ) : (
            <div className="p-8 flex flex-col items-center">
              <div className='w-24 h-24 bg-gray-100 flex items-center justify-center rounded-full overflow-hidden border-2 border-white shadow-sm'>
                {user.avatar ? (
                  <img alt={user.name} src={user.avatar} className='w-full h-full object-cover' />
                ) : (
                  <FaRegUserCircle size={48} className="text-gray-300" />
                )}
              </div>
              <div className="mt-8 w-full">
                <label htmlFor='uploadProfile' className="block w-full">
                  <div className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all shadow-sm active:scale-[0.98] cursor-pointer bg-blue-600 text-white hover:bg-blue-700">
                    <FaUpload size={14} />
                    Select Image
                  </div>
                  <input 
                    onChange={handleFileChange} 
                    type='file' 
                    id='uploadProfile' 
                    accept="image/*"
                    className='hidden' 
                    disabled={loading}
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {imageSrc && (
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Zoom</span>
                    <input
                      type="range"
                      value={zoom}
                      min={1}
                      max={3}
                      step={0.1}
                      aria-labelledby="Zoom"
                      onChange={(e) => setZoom(e.target.value)}
                      className="flex-grow h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setImageSrc(null)}
                        className="flex-1 px-4 py-2.5 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm"
                    >
                        <FaUndo size={12} />
                        Cancel
                    </button>
                    <button
                        onClick={handleUploadAvatarImage}
                        disabled={loading}
                        className="flex-[2] px-4 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                    >
                        {loading && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                        {loading ? 'Uploading...' : 'Save Avatar'}
                    </button>
                </div>
            </div>
        )}

        {!imageSrc && (
            <div className="px-6 pb-6 text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    MAX 2MB
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileAvatarEdit;

