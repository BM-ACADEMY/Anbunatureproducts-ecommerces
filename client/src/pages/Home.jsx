import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { valideURLConvert } from "../utils/valideURLConvert";
import { useNavigate } from "react-router-dom";
import HomeProductSection from "../components/HomeProductSection";
import SummaryApi from "../common/SummaryApi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import useMobile from "../hooks/useMobile";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

import BannerSlider from "../components/BannerSlider";
import WhyChooseUs from "../components/WhyChooseUs";
import FounderSection from "../components/FounderSection";
import TestimonialSection from "../components/TestimonialSection";


const Home = () => {
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector((state) => state.product.allSubCategory);
  const navigate = useNavigate();
  const [isMobile] = useMobile(960);

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
    <section className="bg-[#fcf8ed]">
      {/* Banner Section */}
      <BannerSlider />

      {/* Categories Section - Universal Slidable Carousel with Full Circle Hover */}
      <div className="container mx-auto px-6 lg:px-10 mt-4 sm:mt-6 md:mt-10 mb-2 relative flex flex-col items-center">


        {loadingCategory ? (
          <div className="flex justify-center gap-4 overflow-hidden w-full">
            {new Array(isMobile ? 3 : 6).fill(null).map((_, index) => (
              <div
                key={index + "loadingcategory"}
                className="flex-shrink-0 w-[110px] sm:w-[130px] lg:w-[150px] bg-white p-4 flex flex-col items-center gap-2"
              >
                <div className="w-[80px] sm:w-[100px] lg:w-[120px] h-[80px] sm:h-[100px] lg:h-[120px] rounded-full bg-gray-50 animate-pulse" />
                <div className="w-[60%] h-4 bg-gray-50 animate-pulse rounded mt-2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="fade-container relative w-full flex justify-center">
            {/* Universal Swiper for all screen sizes */}
            <Swiper
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                modules={[Autoplay, Navigation]}
                spaceBetween={20}
                slidesPerView="auto"
                centerInsufficientSlides={true}
                loop={categoryData.length > 8}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                navigation={false}
                breakpoints={{
                  320: { slidesPerView: 3, spaceBetween: 15 },
                  480: { slidesPerView: 4, spaceBetween: 20 },
                  768: { slidesPerView: 5, spaceBetween: 25 },
                  1024: { slidesPerView: 7, spaceBetween: 30 },
                  1440: { slidesPerView: 8, spaceBetween: 40 },
                }}
                className="categorySwiper w-full px-2 sm:px-4 pt-6"
              >
                {categoryData.map((cat, index) => (
                  <SwiperSlide 
                    key={cat._id + "displayCategory"}
                    style={{ width: 'auto' }}
                  >
                    <motion.div
                      whileHover={{ y: -8 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      onClick={() =>
                        handleRedirectProductListpage(cat._id, cat.name)
                      }
                      className="cursor-pointer pt-4 flex flex-col items-center justify-center p-1 sm:p-2 min-w-[90px] xs:min-w-[110px] sm:min-w-[130px] md:min-w-[150px] group"
                    >
                      <div className="w-[80px] xs:w-[90px] sm:w-[110px] lg:w-[130px] h-[80px] xs:h-[90px] sm:h-[110px] lg:h-[130px] mx-auto rounded-full overflow-hidden relative flex items-center justify-center shadow-lg border-2 border-transparent transition-all duration-500 bg-white">
                        <img
                          src={cat.image}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          alt={cat.name}
                          loading="lazy"
                        />
                        {/* Full Circle Dark Hover Overlay */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-0 group-hover:scale-100 rounded-full">
                           <span className="text-white font-bold text-[0.65rem] xs:text-[0.7rem] sm:text-[0.8rem] lg:text-[0.9rem] uppercase text-center leading-tight font-outfit tracking-wider drop-shadow-md">
                             {cat.name}
                           </span>
                        </div>
                      </div>
                      <span className="text-center text-gray-500 mt-2 sm:mt-4 font-semibold text-[0.7rem] sm:text-[0.8rem] lg:text-[0.9rem] tracking-wide">
                        {cat.productCount || 0} Item
                      </span>
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
          </div>
        )}
      </div>

      {/* Specialized Product Sections */}
      <HomeProductSection
        title="New Arrivals"
        apiEndpoint={SummaryApi.getRecentProducts}
        isSliderOnMobile={false}
        barColor="bg-blue-600"
      />

      <HomeProductSection
        title="Trending Products"
        apiEndpoint={SummaryApi.getTrendingProducts}
        barColor="bg-orange-500"
      />

      {/* Mega Combo Deals Overlay */}
      <div className="py-8 md:py-12">
        <HomeProductSection
          title="Mega Combo Deals"
          apiEndpoint={SummaryApi.getMegaComboProducts}
          barColor="bg-purple-600"
        />
      </div>

      <WhyChooseUs />
      <FounderSection />
      <TestimonialSection />

    </section>
  );
};

export default Home;