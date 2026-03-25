import React from "react";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { Link } from "react-router-dom";
import { valideURLConvert } from "../utils/valideURLConvert";
import AddToCartButton from "./AddToCartButton";
import { formatReviewCount } from "../utils/formatReviewCount";
const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          className={`text-lg ${
            index < Math.round(rating) ? "text-amber-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

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
          unit: attrGroup.options[0].unit || attrGroup.options[0].name || "",
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
    displayUnit = firstOption?.unit || firstOption?.name || "";
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
    <div className="flex flex-col bg-white shadow-md w-full max-w-[450px] h-[520px] mx-auto rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 my-4 group/card">
      <Link
        to={url}
        className="flex flex-col flex-grow h-full"
        aria-label={`View ${data.name} product`}
      >
        <div className="relative w-full h-64 md:h-72 overflow-hidden bg-gray-50">
          <div className="absolute top-0 left-0 flex flex-col z-10">
            {comboOffer && (
              <div className="bg-[#ea242b] mb-2 text-white text-[10px] md:text-xs font-semibold px-2.5 py-1.5 rounded-br-lg w-fit">
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
            className={`w-full h-full object-cover transition-opacity duration-700 ${data.image.length > 1 ? 'group-hover/card:opacity-0' : ''}`}
            loading="lazy"
          />
          {data.image.length > 1 && (
            <img
              src={data.image[1]}
              alt={`${data.name} hover view`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"
              loading="lazy"
            />
          )}
        </div>

        <div className="p-4 font-outfit flex flex-col flex-grow">
          <div className="flex items-center mb-1.5">
            <StarRating rating={averageRating} />
            <p className="ml-1.5 text-[0.85rem] text-gray-500">
              {reviewCount > 0 ? `(${formattedReviewCount} reviews)` : "(No reviews)"}
            </p>
          </div>

          <h3 className="text-slate-900 text-[16px] font-bold line-clamp-2 leading-snug mb-1.5">
            {data.name}
          </h3>

          <div className="mt-auto pt-2 flex flex-col gap-1">
            {displayUnit && (
              <p className="text-[0.85rem] font-bold text-[#419864]/80 uppercase tracking-wider">
                {displayUnit}
              </p>
            )}
            <div className='flex items-baseline gap-2'>
              <p className="text-[#16a34a] font-bold text-xl leading-none">
                {DisplayPriceInRupees(displayPrice)}
              </p>
              {displayOriginalPrice > displayPrice && (
                <p className="text-slate-400 line-through text-xs font-medium">
                  {DisplayPriceInRupees(displayOriginalPrice)}
                </p>
              )}
              
            </div>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4 pt-1">
        {displayStock !== null && displayStock <= 0 ? (
          <div className="w-full py-2.5 text-center text-sm font-bold text-red-600 bg-red-50 rounded-lg">
            Out of stock
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            <AddToCartButton
              data={{ ...data, selectedAttributes }}
              buttonColor="#f97316"
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
