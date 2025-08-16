// EditProductAdmin.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Rating,
  CircularProgress,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from './ViewImage';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';

const predefinedAttributeNames = ['Size', 'Weight', 'Material', 'Memory', 'Storage', 'Processor', 'Color', 'Capacity'];

const EditProductAdmin = ({ close, data: propsData, fetchProductData }) => {
  const [data, setData] = useState({
    _id: propsData._id || '',
    name: propsData.name || '',
    image: propsData.image || [],
    category: propsData.category || [],
    subCategory: propsData.subCategory || [],
    description: propsData.description || '',
    more_details: propsData.more_details || {},
    attributes: propsData.attributes || [],
    reviews: propsData.reviews || [],
    comboOffer: propsData.comboOffer || false,
  });

  const [imageLoading, setImageLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [viewImageURL, setViewImageURL] = useState('');
  const allCategory = useSelector((state) => state.product.allCategory || []);
  const allSubCategory = useSelector((state) => state.product.allSubCategory || []);
  const [selectCategory, setSelectCategory] = useState('');
  const [selectSubCategory, setSelectSubCategory] = useState('');

  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState('');

  const [openAddAttribute, setOpenAddAttribute] = useState(false);
  const [newAttributeTypeName, setNewAttributeTypeName] = useState('');
  const [attributeNameInputType, setAttributeNameInputType] = useState('select');

  const [selectedAttributeTypeForOption, setSelectedAttributeTypeForOption] = useState('');
  const [newOptionValue, setNewOptionValue] = useState('');
  const [newOptionPrice, setNewOptionPrice] = useState('');
  const [newOptionStock, setNewOptionStock] = useState(null);
  const [newOptionUnit, setNewOptionUnit] = useState('');

  const [openAddReview, setOpenAddReview] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    console.log('Current product data in state:', data);
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleComboOfferToggle = (event) => {
    setData((prev) => ({
      ...prev,
      comboOffer: event.target.checked,
    }));
  };

  const handleUploadImages = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setImageLoading(true);
    try {
      const uploadPromises = Array.from(files).map((file) => uploadImage(file));
      const responses = await Promise.all(uploadPromises);
      const newImageUrls = responses
        .filter((response) => response?.data?.data?.url)
        .map((response) => response.data.data.url);
      setData((prev) => ({ ...prev, image: [...prev.image, ...newImageUrls] }));
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setImageLoading(false);
    }
  };

  const handleDeleteImage = (index) => {
    setData((prev) => ({ ...prev, image: prev.image.filter((_, i) => i !== index) }));
  };

  const handleRemoveCategory = (index) => {
    setData((prev) => ({ ...prev, category: prev.category.filter((_, i) => i !== index) }));
  };

  const handleRemoveSubCategory = (index) => {
    setData((prev) => ({ ...prev, subCategory: prev.subCategory.filter((_, i) => i !== index) }));
  };

  const handleAddMoreDetailField = () => {
    if (!fieldName.trim()) {
      alert('Field name cannot be empty.');
      return;
    }
    setData((prev) => ({ ...prev, more_details: { ...prev.more_details, [fieldName]: '' } }));
    setFieldName('');
    setOpenAddField(false);
  };

  const handleMoreDetailsChange = (key, value) => {
    setData((prev) => ({ ...prev, more_details: { ...prev.more_details, [key]: value } }));
  };

  const handleAddAttributeType = () => {
    if (!newAttributeTypeName.trim()) {
      alert('Attribute type name cannot be empty.');
      return;
    }
    if (data.attributes.some((attr) => attr.name.toLowerCase() === newAttributeTypeName.trim().toLowerCase())) {
      alert(`Attribute type "${newAttributeTypeName}" already exists.`);
      return;
    }
    setData((prev) => ({
      ...prev,
      attributes: [...prev.attributes, { name: newAttributeTypeName.trim(), options: [] }],
    }));
    setNewAttributeTypeName('');
    setAttributeNameInputType('select');
    setOpenAddAttribute(false);
  };

  const handleAddAttributeOption = () => {
    if (!selectedAttributeTypeForOption) {
      alert('Please select an attribute type.');
      return;
    }
    if (!newOptionValue.trim()) {
      alert('Attribute option value cannot be empty.');
      return;
    }
    if (newOptionPrice === '' || isNaN(Number(newOptionPrice)) || Number(newOptionPrice) < 0) {
      alert('Please enter a valid price for the attribute option.');
      return;
    }
    if (newOptionStock !== null && (isNaN(Number(newOptionStock)) || Number(newOptionStock) < 0)) {
      alert('Please enter a valid number for stock, or leave it empty.');
      return;
    }

    setData((prev) => {
      const updatedAttributes = prev.attributes.map((attrGroup) => {
        if (attrGroup.name === selectedAttributeTypeForOption) {
          const isDuplicate = attrGroup.options.some(
            (option) => option.name.toLowerCase() === newOptionValue.trim().toLowerCase()
          );
          if (isDuplicate) {
            alert(`Option "${newOptionValue.trim()}" already exists for ${selectedAttributeTypeForOption}.`);
            return attrGroup;
          }
          return {
            ...attrGroup,
            options: [
              ...attrGroup.options,
              {
                name: newOptionValue.trim(),
                price: Number(newOptionPrice),
                stock: newOptionStock !== null ? Number(newOptionStock) : null,
                unit: newOptionUnit.trim(),
              },
            ],
          };
        }
        return attrGroup;
      });
      return { ...prev, attributes: updatedAttributes };
    });

    setNewOptionValue('');
    setNewOptionPrice('');
    setNewOptionStock(null);
    setNewOptionUnit('');
    setSelectedAttributeTypeForOption('');
  };

  const handleDeleteAttributeOption = (attributeTypeName, optionValueToDelete) => {
    setData((prev) => ({
      ...prev,
      attributes: prev.attributes.map((attrGroup) => {
        if (attrGroup.name === attributeTypeName) {
          return {
            ...attrGroup,
            options: attrGroup.options.filter((option) => option.name !== optionValueToDelete),
          };
        }
        return attrGroup;
      }),
    }));
  };

  const handleDeleteAttributeType = (attributeTypeToDelete) => {
    setData((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((attrGroup) => attrGroup.name !== attributeTypeToDelete),
    }));
  };

  const handleAddReview = () => {
    if (!reviewName.trim() || !reviewComment.trim() || reviewStars === 0) {
      alert('Please fill in reviewer name, stars (1-5), and comment for the review.');
      return;
    }

    const newReview = {
      name: reviewName.trim(),
      stars: reviewStars,
      comment: reviewComment.trim(),
    };

    setData((prev) => ({
      ...prev,
      reviews: [...prev.reviews, newReview],
    }));

    setReviewName('');
    setReviewStars(0);
    setReviewComment('');
    setOpenAddReview(false);
  };

  const handleDeleteReview = (indexToDelete) => {
    setData((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((_, index) => index !== indexToDelete),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const filteredMoreDetails = Object.fromEntries(
        Object.entries(data.more_details).filter(([, value]) => value !== '')
      );

      if (data.image.length === 0) {
        alert('Please upload at least one image.');
        setSubmitLoading(false);
        return;
      }
      if (data.category.length === 0) {
        alert('Please select at least one category.');
        setSubmitLoading(false);
        return;
      }
      if (!data.name.trim() || !data.description.trim()) {
        alert('Please fill in all required text fields (Name, Description).');
        setSubmitLoading(false);
        return;
      }
      if (!Array.isArray(data.reviews)) {
        alert('Reviews must be an array.');
        setSubmitLoading(false);
        return;
      }

      let hasAnyAttributePrice = false;
      if (data.attributes.length > 0) {
        for (const attrGroup of data.attributes) {
          if (attrGroup.options && attrGroup.options.some((option) => typeof option.price === 'number' && !isNaN(option.price) && option.price >= 0)) {
            hasAnyAttributePrice = true;
            break;
          }
        }
      }
      if (!hasAnyAttributePrice && data.attributes.length > 0) {
        alert('Please define at least one attribute option with a valid price.');
        setSubmitLoading(false);
        return;
      }

      const productDataToSend = {
        _id: data._id,
        name: data.name,
        image: data.image,
        category: data.category.map((c) => c._id),
        subCategory: data.subCategory.map((s) => s._id),
        description: data.description,
        more_details: filteredMoreDetails,
        attributes: data.attributes,
        reviews: data.reviews,
        comboOffer: data.comboOffer,
      };

      console.log('Product data to send:', JSON.stringify(productDataToSend, null, 2));

      const response = await Axios({
        ...SummaryApi.updateProductDetails,
        data: productDataToSend,
      });

      if (response.data.success) {
        successAlert(response.data.message);
        close();
        fetchProductData();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Dialog open={true} onClose={close} fullWidth maxWidth="md">
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Edit Product</Typography>
          <IconButton onClick={close}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            name="name"
            value={data.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            name="description"
            value={data.description}
            onChange={handleChange}
            required
          />

          <FormControlLabel
            control={
              <Switch
                checked={data.comboOffer}
                onChange={handleComboOfferToggle}
                color="primary"
              />
            }
            label="Enable Combo Offer"
            sx={{ mb: 2 }}
          />

          {/* Image Upload Section */}
          <Box mt={2}>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Images
            </Typography>
            <label htmlFor="editProductImages">
              <Button
                component="span"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                sx={{ height: '96px', width: '100%' }}
              >
                {imageLoading ? <Loading /> : 'Upload More Images'}
              </Button>
              <input
                type="file"
                id="editProductImages"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleUploadImages}
                multiple
              />
            </label>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
              {data.image.map((img, index) => (
                <Box key={img + index} sx={{ position: 'relative', width: 80, height: 80 }}>
                  <img
                    src={img}
                    alt="product"
                    style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'pointer' }}
                    onClick={() => setViewImageURL(img)}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'error.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'error.dark' },
                    }}
                    onClick={() => handleDeleteImage(index)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Category & SubCategory Section */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={selectCategory}
              onChange={(e) => {
                const value = e.target.value;
                const category = allCategory.find((c) => c._id === value);
                if (category && !data.category.some((c) => c._id === category._id)) {
                  setData((prev) => ({ ...prev, category: [...prev.category, category] }));
                  setSelectCategory('');
                }
              }}
              label="Category"
            >
              <MenuItem value="">Select Category</MenuItem>
              {allCategory.map((c) => (
                <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
              ))}
            </Select>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {data.category.map((c, index) => (
                <Chip
                  key={c._id + index}
                  label={c.name}
                  onDelete={() => handleRemoveCategory(index)}
                  deleteIcon={<CloseIcon />}
                />
              ))}
            </Box>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Sub Category</InputLabel>
            <Select
              value={selectSubCategory}
              onChange={(e) => {
                const value = e.target.value;
                const subCategory = allSubCategory.find((s) => s._id === value);
                if (subCategory && !data.subCategory.some((s) => s._id === subCategory._id)) {
                  setData((prev) => ({ ...prev, subCategory: [...prev.subCategory, subCategory] }));
                  setSelectSubCategory('');
                }
              }}
              label="Sub Category"
            >
              <MenuItem value="">Select Sub Category</MenuItem>
              {allSubCategory.map((s) => (
                <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>
              ))}
            </Select>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {data.subCategory.map((s, index) => (
                <Chip
                  key={s._id + index}
                  label={s.name}
                  onDelete={() => handleRemoveSubCategory(index)}
                  deleteIcon={<CloseIcon />}
                />
              ))}
            </Box>
          </FormControl>

          {/* More Details Section */}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" fontWeight="medium">More Details (General Key-Value Pairs)</Typography>
          {Object.keys(data.more_details).map((key) => (
            <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <TextField
                label={key}
                fullWidth
                value={data.more_details[key]}
                onChange={(e) => handleMoreDetailsChange(key, e.target.value)}
              />
              <IconButton
                onClick={() =>
                  setData((prev) => ({
                    ...prev,
                    more_details: Object.fromEntries(
                      Object.entries(prev.more_details).filter(([k]) => k !== key)
                    ),
                  }))
                }
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddField(true)}
            sx={{ width: 'fit-content' }}
          >
            Add More Detail Field
          </Button>

          {/* Attributes Section */}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" fontWeight="medium">Product Attributes</Typography>
          {data.attributes.map((attributeGroup) => (
            <Box key={attributeGroup.name} sx={{ border: '1px solid #ccc', p: 2, borderRadius: 1, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight="medium">{attributeGroup.name}:</Typography>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteAttributeType(attributeGroup.name)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {attributeGroup.options.map((option, idx) => (
                  <Chip
                    key={option.name + idx}
                    label={`${option.name} ${option.price !== undefined && option.price !== null ? `(${option.price > 0 ? '+' : ''}${option.price})` : ''} ${option.unit ? option.unit : ''}`}
                    onDelete={() => handleDeleteAttributeOption(attributeGroup.name, option.name)}
                    deleteIcon={<CloseIcon />}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Add Options to {attributeGroup.name}</InputLabel>
                  <Select
                    value={selectedAttributeTypeForOption === attributeGroup.name ? attributeGroup.name : ''}
                    onChange={(e) => setSelectedAttributeTypeForOption(e.target.value)}
                    label={`Add Options to ${attributeGroup.name}`}
                    disabled={selectedAttributeTypeForOption && selectedAttributeTypeForOption !== attributeGroup.name}
                  >
                    <MenuItem value="">Select to Add Options</MenuItem>
                    <MenuItem value={attributeGroup.name}>{attributeGroup.name}</MenuItem>
                  </Select>
                </FormControl>
                {selectedAttributeTypeForOption === attributeGroup.name && (
                  <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                    <TextField
                      label="Option Value (e.g., 128GB, 1kg, Red)"
                      variant="outlined"
                      size="small"
                      value={newOptionValue}
                      onChange={(e) => setNewOptionValue(e.target.value)}
                      sx={{ flexGrow: 1 }}
                    />
                    <TextField
                      label="Price"
                      variant="outlined"
                      size="small"
                      type="number"
                      value={newOptionPrice}
                      onChange={(e) => setNewOptionPrice(e.target.value)}
                      sx={{ width: '120px' }}
                    />
                    <TextField
                      label="Stock"
                      variant="outlined"
                      size="small"
                      type="number"
                      value={newOptionStock === null ? '' : newOptionStock}
                      onChange={(e) => setNewOptionStock(e.target.value === '' ? null : Number(e.target.value))}
                      sx={{ width: '100px' }}
                    />
                    <TextField
                      label="Unit (e.g., kg, g, ml)"
                      variant="outlined"
                      size="small"
                      value={newOptionUnit}
                      onChange={(e) => setNewOptionUnit(e.target.value)}
                      sx={{ width: '120px' }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleAddAttributeOption}
                      sx={{ flexShrink: 0 }}
                    >
                      Add Option
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        setSelectedAttributeTypeForOption('');
                        setNewOptionValue('');
                        setNewOptionPrice('');
                        setNewOptionStock(null);
                        setNewOptionUnit('');
                      }}
                      sx={{ flexShrink: 0 }}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
          ))}
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => {
              setOpenAddAttribute(true);
              setNewAttributeTypeName('');
              setAttributeNameInputType('select');
            }}
            sx={{ width: 'fit-content' }}
          >
            Add New Attribute Type
          </Button>

          {/* Reviews Section */}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" fontWeight="medium">Product Reviews</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {data.reviews.map((review, index) => (
              <Box
                key={index}
                sx={{ border: '1px solid #eee', p: 2, borderRadius: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium">{review.name}</Typography>
                  <Rating value={review.stars} readOnly size="small" />
                  <Typography variant="body2">{review.comment}</Typography>
                </Box>
                <IconButton
                  onClick={() => handleDeleteReview(index)}
                  color="error"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setOpenAddReview(true)}
              sx={{ width: 'fit-content', mt: 1 }}
            >
              Add New Review
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={close} color="secondary">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitLoading}
          >
            {submitLoading ? <CircularProgress size={24} /> : 'Update Product'}
          </Button>
        </DialogActions>
      </form>

      {viewImageURL && <ViewImage url={viewImageURL} close={() => setViewImageURL('')} />}

      <Dialog open={openAddField} onClose={() => setOpenAddField(false)}>
        <DialogTitle>Add New More Detail Field</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Field Name (e.g., Material, Weight)"
            fullWidth
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddField(false)}>Cancel</Button>
          <Button onClick={handleAddMoreDetailField}>Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddAttribute} onClose={() => setOpenAddAttribute(false)}>
        <DialogTitle>Add New Attribute Type</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Attribute Type</InputLabel>
            <Select
              value={attributeNameInputType}
              onChange={(e) => setAttributeNameInputType(e.target.value)}
              label="Attribute Type"
            >
              <MenuItem value="select">Select from predefined</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>
          {attributeNameInputType === 'select' ? (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Predefined Attribute Name</InputLabel>
              <Select
                value={newAttributeTypeName}
                onChange={(e) => setNewAttributeTypeName(e.target.value)}
                label="Predefined Attribute Name"
              >
                <MenuItem value="">Select Attribute</MenuItem>
                {predefinedAttributeNames.map((name) => (
                  <MenuItem key={name} value={name}>{name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <TextField
              autoFocus
              margin="dense"
              label="Custom Attribute Name"
              fullWidth
              value={newAttributeTypeName}
              onChange={(e) => setNewAttributeTypeName(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenAddAttribute(false);
              setNewAttributeTypeName('');
              setAttributeNameInputType('select');
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleAddAttributeType}>Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddReview} onClose={() => setOpenAddReview(false)}>
        <DialogTitle>Add New Review</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reviewer Name"
            fullWidth
            value={reviewName}
            onChange={(e) => setReviewName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Typography component="legend">Stars</Typography>
          <Rating
            name="review-stars"
            value={reviewStars}
            onChange={(event, newValue) => setReviewStars(newValue)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Comment"
            fullWidth
            multiline
            rows={3}
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddReview(false)}>Cancel</Button>
          <Button onClick={handleAddReview}>Add Review</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default EditProductAdmin;