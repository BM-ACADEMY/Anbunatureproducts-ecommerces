import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import { useParams } from "react-router-dom";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import Divider from "../components/Divider";
import AddToCartButton from "../components/AddToCartButton";
import {
  Box,
  Chip,
  Typography,
  Rating,
  Button,
  Avatar,
  TextField,
  FormControl,
  Alert,
  Modal,
} from "@mui/material";
import { ChevronDown } from "lucide-react";
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
    <Box
      sx={{
        my: 4,
        p: 3,
        borderRadius: "12px",
        transition: "all 0.3s ease",
      }}
    >
      <Typography
        variant="h6"
        fontWeight="medium"
        sx={{ mb: 2, color: "#1e293b" }}
      >
        Customer Reviews
      </Typography>

      {/* Button to open the review submission modal */}
      <Button
        variant="contained"
        onClick={() => setIsReviewModalOpen(true)}
        sx={{
          backgroundColor: "#1d9962",
          color: "#ffffff",
          borderRadius: "10px",
          px: 3,
          py: 1.5,
          mb: 4,
          "&:hover": {
            backgroundColor: "#16794d",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        Write a Review
      </Button>

      {/* Review Submission Modal */}
      <Modal
        open={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        aria-labelledby="review-modal-title"
        aria-describedby="review-modal-description"
      >
        <Box
          key="review-form-modal-content" // Keep this key for modal content stability
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 450, md: 500 },
            bgcolor: "background.paper",
            borderRadius: "12px",
            boxShadow: 24,
            p: 4,
            outline: "none",
          }}
        >
          <Typography id="review-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            Submit Your Review
          </Typography>
          <Box
            component="form"
            onSubmit={handleReviewSubmit}
            sx={{
              p: 1,
            }}
          >
            {reviewError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {reviewError}
              </Alert>
            )}
            {reviewSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {reviewSuccess}
              </Alert>
            )}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                label="Your Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                variant="outlined"
                disabled={!!userName}
                required
              />
            </FormControl>
            <FormControl sx={{ mb: 2 }}>
              <Typography component="legend" sx={{ mb: 1 }}>
                Rating
              </Typography>
              <Rating
                value={reviewData.stars}
                onChange={(event, newValue) => {
                  setReviewData((prev) => ({ ...prev, stars: newValue }));
                }}
                size="large"
                required
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                label="Your Comment"
                multiline
                rows={4}
                value={reviewData.comment}
                onChange={(e) =>
                  setReviewData((prev) => ({ ...prev, comment: e.target.value }))
                }
                variant="outlined"
                required
              />
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#1d9962",
                color: "#ffffff",
                borderRadius: "10px",
                px: 3,
                py: 1.5,
                "&:hover": {
                  backgroundColor: "#16794d",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              Submit Review
            </Button>
            <Button
              onClick={() => setIsReviewModalOpen(false)}
              variant="outlined"
              sx={{
                ml: 2,
                borderRadius: "10px",
                borderColor: "#d1d5db",
                color: "#4b5563",
                "&:hover": {
                  borderColor: "#a1a1aa",
                  backgroundColor: "#f3f4f6",
                },
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Existing Reviews */}
      {dataReviews && dataReviews.length > 0 ? (
        <Box>
          {dataReviews.slice(0, visibleReviews).map((review, index) => (
            <Box
              key={review._id || index} // Use _id for unique identification
              sx={{
                mb: 2,
                p: 2,
                background: "white",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "flex-start",
                gap: 2,
                transition: "transform 0.2s ease, opacity 0.5s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.08)",
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: getAvatarColor(index),
                  width: 40,
                  height: 40,
                  fontSize: "1rem",
                  fontWeight: "medium",
                }}
              >
                {review.name.slice(0, 2).toUpperCase()}
              </Avatar>
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight="medium"
                  sx={{ color: "#1e293b" }}
                >
                  {review.name}
                </Typography>
                <Rating
                  value={review.stars}
                  readOnly
                  size="small"
                  sx={{ my: 0.5 }}
                />
                <Typography variant="body2" sx={{ mt: 1, color: "#4b5563" }}>
                  {review.comment}
                </Typography>
                {review.createdAt && (
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ mt: 0.5, display: "block" }}
                  >
                    Reviewed on: {new Date(review.createdAt).toLocaleDateString()}
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
          {dataReviews.length > visibleReviews && (
            <Button
              variant="outlined"
              onClick={handleViewMoreReviews}
              sx={{
                mt: 2,
                minWidth: 0,
                px: 1.5,
                py: 1,
                borderRadius: "10px",
                borderWidth: "2px",
                borderColor: "#1d9962",
                color: "#3b82f6",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#1d9962",
                  color: "#ffffff",
                  borderColor: "#1d9962",
                  boxShadow: "0 2px 6px rgba(59, 130, 246, 0.4)",
                },
              }}
            >
              <ChevronDown size={18} />
            </Button>
          )}
        </Box>
      ) : (
        <Typography
          variant="body1"
          sx={{ color: "#6b7280", fontStyle: "italic" }}
        >
          No reviews yet. Be the first to review!
        </Typography>
      )}
    </Box>
  );
};

// Memoize the ReviewsSection component to prevent unnecessary re-renders
const MemoizedReviewsSection = memo(ReviewsSection);

// --- ProductDisplayPage Component ---
const ProductDisplayPage = () => {
  const params = useParams();
  let productId = params?.product?.split("-")?.slice(-1)[0];
  const [data, setData] = useState({
    name: "",
    image: [],
    description: "",
    more_details: {},
    attributes: [],
    reviews: [],
  });
  const [image, setImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const imageContainer = useRef();
  const mainImageRef = useRef();
  const [isMainImageHovered, setIsMainImageHovered] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [currentCalculatedPrice, setCurrentCalculatedPrice] = useState(0);
  const [currentCalculatedStock, setCurrentCalculatedStock] = useState(null);
  const [currentCalculatedUnit, setCurrentCalculatedUnit] = useState("");
  const [priceError, setPriceError] = useState(null);
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
    let totalCalculatedPrice = 0;
    let combinedStock = null;
    let mainUnit = "";
    let firstOptionWithStockFound = false;
    let firstOptionWithUnitFound = false;

    if (data.attributes && Array.isArray(data.attributes)) {
      let hasPrice = false;
      data.attributes.forEach((attrGroup) => {
        const selectedOption = selectedAttributes[attrGroup.name];
        if (selectedOption) {
          if (typeof selectedOption.price === "number" && !isNaN(selectedOption.price)) {
            totalCalculatedPrice += selectedOption.price;
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
    setCurrentCalculatedStock(combinedStock);
    setCurrentCalculatedUnit(mainUnit);
  }, [data.attributes, selectedAttributes]);

  const handleNextImage = () => {
    setIsFading(true);
    setTimeout(() => {
      setImage((prev) => (prev + 1) % data.image.length);
      setIsFading(false);
    }, 200);
  };

  const handlePrevImage = () => {
    setIsFading(true);
    setTimeout(() => {
      setImage((prev) => (prev - 1 + data.image.length) % data.image.length);
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

  return (
    <section className="bg-[#16794d0a]">
      <div className="container mx-auto p-4 grid lg:grid-cols-2 gap-8">
        <div className="relative">
          {/* Main Image Display */}
          <div
            ref={mainImageRef}
            onMouseEnter={() => setIsMainImageHovered(true)}
            onMouseLeave={() => setIsMainImageHovered(false)}
            className="lg:min-h-[65vh] lg:max-h-[65vh] rounded-lg min-h-56 max-h-56 h-full w-full flex items-center justify-center overflow-hidden relative"
          >
            {data.image.length > 0 ? (
              <img
                src={data.image[image]}
                className={`w-full h-full object-contain rounded-lg ${
                  isFading ? "image-fade-out" : "image-fade-in"
                }`}
                alt="product"
              />
            ) : (
              <img
                src="https://via.placeholder.com/150"
                className="w-full h-full object-contain rounded-lg"
                alt="placeholder"
              />
            )}

            {/* Navigation Buttons for Main Image */}
            {data.image.length > 1 && isMainImageHovered && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Previous image"
                >
                  <FaAngleLeft className="text-gray-600 text-lg" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Next image"
                >
                  <FaAngleRight className="text-gray-600 text-lg" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Indicators (Dots) */}
          {data.image.length > 1 && (
            <div className="flex items-center justify-center gap-2 my-3">
              {data.image.map((_, index) => (
                <div
                  key={index}
                  className={`w-1 h-1 lg:w-2 lg:h-2 rounded-full transition-all duration-300 ${
                    index === image ? "bg-green-500 scale-125" : "bg-gray-300"
                  }`}
                ></div>
              ))}
            </div>
          )}

          {/* Scrollable Thumbnail Strip */}
          {data.image.length > 0 && (
            <div className="grid relative mt-3">
              <div
                ref={imageContainer}
                className="flex gap-3 z-10 relative w-full overflow-x-auto scrollbar-none px-5 py-2"
              >
                {data.image.map((img, index) => (
                  <div
                    key={img + index}
                    className={`w-20 h-20 min-h-20 min-w-20 cursor-pointer rounded-lg overflow-hidden shadow-md transition-all duration-300 ${
                      index === image
                        ? "ring-2 ring-green-500"
                        : "hover:ring-2 hover:ring-green-300"
                    }`}
                    onMouseEnter={() => setImage(index)}
                    onClick={() => setImage(index)}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-contain hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
              <div className="w-full h-full flex justify-between absolute items-center px-2">
                <button
                  onClick={handleScrollLeft}
                  className="z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Scroll thumbnails left"
                >
                  <FaAngleLeft className="text-gray-600" />
                </button>
                <button
                  onClick={handleScrollRight}
                  className="z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Scroll thumbnails right"
                >
                  <FaAngleRight className="text-gray-600" />
                </button>
              </div>
            </div>
          )}
          <Box sx={{ display: { xs: "none", md: "none", lg: "block" } }}>
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
          </Box>
        </div>

        <div className="p-4 lg:pl-7 text-base lg:text-lg">
          <h2 className="text-lg font-light font-outfit lg:text-3xl">
            {data.name}
          </h2>

          <Divider />
          <div>
            <p className="font-outfit">Price</p>
            <div className="flex items-center gap-2 lg:gap-4">
              {priceError ? (
                <p className="text-red-500">{priceError}</p>
              ) : currentCalculatedPrice > 0 ? (
                <div className="py-2 rounded w-fit">
                  <p className="font-medium font-outfit text-lg lg:text-xl">
                    {DisplayPriceInRupees(currentCalculatedPrice)}
                  </p>
                </div>
              ) : (
                <p className="text-red-500 font-outfit">
                  Price not available from attributes
                </p>
              )}
            </div>
          </div>

          {data.attributes && data.attributes.length > 0 && (
            <Box sx={{ my: 2 }}>
              {data.attributes.map((attrGroup) => (
                <Box key={attrGroup.name} sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    className="font-outfit mb-3 text-gray-800"
                  >
                    {attrGroup.name}
                  </Typography>
                  <Box
                    className="font-outfit"
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}
                  >
                    {attrGroup.options.map((option, idx) => {
                      const isSelected =
                        selectedAttributes[attrGroup.name]?.name === option.name;
                      return (
                        <Chip
                          key={option.name + idx}
                          label={option.name}
                          onClick={() => handleAttributeClick(attrGroup.name, option)}
                          sx={{
                            cursor: "pointer",
                            borderRadius: "15px",
                            fontWeight: isSelected ? 600 : 500,
                            py: 1.5,
                            fontSize: "0.9rem",
                            borderWidth: "0.6px",
                            borderStyle: "solid",
                            transition: "all 0.25s ease-in-out",
                            backgroundColor: isSelected ? "#e0f2f1" : "#ffffff",
                            borderColor: isSelected ? "#26a69a" : "#d1d5db",
                            color: isSelected ? "#00796b" : "#4b5563",
                            "&:hover": {
                              backgroundColor: isSelected ? "#b2dfdb" : "#f3f4f6",
                              borderColor: isSelected ? "#00796b" : "#a1a1aa",
                              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                              transform: "translateY(-2px)",
                            },
                            "&:active": {
                              transform: "translateY(0)",
                              boxShadow: "none",
                              backgroundColor: isSelected ? "#80cbc4" : "#e5e7eb",
                            },
                          }}
                        />
                      );
                    })}
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {displayStock !== null && displayStock === 0 ? (
            <p className="text-lg text-red-500 font-outfit my-2">Out of Stock</p>
          ) : displayStock !== null ? (
            <p className="text-lg text-green-600 font-outfit my-2">
              In Stock: {displayStock} {displayUnit}
            </p>
          ) : (
            <p className="text-lg font-outfit text-neutral-500 my-2">
              Stock information not available.
            </p>
          )}

          <div className="my-4">
            <AddToCartButton
              data={{ ...data, selectedAttributes }}
              buttonColor="#475569"
              hoverColor="#334155"
              textColor="#f8fafc"
            />
          </div>

          <div className="my-4 grid gap-3">
            <div>
              <p className="font-medium font-outfit">Description</p>
              <p className="text-base text-gray-700 leading-relaxed break-words">
                {data.description}
              </p>
            </div>
            {data?.more_details && Object.keys(data?.more_details).length > 0 && (
              <>
                <p className="font-medium font-outfit">Requirements</p>
                {Object.keys(data?.more_details).map((element, index) => (
                  <div key={element + index}>
                    <p className="font-base font-outfit">{element}</p>
                    <p className="text-base font-light font-outfit">
                      {data?.more_details[element]}
                    </p>
                  </div>
                ))}
              </>
            )}
          </div>
          <Box sx={{ display: { xs: "block", md: "block", lg: "none" } }}>
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
          </Box>
        </div>
      </div>
    </section>
  );
};

export default ProductDisplayPage;