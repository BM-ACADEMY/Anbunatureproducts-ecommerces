import CouponModel from "../models/coupon.model.js";

// GET - Public: Get all active coupons (for checkout and marquee)
export const getActiveCouponsController = async (request, response) => {
  try {
    const coupons = await CouponModel.find({ isActive: true }).sort({ createdAt: -1 });

    return response.json({
      message: "Active coupons fetched successfully",
      data: coupons,
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// GET - Admin: Get all coupons (active and inactive)
export const getAllCouponsAdminController = async (request, response) => {
  try {
    const coupons = await CouponModel.find({}).sort({ createdAt: -1 });

    return response.json({
      message: "All coupons fetched successfully",
      data: coupons,
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// POST - Admin: Create new coupon
export const createCouponController = async (request, response) => {
  try {
    const { name, discountAmount, minOrderAmount, description, showInMarquee, isActive } = request.body;

    if (!name || !name.trim()) {
      return response.status(400).json({
        message: "Coupon name / code is required",
        error: true,
        success: false,
      });
    }

    if (discountAmount === undefined || discountAmount === null || Number(discountAmount) <= 0) {
      return response.status(400).json({
        message: "Discount amount must be greater than 0",
        error: true,
        success: false,
      });
    }

    const cleanName = name.trim().toUpperCase();

    const existingCoupon = await CouponModel.findOne({ name: cleanName });
    if (existingCoupon) {
      return response.status(400).json({
        message: `Coupon with name "${cleanName}" already exists`,
        error: true,
        success: false,
      });
    }

    const newCoupon = new CouponModel({
      name: cleanName,
      discountAmount: Number(discountAmount),
      minOrderAmount: Number(minOrderAmount) || 0,
      description: description ? description.trim() : "",
      showInMarquee: showInMarquee !== undefined ? Boolean(showInMarquee) : true,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    const savedCoupon = await newCoupon.save();

    return response.status(201).json({
      message: "Coupon created successfully",
      data: savedCoupon,
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// PUT - Admin: Update coupon
export const updateCouponController = async (request, response) => {
  try {
    const { _id, name, discountAmount, minOrderAmount, description, showInMarquee, isActive } = request.body;

    if (!_id) {
      return response.status(400).json({
        message: "Coupon _id is required",
        error: true,
        success: false,
      });
    }

    const updateData = {};
    if (name) {
      const cleanName = name.trim().toUpperCase();
      const existing = await CouponModel.findOne({ name: cleanName, _id: { $ne: _id } });
      if (existing) {
        return response.status(400).json({
          message: `Coupon name "${cleanName}" is already in use`,
          error: true,
          success: false,
        });
      }
      updateData.name = cleanName;
    }

    if (discountAmount !== undefined) {
      if (Number(discountAmount) <= 0) {
        return response.status(400).json({
          message: "Discount amount must be greater than 0",
          error: true,
          success: false,
        });
      }
      updateData.discountAmount = Number(discountAmount);
    }

    if (minOrderAmount !== undefined) {
      updateData.minOrderAmount = Number(minOrderAmount) || 0;
    }

    if (description !== undefined) {
      updateData.description = description.trim();
    }

    if (showInMarquee !== undefined) {
      updateData.showInMarquee = Boolean(showInMarquee);
    }

    if (isActive !== undefined) {
      updateData.isActive = Boolean(isActive);
    }

    const updated = await CouponModel.findByIdAndUpdate(_id, updateData, { new: true });

    if (!updated) {
      return response.status(404).json({
        message: "Coupon not found",
        error: true,
        success: false,
      });
    }

    return response.json({
      message: "Coupon updated successfully",
      data: updated,
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// DELETE - Admin: Delete coupon
export const deleteCouponController = async (request, response) => {
  try {
    const { _id } = request.body;

    if (!_id) {
      return response.status(400).json({
        message: "Coupon _id is required",
        error: true,
        success: false,
      });
    }

    const deleted = await CouponModel.findByIdAndDelete(_id);

    if (!deleted) {
      return response.status(404).json({
        message: "Coupon not found",
        error: true,
        success: false,
      });
    }

    return response.json({
      message: "Coupon deleted successfully",
      data: deleted,
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
