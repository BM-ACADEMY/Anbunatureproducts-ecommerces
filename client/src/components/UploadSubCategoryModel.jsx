import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { AiOutlineCamera } from "react-icons/ai"; // Import camera icon
import uploadImage from '../utils/UploadImage';
import { useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Button,
  Typography,
  Box,
  Chip,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
  CircularProgress
} from '@mui/material';

const UploadSubCategoryModel = ({ close, fetchData }) => {
  const [subCategoryData, setSubCategoryData] = useState({
    name: "",
    image: "",
    category: [],
  });
  
  const [loading, setLoading] = useState(false);  // Add loading state
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

    setLoading(true); // Set loading before image upload
    try {
      const response = await uploadImage(file);
      const { data: ImageResponse } = response;
      setSubCategoryData((prev) => ({
        ...prev,
        image: ImageResponse.data.url,
      }));
    } catch (error) {
      toast.error("Error uploading image");
    } finally {
      setLoading(false); // Reset loading after image upload
    }
  };

  const handleRemoveCategorySelected = (categoryId) => {
    setSubCategoryData((prev) => ({
      ...prev,
      category: prev.category.filter((el) => el._id !== categoryId),
    }));
  };

  const handleSubmitSubCategory = async (e) => {
    e.preventDefault();
    setLoading(true);  // Set loading while submitting the form
    try {
      const response = await Axios({
        ...SummaryApi.createSubCategory,
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
      toast.error("Error creating subcategory");
    } finally {
      setLoading(false);  // Reset loading after submission
    }
  };

  return (
    <Dialog open onClose={close} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Add Sub Category</Typography>
        <IconButton onClick={close}>
          <IoClose size={25} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmitSubCategory} sx={{ display: 'grid', gap: 3, pt: 2 }}>
          {/* Name Input */}
          <TextField
            label="Name"
            name="name"
            value={subCategoryData.name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />
          {/* Image Upload Section */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>Image</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 144,
                  height: 144,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'grey.100',
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                {subCategoryData.image ? (
                  <img
                    src={subCategoryData.image}
                    alt="subCategory"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">No Image</Typography>
                )}
              </Box>
              <Button
                variant="outlined"
                component="label"
                sx={{ textTransform: 'none' }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={20} />
                ) : (
                  <>
                    <AiOutlineCamera size={20} style={{ marginRight: 8 }} />
                    Upload Image
                  </>
                )}
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
              <InputLabel id="category-select-label">Select Category</InputLabel>
              <Select
                labelId="category-select-label"
                label="Select Category"
                onChange={(e) => {
                  const value = e.target.value;
                  const categoryDetails = allCategory.find((el) => el._id === value);
                  if (categoryDetails && !subCategoryData.category.some((cat) => cat._id === value)) {
                    setSubCategoryData((prev) => ({
                      ...prev,
                      category: [...prev.category, categoryDetails],
                    }));
                  }
                }}
                value="" // Reset to empty string to allow re-selection
              >
                <MenuItem value="" disabled>Select Category</MenuItem>
                {allCategory.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
          {/* Cancel and Submit Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <Button
              onClick={close}
              color='error'
              sx={{ textTransform: 'none', mr: 2 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color='success'
              disabled={!subCategoryData.name || !subCategoryData.image || !subCategoryData.category.length}
              sx={{ textTransform: 'none' }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UploadSubCategoryModel;
