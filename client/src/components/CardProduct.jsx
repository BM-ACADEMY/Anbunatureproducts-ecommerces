import React from "react";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { Link } from "react-router-dom";
import { valideURLConvert } from "../utils/valideURLConvert";
import AddToCartButton from "./AddToCartButton";
import { Rating, Typography, Box } from "@mui/material";
import { formatReviewCount } from "../utils/formatReviewCount"; // Import the new utility

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
      : 4; // Default to 4 if no reviews

  // Calculate the review count using the new utility function
  const reviewCount = reviews ? reviews.length : 0;
  const formattedReviewCount = formatReviewCount(reviewCount);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col bg-white shadow-md w-full max-w-[320px] rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
        <Link
          to={url}
          className="flex flex-col h-full"
          aria-label={`View ${data.name} product`}
        >
          <div className="relative w-full h-48 md:h-64 overflow-hidden">
            <div className="absolute top-0 left-0 flex flex-col z-10">
              {comboOffer && (
                <div className="bg-[#ea242b] text-white text-[10px] md:text-xs font-semibold px-2 py-1 rounded-br-lg w-fit">
                  Combo offer
                </div>
              )}
              {displayOriginalPrice > displayPrice && (
                <div className="bg-green-600 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-br-lg w-fit shadow-sm">
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

          <div className="p-4 font-outfit flex flex-col flex-grow text-sm min-h-[150px]">
            <div className='flex items-center gap-2'>
              <p className="text-green-700 font-bold text-lg">
                {DisplayPriceInRupees(displayPrice)}
              </p>
              {displayOriginalPrice > displayPrice && (
                <p className="text-slate-400 line-through text-sm">
                  {DisplayPriceInRupees(displayOriginalPrice)}
                </p>
              )}
            </div>
            <h3 className="text-slate-800 text-base font-medium my-1.5 line-clamp-2 leading-snug">
              {data.name}
            </h3>
            {data.description && (
              <p className="text-slate-500 line-clamp-1">{data.description}</p>
            )}
            {/* Display rating and reviews count always */}
            <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 0 }}>
              <Rating
                value={averageRating}
                precision={0.1}
                readOnly
                size="small"
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ ml: 0.5 }}
              >
                {/* Use the formattedReviewCount */}
                {reviewCount > 0 ? `(${formattedReviewCount} reviews)` : "(No reviews)"}
              </Typography>
            </Box>

            <div className="mt-auto"></div>
          </div>
        </Link>

        <div className="px-4 pb-4">
          {displayStock !== null && displayStock <= 0 ? (
            <div className="w-full py-2 text-center text-sm font-medium text-red-600 bg-red-50 rounded-lg">
              Out of stock
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              <AddToCartButton
                data={{ ...data, selectedAttributes }}
                buttonColor="#196806"
                hoverColor="#104a02"
                textColor="#f8fafc"
                fullWidth
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardProduct;