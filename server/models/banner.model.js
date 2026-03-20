import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    desktopImage: {
      type: String,
      required: [true, "Provide desktop image URL"],
    },
    mobileImage: {
      type: String,
      required: [true, "Provide mobile image URL"],
    },
    altText: {
      type: String,
      default: "Banner Image",
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const BannerModel = mongoose.model("Banner", bannerSchema);

export default BannerModel;
