// product.model.js
import mongoose from "mongoose";

// Enable Mongoose debug mode for troubleshooting
mongoose.set('debug', true);

// A sub-schema for reviews
const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  stars: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
}, { timestamps: true });

// A sub-schema for attribute options with their own price and stock
const attributeOptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    default: null
  },
  unit: {
    type: String,
    default: ""
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: [String],
    default: []
  },
  category: [{
    type: mongoose.Schema.ObjectId,
    ref: 'category'
  }],
  subCategory: [{
    type: mongoose.Schema.ObjectId,
    ref: 'subCategory'
  }],
  description: {
    type: String,
    default: ""
  },
  more_details: {
    type: Object,
    default: {}
  },
  publish: {
    type: Boolean,
    default: true
  },
  attributes: {
    type: [{
      name: {
        type: String,
        required: true
      },
      options: [attributeOptionSchema]
    }],
    default: []
  },
  reviews: {
    type: [reviewSchema],
    default: []
  },
  comboOffer: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

// Text search index
productSchema.index(
  { name: "text", description: "text" },
  { weights: { name: 10, description: 5 } }
);

const ProductModel = mongoose.model('product', productSchema);
export default ProductModel;