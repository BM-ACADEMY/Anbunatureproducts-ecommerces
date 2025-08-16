import ProductModel from "../models/product.model.js";
import mongoose from "mongoose"; // Import mongoose to validate ObjectId

/**
 * Helper function to validate the structure of attributes
 */
const validateAttributes = (attributes) => {
  if (!Array.isArray(attributes)) {
    return "Attributes must be an array.";
  }

  if (attributes.length === 0) {
    return null; // Allow empty attributes
  }

  for (const attrGroup of attributes) {
    if (typeof attrGroup !== 'object' || attrGroup === null || !attrGroup.name || !Array.isArray(attrGroup.options)) {
      return "Each attribute group must have a 'name' and 'options' array.";
    }
    if (attrGroup.options.length === 0) {
      return `Attribute group '${attrGroup.name}' must have at least one option.`;
    }
    for (const option of attrGroup.options) {
      if (typeof option !== 'object' || option === null || !option.name || typeof option.price !== 'number' || isNaN(option.price) || option.price < 0) {
        return `Option in '${attrGroup.name}' must have a 'name' and a valid 'price'.`;
      }
      if (option.stock !== undefined && (typeof option.stock !== 'number' || isNaN(option.stock) || option.stock < 0)) {
        return `Stock in option '${option.name}' for '${attrGroup.name}' must be a valid number or null/undefined.`;
      }
    }
  }
  return null; // No errors
};

/**
 * Helper function to validate review structure
 */
const validateReviews = (reviews) => {
  if (!Array.isArray(reviews)) {
    return "Reviews must be an array.";
  }
  if (reviews.length === 0) {
    return null; // Allow empty reviews array
  }
  for (const review of reviews) {
    if (typeof review !== 'object' || review === null || !review.name || typeof review.stars !== 'number' || review.stars < 1 || review.stars > 5 || !review.comment) {
      return "Each review must have a 'name', 'stars' (1-5), and 'comment'.";
    }
  }
  return null; // No errors
};

/**
 * Creates a new product.
 */
export const createProductController = async (request, response) => {
  try {
    const {
      name,
      image,
      category,
      subCategory,
      description,
      more_details,
      publish,
      attributes,
      reviews,
      comboOffer
    } = request.body;

    console.log("Received create product data:", { name, image, category, subCategory, description, more_details, publish, attributes, reviews, comboOffer });

    if (!name || !image || image.length === 0 || !category || category.length === 0 || !description) {
      return response.status(400).json({
        message: "Please provide all required fields: name, image, category, and description.",
        error: true,
        success: false
      });
    }

    const attributeValidationError = validateAttributes(attributes);
    if (attributeValidationError) {
      return response.status(400).json({
        message: attributeValidationError,
        error: true,
        success: false
      });
    }

    if (attributes && attributes.length > 0) {
      let hasPriceInAttributes = false;
      for (const attrGroup of attributes) {
        if (attrGroup.options && attrGroup.options.some(option => typeof option.price === 'number' && !isNaN(option.price))) {
          hasPriceInAttributes = true;
          break;
        }
      }
      if (!hasPriceInAttributes) {
        return response.status(400).json({
          message: "If attributes are provided, at least one attribute option must have a valid price.",
          error: true,
          success: false
        });
      }
    }

    if (reviews !== undefined && reviews !== null) {
      const reviewValidationError = validateReviews(reviews);
      if (reviewValidationError) {
        return response.status(400).json({
          message: reviewValidationError,
          error: true,
          success: false
        });
      }
    }

    const product = new ProductModel({
      name,
      image,
      category,
      subCategory,
      description,
      more_details,
      publish,
      attributes: attributes || [],
      reviews: reviews || [],
      comboOffer: comboOffer || false
    });

    const saveProduct = await product.save();
    console.log("Saved product:", saveProduct);

    return response.status(201).json({
      message: "Product Created Successfully",
      data: saveProduct,
      error: false,
      success: true
    });

  } catch (error) {
    console.error("Error creating product:", error);
    return response.status(500).json({
      message: error.message || "An internal server error occurred.",
      error: true,
      success: false
    });
  }
};
/**
 * Adds a review to an existing product.
 */
export const addReviewToProduct = async (request, response) => {
  try {
    const { productId, name, stars, comment } = request.body;

    // Debug log
    console.log("Received review data:", { productId, name, stars, comment });

    if (!productId || !name || !stars || !comment) {
      return response.status(400).json({
        message: "Please provide productId, reviewer name, stars (1-5), and comment for the review.",
        error: true,
        success: false
      });
    }

    if (typeof stars !== 'number' || stars < 1 || stars > 5) {
      return response.status(400).json({
        message: "Stars must be a number between 1 and 5.",
        error: true,
        success: false
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return response.status(400).json({
        message: "Invalid Product ID format.",
        error: true,
        success: false
      });
    }

    const product = await ProductModel.findById(productId);

    if (!product) {
      return response.status(404).json({
        message: "Product not found to add review.",
        error: true,
        success: false
      });
    }

    // Add the review to the product's reviews array
    product.reviews.push({ name, stars, comment });
    const updatedProduct = await product.save();
    console.log("Updated product reviews:", updatedProduct.reviews); // Debug log

    return response.status(200).json({
      message: "Review added successfully.",
      data: updatedProduct.reviews[updatedProduct.reviews.length - 1],
      error: false,
      success: true
    });

  } catch (error) {
    console.error("Error adding review:", error);
    return response.status(500).json({
      message: error.message || "An internal server error occurred.",
      error: true,
      success: false
    });
  }
};

/**
 * Updates an existing product's details.
 */
export const updateProductDetails = async (request, response) => {
  try {
    const { _id, name, image, category, subCategory, description, more_details, publish, attributes, reviews, comboOffer } = request.body;

    console.log("Received update product data:", { _id, name, image, category, subCategory, description, more_details, publish, attributes, reviews, comboOffer });

    if (!_id) {
      return response.status(400).json({
        message: "Please provide the product _id to update.",
        error: true,
        success: false
      });
    }

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return response.status(400).json({
        message: "Invalid Product ID format.",
        error: true,
        success: false
      });
    }

    if (attributes !== undefined) {
      const attributeValidationError = validateAttributes(attributes);
      if (attributeValidationError) {
        return response.status(400).json({
          message: attributeValidationError,
          error: true,
          success: false
        });
      }

      if (attributes && attributes.length > 0) {
        let hasPriceInAttributes = false;
        for (const attrGroup of attributes) {
          if (attrGroup.options && attrGroup.options.some(option => typeof option.price === 'number' && !isNaN(option.price))) {
            hasPriceInAttributes = true;
            break;
          }
        }
        if (!hasPriceInAttributes) {
          return response.status(400).json({
            message: "If attributes are updated and provided, at least one attribute option must have a valid price.",
            error: true,
            success: false
          });
        }
      }
    }

    if (reviews !== undefined && reviews !== null) {
      const reviewValidationError = validateReviews(reviews);
      if (reviewValidationError) {
        return response.status(400).json({
          message: reviewValidationError,
          error: true,
          success: false
        });
      }
    }

    const updatedProductData = {
      name,
      image,
      category,
      subCategory,
      description,
      more_details,
      publish,
      attributes,
      reviews,
      comboOffer
    };

    Object.keys(updatedProductData).forEach(key => {
      if (updatedProductData[key] === undefined) {
        delete updatedProductData[key];
      }
    });

    console.log("Updated product data to save:", updatedProductData);

    const updatedProduct = await ProductModel.findByIdAndUpdate(_id, {
      $set: updatedProductData
    }, { new: true });

    if (!updatedProduct) {
      return response.status(404).json({
        message: "Product not found to update.",
        error: true,
        success: false
      });
    }

    return response.json({
      message: "Product updated successfully",
      data: updatedProduct,
      error: false,
      success: true
    });

  } catch (error) {
    console.error("Error updating product:", error);
    return response.status(500).json({
      message: error.message || "An internal server error occurred.",
      error: true,
      success: false
    });
  }
};

/**
 * Fetches products marked as combo offers.
 */

export const getComboOfferProducts = async (request, response) => {
  try {
    let { page = 1, limit = 10 } = request.body;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const query = { comboOffer: true };

    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('category subCategory'),
      ProductModel.countDocuments(query)
    ]);

    return response.json({
      message: "Combo offer products fetched successfully",
      data: data,
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching combo offer products:", error);
    return response.status(500).json({
      message: error.message || "An internal server error occurred.",
      error: true,
      success: false
    });
  }
};



export const getProductByCategory = async (request, response) => {
  try {
    let { page = 1, limit = 10, categoryId } = request.body;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return response.status(400).json({
        message: "Invalid category ID format.",
        error: true,
        success: false
      });
    }

    const query = { 
      category: { $in: [categoryId] },
      comboOffer: false // Exclude combo offer products
    };

    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('category subCategory'),
      ProductModel.countDocuments(query)
    ]);

    return response.json({
      message: "Products fetched successfully",
      data: data,
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return response.status(500).json({
      message: error.message || "An internal server error occurred.",
      error: true,
      success: false
    });
  }
};


/**
 * Other controller functions (unchanged)
 */
export const getProductController = async (request, response) => {
  try {
    let { page = 1, limit = 10, search } = request.body;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const query = search ? {
      $text: {
        $search: search
      }
    } : {};

    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('category subCategory'),
      ProductModel.countDocuments(query)
    ]);

    return response.json({
      message: "Product data fetched successfully",
      data: data,
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Error getting products:", error);
    return response.status(500).json({
      message: error.message || "An internal server error occurred.",
      error: true,
      success: false
    });
  }
};



export const getProductByCategoryAndSubCategory = async (request, response) => {
  try {
    let { page = 1, limit = 10, categoryId, subCategoryId } = request.body;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (!mongoose.Types.ObjectId.isValid(categoryId) || !mongoose.Types.ObjectId.isValid(subCategoryId)) {
      return response.status(400).json({
        message: "Invalid category or subcategory ID format.",
        error: true,
        success: false
      });
    }

    const query = {
      category: { $in: [categoryId] },
      subCategory: { $in: [subCategoryId] },
      comboOffer: false // Exclude combo offer products
    };

    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('category subCategory'),
      ProductModel.countDocuments(query)
    ]);

    return response.json({
      message: "Products fetched successfully",
      data: data,
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching products by category and subcategory:", error);
    return response.status(500).json({
      message: error.message || "An internal server error occurred.",
      error: true,
      success: false
    });
  }
};

export const getProductDetails = async (request, response) => {
  try {
    const { productId } = request.body;

    if (!productId) {
      return response.status(400).json({
        message: "Please provide a product ID.",
        error: true,
        success: false
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return response.status(400).json({
        message: "Invalid Product ID format.",
        error: true,
        success: false
      });
    }

    const product = await ProductModel.findById(productId).populate('category subCategory');

    if (!product) {
      return response.status(404).json({
        message: "Product not found.",
        error: true,
        success: false
      });
    }

    return response.json({
      message: "Product details fetched successfully",
      data: product,
      error: false,
      success: true
    });

  } catch (error) {
    console.error("Error getting product details:", error);
    return response.status(500).json({
      message: error.message || "An internal server error occurred.",
      error: true,
      success: false
    });
  }
};

export const deleteProductDetails = async (request, response) => {
  try {
    const { _id } = request.body;

    if (!_id) {
      return response.status(400).json({
        message: "Please provide the product _id to delete.",
        error: true,
        success: false
      });
    }

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return response.status(400).json({
        message: "Invalid Product ID format.",
        error: true,
        success: false
      });
    }

    const deleteResult = await ProductModel.deleteOne({ _id: _id });

    if (deleteResult.deletedCount === 0) {
      return response.status(404).json({
        message: "Product not found to delete.",
        error: true,
        success: false
      });
    }

    return response.json({
      message: "Product deleted successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return response.status(500).json({
      message: error.message || "An internal server error occurred.",
      error: true,
      success: false
    });
  }
};

export const searchProduct = async (request, response) => {
  try {
    let { search, page = 1, limit = 10 } = request.body;

    if (!search) {
      return response.status(400).json({
        message: "Please provide a search term.",
        error: true,
        success: false
      });
    }

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const query = {
      $text: {
        $search: search
      }
    };

    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      ProductModel.find(query).sort({ score: { $meta: "textScore" } }).skip(skip).limit(limit).populate('category subCategory'),
      ProductModel.countDocuments(query)
    ]);

    return response.json({
      message: "Product search results",
      data: data,
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      error: false,
      success: true
    });

  } catch (error) {
    console.error("Error searching product:", error);
    return response.status(500).json({
      message: error.message || "An internal server error occurred.",
      error: true,
      success: false
    });
  }
};



