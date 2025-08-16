import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { AiOutlineCamera } from "react-icons/ai"; 


import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  Box,
  Typography,
  Stack,
  Avatar
} from '@mui/material';

import uploadImage from '../utils/UploadImage';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';

const EditCategory = ({ close, fetchData, data: CategoryData }) => {
  const [data, setData] = useState({
    _id: CategoryData._id,
    name: CategoryData.name,
    image: CategoryData.image
  });
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.updateCategory,
        data: data
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
    setData((prev) => ({ ...prev, image: ImageResponse.data.url }));
  };

  return (
    <>
      {/* Main Edit Dialog */}
      <Dialog open={true} onClose={close} fullWidth maxWidth="xs">
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Edit Category</Typography>
            <IconButton onClick={close}>
              <IoClose size={24} />
            </IconButton>
          </Box>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Stack spacing={3}>
              {/* Category Name */}
              <TextField
                label="Category Name"
                name="name"
                value={data.name}
                onChange={handleOnChange}
                fullWidth
                required
              />

              {/* Category Image */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Category Image
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                  <Avatar
                    variant="rounded"
                    src={data.image}
                    alt="Category"
                    sx={{
                      width: 100,
                      height: 100,
                      bgcolor: 'grey.100',
                      cursor: data.image ? 'pointer' : 'default'
                    }}
                    onClick={() => data.image && setPreviewOpen(true)}
                  >
                    {!data.image && (
                      <Typography variant="caption">No Image</Typography>
                    )}
                  </Avatar>

                  <Button
                    variant="outlined"
                    component="label"
                    disabled={!data.name || loading}
                    startIcon={<AiOutlineCamera />}
                  >
                    {loading ? <CircularProgress size={20} /> : 'Change Image'}
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={handleUploadCategoryImage}
                    />
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2 }}>
  <Button
    onClick={close}
    disabled={loading}
    sx={{ color: 'red' }}
  >
    Cancel
  </Button>
  <Button
    type="submit"
    color='success'
    disabled={!data.name || !data.image || loading}
  >
    {loading ? <CircularProgress size={24} sx={{ color: 'green' }} /> : 'Update'}
  </Button>
</DialogActions>

        </form>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1">Image Preview</Typography>
            <IconButton onClick={() => setPreviewOpen(false)}>
              <IoClose size={24} />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box
            component="img"
            src={data.image}
            alt="Preview"
            sx={{ width: '100%', height: 'auto', borderRadius: 2 }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditCategory;
