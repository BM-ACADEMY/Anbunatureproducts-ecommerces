import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { valideURLConvert } from "../utils/valideURLConvert";
import { useNavigate } from "react-router-dom";
import CategoryWiseProductDisplay from "../components/CategoryWiseProductDisplay";
import ComboOfferProductDisplay from "../components/ComboOfferProductDisplay";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import AbstractWave from "../assets/vectors/vector1.png";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

import {
  Box,
  useMediaQuery,
  useTheme,
  Skeleton,
  Typography,
} from "@mui/material";
import BannerSlider from "../components/BannerSlider";

const Home = () => {
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector((state) => state.product.allSubCategory);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // This is md breakpoint for MUI, which is 960px

  const swiperRef = useRef(null);

  const handleRedirectProductListpage = (id, cat) => {
    if (!subCategoryData || subCategoryData.length === 0) {
      console.warn("Subcategory data not available yet.");
      const url = `/${valideURLConvert(cat)}-${id}`;
      navigate(url);
      return;
    }

    const subcategory = subCategoryData.find((sub) =>
      sub.category.some((c) => c._id === id)
    );

    if (subcategory) {
      const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(
        subcategory.name
      )}-${subcategory._id}`;
      navigate(url);
    } else {
      const url = `/${valideURLConvert(cat)}-${id}`;
      navigate(url);
      console.warn(
        `No specific subcategory found for category ID: ${id}. Navigating to general category page.`
      );
    }
  };

  return (
    <section className="mb-48">
      {/* Banner Section */}
      <BannerSlider />

      {/* Categories Section - Now a Swiper Carousel */}
      <Box
        sx={{
          maxWidth: {
            xs: "100%",
            sm: "800px",
            md: "1100px",
            lg: "1400px",
            xl: "1800px",
          },
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          // Adjusted vertical margin (my) to reduce overall section height
          my: 4, // Reduced from 8 to 4
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#fff",
        }}
      >

        {loadingCategory ? (
          <Box
            sx={{ display: "flex", gap: { xs: 1, md: 2 }, overflow: "hidden" }}
          >
            {new Array(isMobile ? 3 : 6).fill(null).map((_, index) => (
              <Box
                key={index + "loadingcategory"}
                sx={{
                  flexShrink: 0,
                  width: { xs: "30%", sm: "20%", md: "16.66%" },
                  minWidth: { xs: "100px", sm: "120px" },
                  backgroundColor: "white",
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Skeleton
                  variant="circular"
                  // Adjusted Skeleton width/height to make circles smaller
                  width={isMobile ? 70 : 90} // Reduced from 80/100 to 70/90
                  height={isMobile ? 70 : 90} // Reduced from 80/100 to 70/90
                />
                <Skeleton
                  variant="text"
                  width="80%"
                  height={20}
                  sx={{ mt: 1 }}
                />
              </Box>
            ))}
          </Box>
        ) : (
          <Box
            className="fade-container"
            sx={{
              position: "relative",
            }}
          >
            <Swiper
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              modules={[Autoplay, Navigation]}
              spaceBetween={isMobile ? 10 : 15}
              loop={true}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
                easing: "cubic-bezier(0.8, 0, 0.2, 1)",
              }}
              navigation={false}
              breakpoints={{
                320: { slidesPerView: 3, spaceBetween: 10 },
                480: { slidesPerView: 4, spaceBetween: 10 },
                640: { slidesPerView: 5, spaceBetween: 15 },
                768: { slidesPerView: 6, spaceBetween: 15 },
                1024: { slidesPerView: 7, spaceBetween: 10 },
              }}
              className="categorySwiper"
            >
              {categoryData.map((cat, index) => (
                <SwiperSlide key={cat._id + "displayCategory"}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() =>
                      handleRedirectProductListpage(cat._id, cat.name)
                    }
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      // Adjusted padding to reduce category item height
                      padding: isMobile ? "1em" : "1.5em", // Reduced from 1.5em/2em
                      borderRadius: "8px",
                      backgroundColor: "white",
                      boxShadow: "none",
                    }}
                  >
                    <Box
                      sx={{
                        // Adjusted image container width/height
                        width: { xs: 70, sm: 80, md: 100, lg: 110, xl: 120 }, // Reduced from 90/100/130/140/150
                        height: { xs: 70, sm: 80, md: 100, lg: 110, xl: 120 }, // Reduced
                        mx: "auto",
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "2px solid #e0e0e0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={cat.image}
                        className="w-full h-full object-cover"
                        alt={cat.name}
                        loading="lazy"
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        textAlign: "center",
                        color: "text.secondary",
                        mt: 1, // Adjusted margin top for text, reduced from 1.5
                        fontWeight: "medium",
                        lineHeight: "1.2",
                        px: 0.5,
                        minHeight: "2.4em", // Reduced minHeight for text
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {cat.name}
                    </Typography>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        )}
      </Box>

      {/* Category Wise Product Display */}
      {categoryData?.map((c) => (
        <CategoryWiseProductDisplay
          key={c?._id + "CategorywiseProduct"}
          id={c?._id}
          name={c?.name}
        />
      ))}

      {/* Combo Offer Product Display */}
      <ComboOfferProductDisplay />
    </section>
  );
};

export default Home;