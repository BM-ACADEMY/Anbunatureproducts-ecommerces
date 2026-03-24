import React from "react";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { Link } from "react-router-dom";
import { valideURLConvert } from "../utils/valideURLConvert";
import AddToCartButton from "./AddToCartButton";
import { Rating, Typography, Box } from "@mui/material";
import { formatReviewCount } from "../utils/formatReviewCount";

const CardProduct = ({ data }) => {
  const url = `/product/${valideURLConvert(data.name)}-${data._id}`;
  const { comboOffer, reviews } = data;

  let displayPrice = 0;
  let displayOriginalPrice = 0;
  let displayUnit = "";
  let displayStock = 0;

  const selectedAttributes =
    data.attributes?.reduce((acc, attrGroup) => {
      if (attrGroup.options?.length > 0) {
        acc[attrGroup.name] = {
          name: attrGroup.options[0].name,
          price: attrGroup.options[0].price || 0,
          stock: attrGroup.options[0].stock,
          unit: attrGroup.options[0].unit || "",
        };
      }
      return acc;
    }, {}) || {};

  if (data.attributes?.length > 0) {
    const firstOption = data.attributes[0]?.options?.[0];
    displayPrice =
      typeof firstOption?.offerPrice === "number" ? firstOption.offerPrice : (firstOption?.price || 0);
    displayOriginalPrice =
      typeof firstOption?.originalPrice === "number" ? firstOption.originalPrice : 0;
    displayUnit = firstOption?.unit || "";
    displayStock =
      typeof firstOption?.stock === "number" ? firstOption.stock : null;
  }

  if (displayStock === null && data.stock != null) {
    displayStock = data.stock;
  } else if (displayStock === null) {
    displayStock = 0;
  }

  const averageRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length
      : 4;

  const reviewCount = reviews ? reviews.length : 0;
  const formattedReviewCount = formatReviewCount(reviewCount);

  return (
    <div className="flex flex-col bg-white shadow-md w-full max-w-[360px] h-[500px] mx-auto rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 my-4">
      <Link
        to={url}
        className="flex flex-col flex-grow h-full"
        aria-label={`View ${data.name} product`}
      >
        <div className="relative w-full h-64 md:h-72 overflow-hidden bg-gray-50">
          <div className="absolute top-0 left-0 flex flex-col z-10">
            {comboOffer && (
              <div className="bg-[#ea242b] text-white text-[10px] md:text-xs font-semibold px-2.5 py-1.5 rounded-br-lg w-fit">
                Combo offer
              </div>
            )}
            {displayOriginalPrice > displayPrice && (
              <div className="bg-[#DC0000] text-white text-[10px] md:text-xs font-bold px-2.5 py-1.5 rounded-br-lg w-fit shadow-sm">
                {Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)}% OFF
              </div>
            )}
          </div>
          <img
            src={data.image[0]}
            alt={data.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="p-4 font-outfit flex flex-col flex-grow">
          {/* Price aligned to image style */}
          <div className='flex items-end gap-2 mb-1.5'>
            <p className="text-[#419864] font-bold text-xl leading-none">
              {DisplayPriceInRupees(displayPrice)}
            </p>
            {displayOriginalPrice > displayPrice && (
              <p className="text-slate-400 line-through text-sm font-medium mb-[1px]">
                {DisplayPriceInRupees(displayOriginalPrice)}
              </p>
            )}
          </div>

          {/* Title */}
          <h3 className="text-slate-900 text-[16px] font-bold line-clamp-2 leading-snug">
            {data.name}
          </h3>

          {/* Description removed as requested */}

          {/* Ratings pushed to the bottom of this container if title is short */}
          <Box sx={{ display: "flex", alignItems: "center", mt: "auto", pt: 1.5 }}>
            <Rating
              value={averageRating}
              precision={0.1}
              readOnly
              size="small"
              sx={{ color: "#f59e0b" }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ ml: 0.5, fontSize: "0.85rem" }}
            >
              {reviewCount > 0 ? `(${formattedReviewCount} reviews)` : "(No reviews)"}
            </Typography>
          </Box>
        </div>
      </Link>

      {/* Action Button */}
      <div className="px-4 pb-4 pt-1">
        {displayStock !== null && displayStock <= 0 ? (
          <div className="w-full py-2.5 text-center text-sm font-bold text-red-600 bg-red-50 rounded-lg">
            Out of stock
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            <AddToCartButton
              data={{ ...data, selectedAttributes }}
              buttonColor="#f97316" // Orange color from image
              hoverColor="#ea580c"
              textColor="#ffffff"
              fullWidth
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CardProduct;
