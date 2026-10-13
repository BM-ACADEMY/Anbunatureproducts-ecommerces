import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    discountAmount: {
      type: Number,
      required: [true, "Discount amount is required"],
      min: [1, "Discount amount must be at least 1"],
    },
    minOrderAmount: {
      type: Number,
      default: 0,
      min: [0, "Minimum order amount cannot be negative"],
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    showInMarquee: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const CouponModel = mongoose.model("coupon", couponSchema);

export default CouponModel;
