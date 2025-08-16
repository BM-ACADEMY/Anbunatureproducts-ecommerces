import React, { useState } from 'react';
import { FaRegUserCircle, FaUpload } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { updatedAvatar } from '../store/userSlice';
import { IoClose } from "react-icons/io5";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

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

      // Wait for 1 second before closing the modal
      setTimeout(() => {
        close();
      }, 1000); // 1000ms = 1 second
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={close} 
      fullWidth 
      maxWidth="sm"  // Limit the width of the modal
      PaperProps={{
        style: {
          margin: 'auto', // Centers the modal on the screen
        },
      }}
    >
      <DialogTitle style={{ position: 'relative' }}>
        Add Profile Picture    
        <Button 
          className='hover:bg-red-500  rounded-full'
          onClick={close}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            minWidth: 'auto',
            padding: '0',
            color: '#000'
          }}
        >
          <IoClose size={20} className='hover:text-white' />
        </Button>
      </DialogTitle>
      <DialogContent className="flex flex-col items-center justify-center">
        <div className='w-20 h-20 bg-gray-200 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm'>
          {user.avatar ? (
            <img alt={user.name} src={user.avatar} className='w-full h-full' />
          ) : (
            <FaRegUserCircle size={65} />
          )}
        </div>
        <form onSubmit={handleSubmit} className="mt-4">
          <label htmlFor='uploadProfile'>
            <div className='border border-primary-200 cursor-pointer hover:bg-primary-200 px-4 py-2 flex items-center justify-center rounded text-sm my-3'>
              {loading ? <span>Loading...</span> : <><FaUpload size={18} className="mr-2" /> Upload</>}
            </div>
            <input 
              onChange={handleUploadAvatarImage} 
              type='file' 
              id='uploadProfile' 
              className='hidden' 
            />
          </label>
        </form>
      </DialogContent>
      <DialogActions>
        {/* You can remove or customize the button if needed */}
      </DialogActions>
    </Dialog>
  );
};

export default UserProfileAvatarEdit;
