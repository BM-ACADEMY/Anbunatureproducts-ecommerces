import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { AiOutlineCamera } from "react-icons/ai"; // Import the camera icon
import uploadImage from '../utils/UploadImage';
import { useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Paper,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Image Preview styled component
const ImagePreview = styled(Paper)(({ theme }) => ({
  width: '100%',
  height: 144,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[100],
  overflow: 'hidden',
  [theme.breakpoints.up('lg')]: {
    width: 144,
  },
}));

// Image Modal component
const ImageModal = ({ open, image, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 16, right: 16, color: 'white' }}
        >
          <IoClose size={24} />
        </IconButton>
        <img
          src={image}
          alt="Full view"
          style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }}
        />
      </DialogContent>
    </Dialog>
  );
};

const EditSubCategory = ({ close, data, fetchData }) => {
  const [subCategoryData, setSubCategoryData] = useState({
    _id: data._id,
    name: data.name,
    image: data.image,
    category: data.category || [],
  });
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const allCategory = useSelector((state) => state.product.allCategory);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubCategoryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadSubCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const response = await uploadImage(file);
    const { data: ImageResponse } = response;
    setSubCategoryData((prev) => ({
      ...prev,
      image: ImageResponse.data.url,
    }));
  };

  const handleRemoveCategorySelected = (categoryId) => {
    const updatedCategories = subCategoryData.category.filter((el) => el._id !== categoryId);
    setSubCategoryData((prev) => ({
      ...prev,
      category: updatedCategories,
    }));
  };

  const handleSubmitSubCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.updateSubCategory,
        data: subCategoryData,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        if (close) close();
        if (fetchData) fetchData();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <>
      <Dialog open onClose={close} fullWidth maxWidth="sm" sx={{ p: 2 }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">Edit Sub Category</Typography>
          <IconButton onClick={close}>
            <IoClose size={24} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmitSubCategory} sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Name Input */}
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={subCategoryData.name}
              onChange={handleChange}
              variant="outlined"
            />

            {/* Image Upload Section */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>Image</Typography>
              <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} alignItems="center">
                <ImagePreview elevation={1} onClick={() => setIsImageModalOpen(true)}>
                  {subCategoryData.image ? (
                    <img
                      alt="subCategory"
                      src={subCategoryData.image}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">No Image</Typography>
                  )}
                </ImagePreview>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{ textTransform: 'none' }}
                  startIcon={<AiOutlineCamera />}  // Add the camera icon to the button
                >
                  Upload Image
                  <input
                    type="file"
                    hidden
                    onChange={handleUploadSubCategoryImage}
                  />
                </Button>
              </Stack>
            </Box>

            {/* Category Selection */}
            <Box>
              <FormControl fullWidth>
                <InputLabel>Select Category</InputLabel>
                <Select
                  value=""
                  onChange={(e) => {
                    const value = e.target.value;
                    const categoryDetails = allCategory.find((el) => el._id === value);
                    if (categoryDetails && !subCategoryData.category.some(cat => cat._id === categoryDetails._id)) {
                      setSubCategoryData((prev) => ({
                        ...prev,
                        category: [...prev.category, categoryDetails],
                      }));
                    }
                  }}
                  label="Select Category"
                >
                  <MenuItem value="">Select Category</MenuItem>
                  {allCategory.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Selected Categories */}
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {subCategoryData.category.map((cat) => (
                  <Chip
                    key={cat._id}
                    label={cat.name}
                    onDelete={() => handleRemoveCategorySelected(cat._id)}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            </Box>

            {/* Action Buttons (Cancel and Submit) */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button
                color='error'
                sx={{ textTransform: 'none' }}
                onClick={close}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="success"
                disabled={!subCategoryData.name || !subCategoryData.image || !subCategoryData.category.length}
                sx={{ textTransform: 'none' }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Image Modal */}
      <ImageModal
        open={isImageModalOpen}
        image={subCategoryData.image}
        onClose={() => setIsImageModalOpen(false)}
      />
    </>
  );
};

export default EditSubCategory;
