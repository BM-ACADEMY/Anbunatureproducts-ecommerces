import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
  Stack,
  Avatar,
  CircularProgress,
  Grid
} from '@mui/material';
import { AiOutlineCamera } from "react-icons/ai"; 
import ImageIcon from '@mui/icons-material/Image'; // Importing icon for "No Image"

import uploadImage from '../utils/UploadImage';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';

const UploadCategoryModel = ({ close, fetchData }) => {
  const [data, setData] = useState({
    name: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false); // State to control image modal visibility

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.addCategory,
        data
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

    setLoading(true);
    const response = await uploadImage(file);
    const { data: ImageResponse } = response;
    setLoading(false);
    setData((prev) => ({
      ...prev,
      image: ImageResponse.data.url
    }));
  };

  const handleImageClick = () => {
    setOpenImageModal(true); // Open the image modal when the avatar is clicked
  };

  const handleCloseImageModal = () => {
    setOpenImageModal(false); // Close the image modal
  };

  return (
    <>
      {/* Main Upload Category Modal */}
      <Dialog open={true} onClose={close} fullWidth maxWidth="xs">
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Add Category</Typography>
            <IconButton onClick={close}>
              <IoClose size={24} />
            </IconButton>
          </Box>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Stack spacing={3}>
              {/* Category Name Input */}
              <TextField
                label="Category Name"
                name="name"
                value={data.name}
                onChange={handleOnChange}
                fullWidth
                required
              />

              {/* Image Upload */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Category Image
                </Typography>
                <Grid container spacing={2} alignItems="center" direction={{ xs: 'column', sm: 'row' }}>
                  {/* Image Avatar */}
                  <Grid item>
                    <Avatar
                      variant="rounded"
                      src={data.image}
                      sx={{
                        width: 100,
                        height: 100,
                        bgcolor: 'grey.100',
                        border: '1px solid #ccc',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer', // Make the avatar clickable
                      }}
                      onClick={handleImageClick} // Trigger the image modal on click
                    >
                      {!data.image ? (
                        <>
                          <ImageIcon sx={{ color: 'grey', fontSize: 40 }} />
                          <Typography variant="caption" sx={{ color: 'black', marginTop: 1 }}>
                            No Image
                          </Typography>
                        </>
                      ) : null}
                    </Avatar>
                  </Grid>

                  {/* Upload Image Button */}
                  <Grid item>
                    <Button
                      variant="outlined"
                      component="label"
                      disabled={!data.name || loading}
                      startIcon={<AiOutlineCamera />}
                    >
                      {loading ? <CircularProgress size={20} /> : 'Upload Image'}
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={handleUploadCategoryImage}
                      />
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={close} disabled={loading} sx={{ color: 'red' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              color="success"
              disabled={!data.name || !data.image || loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Category'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Image Modal */}
      <Dialog open={openImageModal} onClose={handleCloseImageModal} maxWidth="md">
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Category Image</Typography>
            <IconButton onClick={handleCloseImageModal}>
              <IoClose size={24} />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center">
            <img
              src={data.image}
              alt="Category"
              style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UploadCategoryModel;
