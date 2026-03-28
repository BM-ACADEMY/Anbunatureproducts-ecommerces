import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { FiZap } from "react-icons/fi";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import Divider from "../components/Divider";
import AddToCartButton from "../components/AddToCartButton";
import CategoryWiseProductDisplay from "../components/CategoryWiseProductDisplay";
import { FaStar } from "react-icons/fa";

// --- StarRating Component ---
const StarRating = ({ value, onChange, readOnly = false, size = "large" }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange && onChange(null, star)}
          className={`${readOnly ? "cursor-default" : "cursor-pointer"} ${
            size === "small" ? "text-sm lg:text-base" : "text-2xl lg:text-3xl"
          } transition-colors`}
        >
          <FaStar
            className={star <= value ? "text-yellow-400" : "text-gray-300"}
          />
        </button>
      ))}
    </div>
  );
};
import { ChevronDown, User } from "lucide-react";
import fetchUserDetails from "../utils/fetchUserDetails";

// --- ReviewsSection Component (moved outside ProductDisplayPage and memoized) ---
const ReviewsSection = ({
  dataReviews,
  visibleReviews,
  handleViewMoreReviews,
  getAvatarColor,
  isReviewModalOpen,
  setIsReviewModalOpen,
  handleReviewSubmit,
  userName,
  setUserName,
  reviewData,
  setReviewData,
  reviewError,
  reviewSuccess,
}) => {
  return (
    <div className="my-10 transition-all duration-300">
      <h6 className="font-bold text-lg text-gray-800 mb-3">Product Review</h6>


      <div className="flex flex-col lg:flex-row gap-6 lg:gap-14 items-start w-full overflow-hidden">
        {/* Left Column: Reviews List */}
        <div className="flex-1 w-full min-w-0 flex flex-col lg:pr-10">
          {dataReviews && dataReviews.length > 0 ? (
            <>
              {dataReviews.slice(0, visibleReviews).map((review, index) => (
                <div
                  key={review._id || index}
                  className="py-5 border-b border-gray-200 flex items-start gap-4 transition-all duration-300 last:border-0"
                >
                  <div className="w-9 h-9 min-w-[36px] rounded-full flex items-center justify-center bg-[#aeb4b7] text-white">
                    <User size={20} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0 mt-0.5">
                    <h6 className="font-bold text-slate-800 text-[15px] break-words">
                      {review.name}
                    </h6>
                    <div className="mt-1">
                      <StarRating
                        value={review.stars}
                        readOnly
                        size="small"
                      />
                    </div>
                    <p className="mt-2 text-[#999999] text-[13px] leading-relaxed break-words">
                      {review.comment}
                    </p>
                  </div>
                </div>
              ))}
              
              {dataReviews.length > visibleReviews && (
                <div className="pt-4 pb-2 flex justify-start">
                  <button
                    onClick={handleViewMoreReviews}
                    className="text-[#648b3b] hover:text-[#4d6c2d] hover:underline transition-all duration-300 text-[13px] font-medium"
                  >
                    View More Reviews
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-[#999999] italic py-4 text-[13px]">
              No reviews yet. Be the first to review this product!
            </p>
          )}
        </div>

        {/* Right Column: Review Form */}
        <div className="lg:w-[480px] w-full bg-white rounded-lg p-4 sm:p-6 md:p-8 border border-gray-200 flex-shrink-0 h-fit lg:sticky lg:top-32">
          <form onSubmit={handleReviewSubmit} className="space-y-6">
            {reviewError && (
              <div className="bg-red-50 text-red-600 p-3 rounded text-[13px]">
                {reviewError}
              </div>
            )}
            {reviewSuccess && (
              <div className="bg-green-50 text-green-600 p-3 rounded text-[13px]">
                {reviewSuccess}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <label className="text-[14px] text-gray-700 w-full sm:w-[80px] sm:text-right flex-shrink-0">
                <span className="text-red-500 mr-1">*</span>Rating:
              </label>
              <div className="flex-1">
                <StarRating
                  value={reviewData.stars}
                  onChange={(event, newValue) => {
                    setReviewData((prev) => ({ ...prev, stars: newValue }));
                  }}
                  size="small"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <label className="text-[14px] text-gray-700 w-full sm:w-[80px] sm:text-right flex-shrink-0">
                <span className="text-red-500 mr-1">*</span>Name:
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                placeholder="Enter Name"
                className="flex-1 w-full border border-gray-200 rounded-md px-3 py-2 outline-none transition-all font-outfit text-[14px] placeholder-gray-300"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
              <label className="text-[14px] text-gray-700 w-full sm:w-[80px] sm:text-right mt-0 sm:mt-2 flex-shrink-0">
                <span className="text-red-500 mr-1">*</span>Comment:
              </label>
              <div className="flex-1 w-full">
                <textarea
                  rows={4}
                  maxLength={250}
                  value={reviewData.comment}
                  onChange={(e) =>
                    setReviewData((prev) => ({ ...prev, comment: e.target.value }))
                  }
                  required
                  placeholder="Enter Message"
                  className="w-full border border-gray-200 rounded-md px-3 py-2 outline-none transition-all resize-none font-outfit text-[14px] placeholder-gray-300"
                />
              </div>
            </div>

            <div className="flex sm:pl-[92px] justify-center sm:justify-start">
              <button
                type="submit"
                className="bg-[#648b3b] text-white rounded-md px-6 py-2 hover:bg-[#4d6c2d] transition-all duration-300 font-medium text-[14px]"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Memoize the ReviewsSection component to prevent unnecessary re-renders
const MemoizedReviewsSection = memo(ReviewsSection);

// --- ProductDisplayPage Component ---
const ProductDisplayPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  let productId = params?.product?.split("-")?.slice(-1)[0];
  const [data, setData] = useState({
    name: "",
    image: [],
    description: "",
    more_details: {},
    attributes: [],
    reviews: [],
    demoVideoLink: "",
  });
  const [image, setImage] = useState(0);
  const [isVideoSelected, setIsVideoSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const imageContainer = useRef();
  const mainImageRef = useRef();
  const [isMainImageHovered, setIsMainImageHovered] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [currentCalculatedPrice, setCurrentCalculatedPrice] = useState(0);
  const [currentCalculatedOriginalPrice, setCurrentCalculatedOriginalPrice] = useState(0);
  const [currentCalculatedStock, setCurrentCalculatedStock] = useState(null);
  const [currentCalculatedUnit, setCurrentCalculatedUnit] = useState("");
  const [priceError, setPriceError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [visibleReviews, setVisibleReviews] = useState(5);
  const [revealedReviewsCount, setRevealedReviewsCount] = useState(5);
  const [userName, setUserName] = useState("");
  const [reviewData, setReviewData] = useState({
    stars: 0,
    comment: "",
  });
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Memoized callback for submitting a review
  const memoizedHandleReviewSubmit = useCallback(async (e) => {
    e.preventDefault();
    setReviewError(null);
    setReviewSuccess(null);

    if (!userName || !reviewData.stars || !reviewData.comment) {
      setReviewError("Please provide your name, rating, and comment.");
      return;
    }
    if (reviewData.stars < 1 || reviewData.stars > 5) {
      setReviewError("Rating must be between 1 and 5 stars.");
      return;
    }

    try {
      const response = await Axios({
        url: SummaryApi.addReview.url,
        method: SummaryApi.addReview.method,
        data: {
          productId,
          name: userName,
          stars: reviewData.stars,
          comment: reviewData.comment,
        },
      });

      if (response.data.success) {
        setReviewSuccess("Review submitted successfully!");
        setReviewData({ stars: 0, comment: "" }); // Reset form
        // Re-fetch product details to update the reviews list
        fetchProductDetails();
        setIsReviewModalOpen(false); // Close the modal on success
      } else {
        setReviewError(response.data.message || "Failed to submit review.");
      }
    } catch (error) {
      setReviewError(error.message || "An error occurred while submitting the review.");
    }
    // Dependencies: Ensure these values are stable or included in the dependency array
  }, [userName, reviewData.stars, reviewData.comment, productId]); // Add productId as a dependency

  // Memoized setters for state management within the modal
  const memoizedSetReviewData = useCallback((updater) => {
    setReviewData(updater);
  }, []);

  const memoizedSetUserName = useCallback((name) => {
    setUserName(name);
  }, []);

  const memoizedSetIsReviewModalOpen = useCallback((isOpen) => {
    setIsReviewModalOpen(isOpen);
  }, []);

  // Memoized callback for "View More Reviews" button
  const memoizedHandleViewMoreReviews = useCallback(() => {
    setVisibleReviews((prev) => prev + 5); // Use functional update for state
    setRevealedReviewsCount((prev) => prev + 5); // Use functional update for state
  }, []);

  // Memoized function for avatar colors (pure, no dependencies)
  const memoizedGetAvatarColor = useCallback((index) => {
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD"];
    return colors[index % colors.length];
  }, []);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: { productId },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        // Sort reviews by createdAt in descending order (newest first)
        const sortedReviews = responseData.data.reviews
          ? [...responseData.data.reviews].sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            )
          : [];
        setData({ ...responseData.data, reviews: sortedReviews });

        if (responseData.data.image && responseData.data.image.length > 0) {
          setImage(0);
        }
        const initialSelectedAttrs = {};
        if (
          responseData.data.attributes &&
          Array.isArray(responseData.data.attributes)
        ) {
          responseData.data.attributes.forEach((attrGroup) => {
            if (attrGroup.options && attrGroup.options.length > 0) {
              initialSelectedAttrs[attrGroup.name] = attrGroup.options[0];
            }
          });
        }
        setSelectedAttributes(initialSelectedAttrs);
      } else {
        AxiosToastError(new Error(responseData.message));
        setPriceError("Failed to load product.");
      }
    } catch (error) {
      AxiosToastError(error);
      setPriceError("Failed to fetch product details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const userDetails = await fetchUserDetails();
      if (userDetails.success) {
        setUserName(userDetails.data.name);
      }
    } catch (error) {
      console.log("User not logged in or error fetching user details:", error);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
      fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]); // Add fetchProductDetails and fetchUser if they are not stable

  useEffect(() => {
    if (data.name) {
      document.title = `${data.name} | Anbu Nature Products`;
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = "description";
        document.head.appendChild(metaDescription);
      }
      const plainDesc = data.description ? data.description.replace(/<[^>]+>/g, '').slice(0, 160) : `Buy ${data.name} online at Anbu Nature Products.`;
      metaDescription.content = plainDesc;
    }
  }, [data.name, data.description]);

  useEffect(() => {
    let totalCalculatedPrice = 0;
    let totalCalculatedOriginalPrice = 0;
    let combinedStock = null;
    let mainUnit = "";
    let firstOptionWithStockFound = false;
    let firstOptionWithUnitFound = false;

    if (data.attributes && Array.isArray(data.attributes)) {
      let hasPrice = false;
      data.attributes.forEach((attrGroup) => {
        const selectedOption = selectedAttributes[attrGroup.name];
        if (selectedOption) {
          const offerPrice = typeof selectedOption.offerPrice === "number" ? selectedOption.offerPrice : (selectedOption.price || 0);
          const originalPrice = typeof selectedOption.originalPrice === "number" ? selectedOption.originalPrice : 0;
          
          if (offerPrice !== undefined) {
            totalCalculatedPrice += offerPrice;
            totalCalculatedOriginalPrice += originalPrice;
            hasPrice = true;
          }
          if (
            selectedOption.stock !== undefined &&
            selectedOption.stock !== null &&
            !firstOptionWithStockFound
          ) {
            combinedStock = selectedOption.stock;
            firstOptionWithStockFound = true;
          } else if (selectedOption.stock === null && !firstOptionWithStockFound) {
            combinedStock = null;
            firstOptionWithStockFound = true;
          }
          if (selectedOption.unit && !firstOptionWithUnitFound) {
            mainUnit = selectedOption.unit;
            firstOptionWithUnitFound = true;
          }
        }
      });

      if (!hasPrice && data.attributes.length > 0) {
        setPriceError("No valid price found for selected attribute options.");
      } else if (data.attributes.length === 0) {
        setPriceError("No attributes available to calculate price.");
      } else {
        setPriceError(null);
      }
    } else {
      setPriceError("No attributes available for this product.");
    }

    setCurrentCalculatedPrice(totalCalculatedPrice);
    setCurrentCalculatedOriginalPrice(totalCalculatedOriginalPrice);
    setCurrentCalculatedStock(combinedStock);
    setCurrentCalculatedUnit(mainUnit);
  }, [data.attributes, selectedAttributes]);

  const handleNextImage = () => {
    setIsFading(true);
    const totalItems = data.image.length + (data.demoVideoLink ? 1 : 0);
    setTimeout(() => {
      if (isVideoSelected) {
        setIsVideoSelected(false);
        setImage(0);
      } else if (image === data.image.length - 1 && data.demoVideoLink) {
        setIsVideoSelected(true);
      } else {
        setImage((prev) => (prev + 1) % data.image.length);
      }
      setIsFading(false);
    }, 200);
  };

  const handlePrevImage = () => {
    setIsFading(true);
    const totalItems = data.image.length + (data.demoVideoLink ? 1 : 0);
    setTimeout(() => {
      if (isVideoSelected) {
        setIsVideoSelected(false);
        setImage(data.image.length - 1);
      } else if (image === 0 && data.demoVideoLink) {
        setIsVideoSelected(true);
      } else {
        setImage((prev) => (prev - 1 + data.image.length) % data.image.length);
      }
      setIsFading(false);
    }, 200);
  };

  const handleScrollRight = () => {
    if (imageContainer.current) {
      imageContainer.current.scrollBy({ left: 100, behavior: "smooth" });
    }
  };

  const handleScrollLeft = () => {
    if (imageContainer.current) {
      imageContainer.current.scrollBy({ left: -100, behavior: "smooth" });
    }
  };

  const handleAttributeClick = (attributeTypeName, optionItem) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeTypeName]: optionItem,
    }));
    setPriceError(null);
  };

  const displayStock = currentCalculatedStock !== null ? currentCalculatedStock : 0;
  const displayUnit = currentCalculatedUnit || "";

  if (!productId || loading) {
    return (
      <section className="container mx-auto p-4">
        <p>Loading product details...</p>
      </section>
    );
  }

  if (!data.name && !loading) {
    return (
      <section className="container mx-auto p-4">
        <p>Product not found.</p>
      </section>
    );
  }

  const handleBuyNow = (e) => {
    e.preventDefault();
    if (user?._id) {
        const item = {
            productId: data,
            product_details: {
                name: data.name,
                image: data.image
            },
            quantity: quantity,
            selectedAttributes: Object.entries(selectedAttributes).map(([name, option]) => ({
                attributeName: name,
                optionName: option.name,
                price: option.offerPrice || option.price,
                stock: option.stock,
                unit: option.unit
            }))
        };
        navigate('/checkout', { state: { singleItem: item } });
    } else {
        toast.error('Please Login to proceed');
        navigate('/login');
    }
  };

  return (
    <section className="bg-transparent">
      <div className="container mx-auto p-3 sm:p-4 grid lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start justify-center">
        {/* Custom Breadcrumb matching product name */}
        <nav className="lg:col-span-12 flex px-0 pb-0 text-gray-700 bg-transparent rounded-lg w-full -mb-4 lg:-mb-8" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-y-1 gap-x-1 md:gap-x-3 w-full">
            <li className="flex items-center flex-shrink-0">
              <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-[#1d9962] transition-colors">
                Home
              </Link>
            </li>
            <li className="flex items-center flex-shrink-0">
               <FaAngleRight className="w-3 h-3 md:w-4 md:h-4 text-gray-400 mx-1 md:mx-2 flex-shrink-0" />
               <span className="text-sm font-medium text-gray-500">
                 Product
               </span>
            </li>
            <li className="flex items-center min-w-0 flex-1" aria-current="page">
               <FaAngleRight className="w-3 h-3 md:w-4 md:h-4 text-gray-400 mx-1 md:mx-2 flex-shrink-0" />
               <span className="text-sm font-medium text-[#1d9962] truncate block">
                 {data.name || "Loading..."}
               </span>
            </li>
          </ol>
        </nav>

        {/* Left Column: Images + Demo Video (Takes 5 columns out of 12) */}
        <div className="lg:sticky lg:top-32 z-30 lg:col-span-5 h-fit self-start">
          <div className="flex flex-col lg:flex-row gap-4 items-center lg:items-start text-center lg:text-left transition-all duration-300">
            
            {/* Thumbnails (Left on Desktop, Bottom on Mobile) */}
            {(data.image.length > 0 || data.demoVideoLink) && (
              <div className="order-2 lg:order-1 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full lg:w-auto lg:min-w-[90px] lg:max-h-[464px] max-w-[344px] lg:max-w-none py-2 px-2 scroll-smooth mx-auto lg:mx-0">
                {data.image.map((img, index) => (
                  <div
                    key={img + index}
                    className={`min-w-[3.5rem] min-h-[3.5rem] w-14 h-14 lg:min-w-[5rem] lg:min-h-[5rem] lg:w-20 lg:h-20 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      index === image
                        ? "border-[#279d68] shadow-md transform lg:scale-105"
                        : "border-transparent hover:border-[#279d68]/50 shadow-sm"
                    }`}
                    onMouseEnter={() => { setImage(index); setIsVideoSelected(false); }}
                    onClick={() => { setImage(index); setIsVideoSelected(false); }}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}

                {/* Video Thumbnail at the end */}
                {data.demoVideoLink && (
                  <div
                    className={`min-w-[3.5rem] min-h-[3.5rem] w-14 h-14 lg:min-w-[5rem] lg:min-h-[5rem] lg:w-20 lg:h-20 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 flex items-center justify-center bg-gray-100 ${
                      isVideoSelected
                        ? "border-[#279d68] shadow-md transform lg:scale-105"
                        : "border-transparent hover:border-[#279d68]/50 shadow-sm"
                    }`}
                    onMouseEnter={() => setIsVideoSelected(true)}
                    onClick={() => setIsVideoSelected(true)}
                  >
                    <div className="flex flex-col items-center justify-center gap-1 text-gray-600">
                       <FiZap className={`text-xl ${isVideoSelected ? "text-[#279d68]" : ""}`} />
                       <span className="text-[10px] font-bold uppercase">Video</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Main Image Display (Right on Desktop, Top on Mobile) */}
            <div
              ref={mainImageRef}
              onMouseEnter={() => setIsMainImageHovered(true)}
              onMouseLeave={() => setIsMainImageHovered(false)}
              className="order-1 lg:order-2 flex-1 rounded-2xl w-full flex items-center justify-center overflow-hidden relative"
            >
              {isVideoSelected && data.demoVideoLink ? (
                 <div className="w-full h-full aspect-video">
                    {data.demoVideoLink.includes('youtube.com') || data.demoVideoLink.includes('youtu.be') ? (
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${data.demoVideoLink.split('v=')[1] || data.demoVideoLink.split('/').pop()}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    ) : data.demoVideoLink.includes('vimeo.com') ? (
                      <iframe
                        src={`https://player.vimeo.com/video/${data.demoVideoLink.split('/').pop()}`}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-white p-6 gap-4 bg-gray-900 border-none outline-none">
                         <a 
                           href={data.demoVideoLink} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="bg-[#ffb703] hover:bg-[#e6a500] text-gray-900 px-8 py-3 rounded-full font-bold transition-all shadow-lg flex items-center gap-2"
                         >
                           Watch Video <FiZap className="inline" />
                         </a>
                      </div>
                    )}
                 </div>
              ) : data.image.length > 0 ? (
                <img
                  src={data.image[image]}
                  className={`w-full max-h-[300px] md:max-h-[400px] lg:max-h-[500px] object-contain rounded-lg ${
                    isFading ? "image-fade-out" : "image-fade-in"
                  }`}
                  alt="product"
                />
              ) : (
                <img
                  src="https://via.placeholder.com/570"
                  className="w-full max-h-[300px] md:max-h-[400px] lg:max-h-[500px] object-contain rounded-lg"
                  alt="placeholder"
                />
              )}

               {/* Navigation Buttons for Main Image */}
              {((data.image.length + (data.demoVideoLink ? 1 : 0)) > 1) && isMainImageHovered && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-[#279d68] hover:text-white transition-all duration-200"
                    aria-label="Previous image"
                  >
                    <FaAngleLeft className="text-lg" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-[#279d68] hover:text-white transition-all duration-200"
                    aria-label="Next image"
                  >
                    <FaAngleRight className="text-lg" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Removed separate demo video section as it is now integrated in the gallery */}
        </div>

        {/* Right Column: Details (Takes 7 columns out of 12) */}
        <div className="lg:col-span-7 p-4 lg:pl-4 text-base lg:text-lg font-outfit">
          <h2 className="text-xl lg:text-3xl font-medium text-gray-700 tracking-tight break-words">
            {data.name}
          </h2>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <FaStar className="text-yellow-400" size={18} />
            <span className="font-semibold text-gray-700">
              {data.reviews && data.reviews.length > 0 
                ? (data.reviews.reduce((acc, r) => acc + r.stars, 0) / data.reviews.length).toFixed(1)
                : "0.0"}
            </span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-500 text-sm">{data.reviews?.length || 0}</span>
          </div>

          {/* Price Block */}
          <div className="mt-4">
            {priceError ? (
              <p className="text-red-500">{priceError}</p>
            ) : currentCalculatedPrice > 0 ? (
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <p className="font-bold text-2xl lg:text-3xl text-gray-900 border-none pb-1 leading-normal">
                    {DisplayPriceInRupees(currentCalculatedPrice)}
                  </p>
                  {currentCalculatedOriginalPrice > currentCalculatedPrice && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-base lg:text-lg text-slate-400 line-through pb-1 leading-normal">
                          {DisplayPriceInRupees(currentCalculatedOriginalPrice)}
                      </p>
                      <span className="bg-red-600 text-white text-[10px] lg:text-xs font-bold py-1 px-3 rounded-full shadow-sm">
                          {Math.round(((currentCalculatedOriginalPrice - currentCalculatedPrice) / currentCalculatedOriginalPrice) * 100)}% OFF
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400">Inclusive of all taxes</p>
              </div>
            ) : (
              <p className="text-red-500 font-outfit">
                Price not available from attributes
              </p>
            )}
            <div className="mt-3">
              <span className="bg-[#5DB02F] text-white text-xs font-bold px-3 py-1.5 rounded disabled:opacity-50">
                Free Shipping
              </span>
            </div>
          </div>

          {/* Attributes / Net Quantity */}
          {data.attributes && data.attributes.length > 0 && (
            <div className="my-6">
              {data.attributes.map((attrGroup) => (
                <div key={attrGroup.name} className="mb-4">
                  <h6 className="text-sm font-semibold mb-2 text-gray-800">
                    {attrGroup.name} :
                  </h6>
                  <div className="flex flex-wrap gap-2">
                    {attrGroup.options.map((option, idx) => {
                      const isSelected = selectedAttributes[attrGroup.name]?.name === option.name;
                      return (
                        <button
                          key={option.name + idx}
                          onClick={() => handleAttributeClick(attrGroup.name, option)}
                          className={`rounded px-4 py-1.5 text-sm font-semibold transition-all duration-200 outline-none
                            ${isSelected 
                              ? "bg-[#5DB02F] text-white shadow-md border-transparent border-2 border-[#5DB02F]" 
                              : "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-400"
                            }
                            active:scale-95
                          `}
                        >
                          {option.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stock Display */}
          {displayStock !== null && displayStock === 0 ? (
            <p className="text-sm font-semibold text-red-500 my-2">Out of Stock</p>
          ) : displayStock !== null ? (
            <p className="text-sm font-semibold text-green-600 my-2">
              In Stock
            </p>
          ) : null}

          {/* Add to Cart & Buy Now */}
          <div className="my-6 w-full lg:w-4/5 xl:w-2/3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <AddToCartButton
                  data={{ ...data, selectedAttributes }}
                  buttonColor="#ffb703"
                  hoverColor="#e6a500"
                  textColor="#111827"
                  fullWidth={true}
                />
              </div>
              <button 
                onClick={handleBuyNow}
                className="flex-1 bg-[#1d9962] hover:bg-[#16794d] text-white font-medium py-2 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98] h-9 lg:h-10 text-sm lg:text-base border-none"
              >
                <FiZap size={18} />
                BUY NOW
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="my-8">
            <h6 className="font-bold text-lg text-gray-800 mb-3 border-b border-gray-200 pb-2">Product Description</h6>
            <p className="text-sm lg:text-base text-justify text-gray-600 leading-relaxed font-light">
              {data.description}
            </p>
          </div>

          {/* Specifications Table */}
          {data?.more_details && Object.keys(data?.more_details).length > 0 && (
            <div className="my-8">
              <h6 className="font-bold text-lg text-gray-800 mb-3">Specifications</h6>
              <div className="border border-gray-300 rounded-md overflow-hidden overflow-x-auto">
                <table className="w-full text-sm text-left min-w-0 sm:min-w-[450px] md:min-w-full">
                  <tbody>
                    {Object.keys(data?.more_details).map((element, index) => (
                      <tr key={element + index} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                        <td className="w-1/3 p-3 font-semibold text-gray-700 bg-gray-50/50 border-r border-gray-200">{element}</td>
                        <td className="p-3 text-gray-600 font-light break-words">{data?.more_details[element]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Storage/Nutrition Section */}
      {(data.storage_instructions || data.storage_image) && (
        <div className="mt-12 mb-8 overflow-hidden relative">
          <div className="paper-edge-top h-5 bg-[#f0f0f0] w-full mb-[-1px]"></div>
          <div className="bg-[#f0f0f0] text-gray-800 p-6 md:p-14 relative z-[2]">
            <div className="container mx-auto grid lg:grid-cols-2 gap-10 items-center">
              {/* Left Side: Image */}
              <div className="flex justify-center order-2 md:order-1">
                {data.storage_image ? (
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gray-300/30 rounded-2xl blur opacity-25"></div>
                    <img 
                      src={data.storage_image} 
                      alt="Storage/Nutrition Information" 
                      className="relative w-full max-h-[250px] md:max-h-[400px] object-contain rounded-xl shadow-2xl border border-gray-200 transform transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gray-200/50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                    <p className="text-gray-500 font-outfit text-center px-4">Quality & Nutrition Information</p>
                  </div>
                )}
              </div>

              {/* Right Side: Content */}
              <div className="flex flex-col gap-6 order-1 md:order-2 min-w-0">
                <div className="space-y-4">
                  <div 
                    className="storage-instructions-content text-gray-800 text-lg md:text-xl leading-relaxed font-outfit whitespace-pre-wrap drop-shadow-sm break-words"
                  >
                    {data.storage_instructions}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="paper-edge-bottom h-5 bg-[#f0f0f0] w-full mt-[-1px]"></div>
        </div>
      )}

      {/* Products that you need (Related Products) */}
      {data.category?.[0] && (
        <div className="container mx-auto my-12">
          <CategoryWiseProductDisplay 
            id={typeof data.category[0] === 'object' ? data.category[0]._id : data.category[0]} 
            name="Products that you need" 
          />
        </div>
      )}

      {/* Full-width Reviews Section at the bottom */}
      <div className="container mx-auto px-3 sm:px-4 mb-16">
        <MemoizedReviewsSection
          dataReviews={data.reviews}
          visibleReviews={visibleReviews}
          handleViewMoreReviews={memoizedHandleViewMoreReviews}
          getAvatarColor={memoizedGetAvatarColor}
          isReviewModalOpen={isReviewModalOpen}
          setIsReviewModalOpen={memoizedSetIsReviewModalOpen}
          handleReviewSubmit={memoizedHandleReviewSubmit}
          userName={userName}
          setUserName={memoizedSetUserName}
          reviewData={reviewData}
          setReviewData={memoizedSetReviewData}
          reviewError={reviewError}
          reviewSuccess={reviewSuccess}
        />
      </div>

    </section>
  );
};

export default ProductDisplayPage;