// product.route.js
import { Router } from 'express';
import auth from '../middleware/auth.js';
import {
  createProductController,
  deleteProductDetails,
  getProductByCategory,
  getProductByCategoryAndSubCategory,
  getProductController,
  getProductDetails,
  searchProduct,
  updateProductDetails,
  addReviewToProduct,
  getComboOfferProducts,
  getMegaComboProducts,
  getTrendingProducts,
  getRecentProducts
} from '../controllers/product.controller.js';
import { admin } from '../middleware/Admin.js';

const productRouter = Router();

productRouter.post("/create", auth, admin, createProductController);
productRouter.post('/get', getProductController);
productRouter.post("/get-product-by-category", getProductByCategory);
productRouter.post('/get-product-by-category-and-subcategory', getProductByCategoryAndSubCategory);
productRouter.post('/get-product-details', getProductDetails);
productRouter.put('/update-product-details', auth, admin, updateProductDetails);
productRouter.delete('/delete-product', auth, admin, deleteProductDetails);
productRouter.post('/search-product', searchProduct);
productRouter.post('/add-review', auth, addReviewToProduct);
productRouter.post('/get-combo-offers', getComboOfferProducts);
productRouter.post('/get-mega-combo-products', getMegaComboProducts);
productRouter.post('/get-trending-products', getTrendingProducts);
productRouter.post('/get-recent-products', getRecentProducts);

export default productRouter;