import ProductModel from "../models/product.model.js";
import mongoose from "mongoose"; // Import mongoose to validate ObjectId
import deleteImageLocal from "../utils/deleteImageLocal.js";

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
      if (typeof option !== 'object' || option === null || !option.name || 
          typeof option.originalPrice !== 'number' || isNaN(option.originalPrice) || option.originalPrice < 0) {
        return `Option in '${attrGroup.name}' must have a 'name' and 'originalPrice'.`;
      }
      
      // Handle optional offerPrice
      if (option.offerPrice === undefined || option.offerPrice === null || option.offerPrice === 0) {
        option.offerPrice = option.originalPrice;
      }

      if (typeof option.offerPrice !== 'number' || isNaN(option.offerPrice) || option.offerPrice < 0) {
        return `Option in '${attrGroup.name}' must have a valid 'offerPrice' if provided.`;
      }

      // Sync price with offerPrice for backward compatibility
      option.price = option.offerPrice;

      if (option.stock !== undefined && option.stock !== null && (typeof option.stock !== 'number' || isNaN(option.stock) || option.stock < 0)) {
        return `Stock in option '${option.name}' for '${attrGroup.name}' must be a valid number or null.`;
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
      comboOffer,
      megaCombo,
      trending,
      altText,
      storage_instructions,
      storage_image,
      demoVideoLink
    } = request.body;

    console.log("Received create product data:", { name, image, category, subCategory, description, more_details, publish, attributes, reviews, comboOffer });

    if (!name || !image || image.length === 0 || !category || !description) {
      return response.status(400).json({
        message: "Please provide all required fields: name, image, category, and description.",
        error: true,
        success: false
      });
    }

    if (subCategory && Array.isArray(subCategory)) {
        for (const subId of subCategory) {
            const productCount = await ProductModel.countDocuments({ subCategory: subId });
            if (productCount >= 50) {
                return response.status(400).json({
                    message: `Subcategory is full. Maximum 50 products allowed per subcategory.`,
                    error: true,
                    success: false
                });
            }
        }
    }

    const attributeValidationError = validateAttributes(attributes);
    if (attributeValidationError) {
      return response.status(400).json({
        message: attributeValidationError,
        error: true,
        success: false
      });
    }

    if (publish) {
      let hasPrice = false;
      if (attributes && Array.isArray(attributes)) {
        for (const attrGroup of attributes) {
          if (attrGroup.options && attrGroup.options.some(option => typeof option.offerPrice === 'number' && !isNaN(option.offerPrice) && option.offerPrice > 0)) {
            hasPrice = true;
            break;
          }
        }
      }
      if (!hasPrice) {
        return response.status(400).json({
          message: "Cannot publish a product without a valid price. Please add at least one pricing option.",
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
      comboOffer: comboOffer || false,
      megaCombo: megaCombo || false,
      trending: trending || false,
      altText: altText || "",
      storage_instructions: storage_instructions || "",
      storage_image: storage_image || "",
      demoVideoLink: demoVideoLink || ""
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
    const { _id, name, image, category, subCategory, description, more_details, publish, attributes, reviews, comboOffer, megaCombo, trending, altText, storage_instructions, storage_image, demoVideoLink } = request.body;

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

    if (publish) {
      let hasPrice = false;
      // Check provided attributes or existing attributes if not provided
      const attrsToCheck = attributes !== undefined ? attributes : (await ProductModel.findById(_id))?.attributes;
      
      if (attrsToCheck && Array.isArray(attrsToCheck)) {
        for (const attrGroup of attrsToCheck) {
          if (attrGroup.options && attrGroup.options.some(option => typeof option.offerPrice === 'number' && !isNaN(option.offerPrice) && option.offerPrice > 0)) {
            hasPrice = true;
            break;
          }
        }
      }
      
      if (!hasPrice) {
        return response.status(400).json({
          message: "Cannot publish a product without a valid price. Please add at least one pricing option.",
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
      comboOffer,
      megaCombo,
      trending,
      altText,
      storage_instructions,
      storage_image,
      demoVideoLink
    };

    Object.keys(updatedProductData).forEach(key => {
      if (updatedProductData[key] === undefined) {
        delete updatedProductData[key];
      }
    });

    console.log("Updated product data to save:", updatedProductData);

    const existingProduct = await ProductModel.findById(_id);
    if (existingProduct) {
      if (image && Array.isArray(image) && existingProduct.image && Array.isArray(existingProduct.image)) {
        const imagesToDelete = existingProduct.image.filter(img => !image.includes(img));
        for (const imgUrl of imagesToDelete) {
          await deleteImageLocal(imgUrl);
        }
      }
      if (storage_image && existingProduct.storage_image && existingProduct.storage_image !== storage_image) {
        await deleteImageLocal(existingProduct.storage_image);
      }
    }

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

export const getMegaComboProducts = async (request, response) => {
  try {
    let page = request.body.page || 1;
    let limit = request.body.limit || 12;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const query = { megaCombo: true, publish: true };
    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('category subCategory'),
      ProductModel.countDocuments(query)
    ]);

    return response.json({
      message: "Mega combo products fetched successfully",
      data: data,
      totalCount: totalCount,
      success: true,
      error: false
    });
  } catch (error) {
    return response.status(500).json({ message: error.message, error: true, success: false });
  }
};

export const getTrendingProducts = async (request, response) => {
  try {
    let page = request.body.page || 1;
    let limit = request.body.limit || 12;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const query = { trending: true, publish: true };
    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('category subCategory'),
      ProductModel.countDocuments(query)
    ]);

    return response.json({
      message: "Trending products fetched successfully",
      data: data,
      totalCount: totalCount,
      success: true,
      error: false
    });
  } catch (error) {
    return response.status(500).json({ message: error.message, error: true, success: false });
  }
};

export const getRecentProducts = async (request, response) => {
  try {
    let limit = request.body.limit || 12;
    limit = parseInt(limit, 10);

    const query = { 
        publish: true,
        comboOffer: false,
        megaCombo: false
    };

    const data = await ProductModel.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('category subCategory');

    return response.json({
      message: "Recent products fetched successfully",
      data: data,
      success: true,
      error: false
    });
  } catch (error) {
    return response.status(500).json({ message: error.message, error: true, success: false });
  }
};



export const getProductByCategory = async (request, response) => {
  try {
    let { page = 1, limit = 10, categoryId, minPrice, maxPrice, minRating, inStock, sort } = request.body;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return response.status(400).json({
        message: "Invalid category ID format.",
        error: true,
        success: false
      });
    }

    const baseMatchQuery = { 
      category: new mongoose.Types.ObjectId(categoryId),
      publish: true
    };

    const matchQuery = { ...baseMatchQuery };

    if (minPrice !== undefined || maxPrice !== undefined) {
      matchQuery["attributes.options.offerPrice"] = {};
      if (minPrice !== undefined) matchQuery["attributes.options.offerPrice"].$gte = Number(minPrice);
      if (maxPrice !== undefined) matchQuery["attributes.options.offerPrice"].$lte = Number(maxPrice);
    }

    if (inStock) {
      matchQuery["attributes.options.stock"] = { $gt: 0 };
    }

    const maxPriceResult = await ProductModel.aggregate([
      { $match: baseMatchQuery },
      { $unwind: "$attributes" },
      { $unwind: "$attributes.options" },
      { $group: { _id: null, maxPrice: { $max: "$attributes.options.offerPrice" } } }
    ]);
    const maxPriceLimit = maxPriceResult.length > 0 ? maxPriceResult[0].maxPrice : 5000;

    const skip = (page - 1) * limit;

    const pipeline = [
      { $match: matchQuery },
      {
        $addFields: {
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: "$reviews" }, 0] },
              then: { $avg: "$reviews.stars" },
              else: 0
            }
          },
          minOfferPrice: { $min: "$attributes.options.offerPrice" }
        }
      }
    ];

    if (minRating) {
      pipeline.push({ $match: { averageRating: { $gte: Number(minRating) } } });
    }

    // Sorting logic
    let sortObj = { createdAt: -1 };
    if (sort === "priceLowToHigh") sortObj = { minOfferPrice: 1 };
    else if (sort === "priceHighToLow") sortObj = { minOfferPrice: -1 };
    else if (sort === "rating") sortObj = { averageRating: -1 };

    const countPipeline = [...pipeline, { $count: "total" }];

    pipeline.push(
      { $sort: sortObj },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $lookup: {
          from: 'subcategories',
          localField: 'subCategory',
          foreignField: '_id',
          as: 'subCategory'
        }
      }
    );

    const [data, countResult] = await Promise.all([
      ProductModel.aggregate(pipeline),
      ProductModel.aggregate(countPipeline)
    ]);

    const totalCount = countResult.length > 0 ? countResult[0].total : 0;

    return response.json({
      message: "Products fetched successfully",
      data: data,
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      maxPriceLimit: maxPriceLimit,
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
 * Deletes a review from a product.
 */
export const deleteReviewController = async (request, response) => {
  try {
    const { productId, reviewId } = request.body;

    if (!productId || !reviewId) {
      return response.status(400).json({
        message: "Please provide both productId and reviewId.",
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
        message: "Product not found.",
        error: true,
        success: false
      });
    }

    // Filter out the review to be deleted
    const initialReviewCount = product.reviews.length;
    product.reviews = product.reviews.filter(review => review._id.toString() !== reviewId);

    if (product.reviews.length === initialReviewCount) {
      return response.status(404).json({
        message: "Review not found in this product.",
        error: true,
        success: false
      });
    }

    await product.save();

    return response.json({
      message: "Review deleted successfully.",
      error: false,
      success: true
    });

  } catch (error) {
    console.error("Error deleting review:", error);
    return response.status(500).json({
      message: error.message || "An internal server error occurred.",
      error: true,
      success: false
    });
  }
};

/**
 * Updates an existing review in a product.
 */
export const updateReviewController = async (request, response) => {
  try {
    const { productId, reviewId, name, stars, comment } = request.body;

    if (!productId || !reviewId || !name || !stars || !comment) {
      return response.status(400).json({
        message: "Please provide all required fields: productId, reviewId, name, stars, and comment.",
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
        message: "Product not found.",
        error: true,
        success: false
      });
    }

    const review = product.reviews.id(reviewId);
    if (!review) {
      return response.status(404).json({
        message: "Review not found.",
        error: true,
        success: false
      });
    }

    // Update review fields
    review.name = name;
    review.stars = stars;
    review.comment = comment;

    await product.save();

    return response.json({
      message: "Review updated successfully.",
      data: review,
      error: false,
      success: true
    });

  } catch (error) {
    console.error("Error updating review:", error);
    return response.status(500).json({
      message: error.message || "An internal server error occurred.",
      error: true,
      success: false
    });
  }
};

/**
 * Fetches all reviews across all products (for admin).
 */
export const getAllProductReviewsController = async (request, response) => {
  try {
    const products = await ProductModel.find({ "reviews.0": { $exists: true } }, 'name reviews image');
    
    let allReviews = [];
    products.forEach(product => {
      const productReviews = product.reviews.map(review => ({
        ...review.toObject(),
        productId: product._id,
        productName: product.name,
        productImage: product.image[0]
      }));
      allReviews = [...allReviews, ...productReviews];
    });

    // Sort all reviews by date (newest first)
    allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return response.json({
      message: "All product reviews fetched successfully.",
      data: allReviews,
      error: false,
      success: true
    });
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    return response.status(500).json({
      message: error.message || "An internal server error occurred.",
      error: true,
      success: false
    });
  }
};
export const getProductController = async (request, response) => {
  try {
    let { page = 1, limit = 10, search, minPrice, maxPrice, minRating, inStock, sort } = request.body;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const baseMatchQuery = { publish: true };
    if (search) {
      baseMatchQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const matchQuery = { ...baseMatchQuery };

    if (minPrice !== undefined || maxPrice !== undefined) {
      matchQuery["attributes.options.offerPrice"] = {};
      if (minPrice !== undefined) matchQuery["attributes.options.offerPrice"].$gte = Number(minPrice);
      if (maxPrice !== undefined) matchQuery["attributes.options.offerPrice"].$lte = Number(maxPrice);
    }

    if (inStock) {
      matchQuery["attributes.options.stock"] = { $gt: 0 };
    }

    const maxPriceResult = await ProductModel.aggregate([
      { $match: baseMatchQuery },
      { $unwind: "$attributes" },
      { $unwind: "$attributes.options" },
      { $group: { _id: null, maxPrice: { $max: "$attributes.options.offerPrice" } } }
    ]);
    const maxPriceLimit = maxPriceResult.length > 0 ? maxPriceResult[0].maxPrice : 5000;

    const skip = (page - 1) * limit;

    const pipeline = [
      { $match: matchQuery },
      {
        $addFields: {
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: "$reviews" }, 0] },
              then: { $avg: "$reviews.stars" },
              else: 0
            }
          },
          // Add a minPrice field for sorting
          minOfferPrice: { $min: "$attributes.options.offerPrice" }
        }
      }
    ];

    if (minRating) {
      pipeline.push({ $match: { averageRating: { $gte: Number(minRating) } } });
    }

    // Sorting logic
    let sortObj = { createdAt: -1 };
    if (sort === "priceLowToHigh") sortObj = { minOfferPrice: 1 };
    else if (sort === "priceHighToLow") sortObj = { minOfferPrice: -1 };
    else if (sort === "rating") sortObj = { averageRating: -1 };

    // Clone pipeline for count
    const countPipeline = [...pipeline, { $count: "total" }];

    pipeline.push(
      { $sort: sortObj },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $lookup: {
          from: 'subcategories',
          localField: 'subCategory',
          foreignField: '_id',
          as: 'subCategory'
        }
      }
    );

    const [data, countResult] = await Promise.all([
      ProductModel.aggregate(pipeline),
      ProductModel.aggregate(countPipeline)
    ]);

    const totalCount = countResult.length > 0 ? countResult[0].total : 0;

    return response.json({
      message: "Product data fetched successfully",
      data: data,
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      maxPriceLimit: maxPriceLimit,
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

    const baseQuery = {
      category: new mongoose.Types.ObjectId(categoryId),
      subCategory: new mongoose.Types.ObjectId(subCategoryId),
      publish: true
    };

    const query = { ...baseQuery };

    const { minPrice, maxPrice } = request.body;
    if (minPrice !== undefined || maxPrice !== undefined) {
      query["attributes.options.offerPrice"] = {};
      if (minPrice !== undefined) query["attributes.options.offerPrice"].$gte = Number(minPrice);
      if (maxPrice !== undefined) query["attributes.options.offerPrice"].$lte = Number(maxPrice);
    }

    const maxPriceResult = await ProductModel.aggregate([
      { $match: {
          category: { $in: [new mongoose.Types.ObjectId(categoryId)] },
          subCategory: { $in: [new mongoose.Types.ObjectId(subCategoryId)] },
          publish: true
      } },
      { $unwind: "$attributes" },
      { $unwind: "$attributes.options" },
      { $group: { _id: null, maxPrice: { $max: "$attributes.options.offerPrice" } } }
    ]);
    const maxPriceLimit = maxPriceResult.length > 0 ? maxPriceResult[0].maxPrice : 5000;

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
      maxPriceLimit: maxPriceLimit,
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

    const existingProduct = await ProductModel.findById(_id);
    if (existingProduct) {
      if (existingProduct.image && Array.isArray(existingProduct.image)) {
        for (const imgUrl of existingProduct.image) {
          await deleteImageLocal(imgUrl);
        }
      }
      if (existingProduct.storage_image) {
        await deleteImageLocal(existingProduct.storage_image);
      }
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
    let { search, page = 1, limit = 10, minPrice, maxPrice, minRating, inStock, sort } = request.body;

    if (!search || search.trim() === "") {
      return response.json({
        message: "Search term is empty",
        data: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: page,
        error: false,
        success: true
      });
    }

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const baseMatchQuery = {
      publish: true,
      $or: [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ]
    };

    const matchQuery = { ...baseMatchQuery };

    if (minPrice !== undefined || maxPrice !== undefined) {
      matchQuery["attributes.options.offerPrice"] = {};
      if (minPrice !== undefined) matchQuery["attributes.options.offerPrice"].$gte = Number(minPrice);
      if (maxPrice !== undefined) matchQuery["attributes.options.offerPrice"].$lte = Number(maxPrice);
    }

    if (inStock) {
      matchQuery["attributes.options.stock"] = { $gt: 0 };
    }

    const skip = (page - 1) * limit;

    const pipeline = [
      { $match: matchQuery },
      {
        $addFields: {
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: "$reviews" }, 0] },
              then: { $avg: "$reviews.stars" },
              else: 0
            }
          },
          minOfferPrice: { $min: "$attributes.options.offerPrice" }
        }
      }
    ];

    if (minRating) {
      pipeline.push({ $match: { averageRating: { $gte: Number(minRating) } } });
    }

    // Sorting logic
    let sortObj = { createdAt: -1 };
    if (sort === "priceLowToHigh") sortObj = { minOfferPrice: 1 };
    else if (sort === "priceHighToLow") sortObj = { minOfferPrice: -1 };
    else if (sort === "rating") sortObj = { averageRating: -1 };

    const countPipeline = [...pipeline, { $count: "total" }];

    pipeline.push(
      { $sort: sortObj },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $lookup: {
          from: 'subcategories',
          localField: 'subCategory',
          foreignField: '_id',
          as: 'subCategory'
        }
      }
    );

    const [data, countResult] = await Promise.all([
      ProductModel.aggregate(pipeline),
      ProductModel.aggregate(countPipeline)
    ]);

    const totalCount = countResult.length > 0 ? countResult[0].total : 0;

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



