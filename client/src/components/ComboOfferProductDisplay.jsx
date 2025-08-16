// ComboOfferProductDisplay.jsx
import React, { useEffect, useState } from "react";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import { motion } from "framer-motion";
import SummaryApi from "../common/SummaryApi";
import CardLoading from "./CardLoading";
import CardProduct from "./CardProduct";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Import your banner images
import mobileComboBanner from "../assets/banners/bannermobile2.png"; // Adjust path as needed
import desktopComboBanner from "../assets/banners/banner3.png"; // Adjust path as needed

// Import your new corner image
import CornerVectorImage from "../assets/vectors/vector.png"; // <--- NEW IMPORT: Adjust this path to your desired image

const ComboOfferProductDisplay = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadingCardNumber = new Array(6).fill(null);

  const fetchComboOfferProducts = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getComboOfferProducts,
        data: { page: 1, limit: 10 },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComboOfferProducts();
  }, []);

  // Unique class names for navigation buttons
  const prevButtonClass = `swiper-button-prev-combo`;
  const nextButtonClass = `swiper-button-next-combo`;

  // If not loading and no data, don't render the component
  if (!loading && data.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      {/* Banner Section - This now includes the heading AND the images */}
      <div className="container mx-auto px-4 py-4">
        {/* Banner Container with relative positioning for the corner image */}
        <div className="relative mb-4"> {/* Added relative here for corner image positioning */}
          {/* Corner Image */}
          <img
            src={CornerVectorImage}
            alt="Decorative corner design"
            className="absolute top-0 left-0 z-20" // Z-index higher than banner images
            style={{
              width: "clamp(60px, 15vw, 150px)", // Responsive width: min 60px, max 150px, fluid 15vw
              height: "auto",
              opacity: 1, // Adjust opacity as needed
            }}
          />

          {/* Mobile Banner (visible on small screens) */}
          <img
            src={mobileComboBanner}
            alt="Combo Offers Mobile"
            className="w-full h-auto rounded-lg shadow-md md:hidden"
          />

          {/* Desktop Banner (hidden on small screens, visible on medium and up) */}
          <img
            src={desktopComboBanner}
            alt="Combo Offers Desktop"
            className="w-full h-auto rounded-lg shadow-md hidden md:block"
          />
        </div>


        <div className="flex items-center space-x-2 mb-3 pt-5">
          {/* Added mb-4 for spacing below heading */}
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true }}
            className="block w-1 h-6 md:h-8 bg-teal-600 rounded-lg"
          ></motion.span>
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true }}
            className="font-sans text-xl sm:text-xl md:text-2xl lg:text-3xl font-medium tracking-normal text-gray-800"
          >
            Combo Offers
          </motion.h3>
        </div>
      </div>

      {/* Product Swiper Section */}
      <div className="relative container mx-auto px-4 group">
        {" "}
        {/* Added group for hover effect on buttons */}
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
          }}
          navigation={{
            nextEl: `.${nextButtonClass}`,
            prevEl: `.${prevButtonClass}`,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          style={{
            "--swiper-pagination-color": "#16a34a",
            "--swiper-pagination-bullet-inactive-color": "#d1d5db",
            "--swiper-pagination-bullet-inactive-opacity": "0.5",
            "--swiper-pagination-bullet-size": "8px",
            "--swiper-pagination-bullet-horizontal-gap": "4px",
          }}
          className="mySwiper"
        >
          {loading
            ? loadingCardNumber.map((_, index) => (
                <SwiperSlide key={"ComboOfferProductDisplay123" + index}>
                  <CardLoading />
                </SwiperSlide>
              ))
            : data.map((p, index) => (
                <SwiperSlide key={p._id + "ComboOfferProductDisplay" + index}>
                  <CardProduct data={p} />
                </SwiperSlide>
              ))}
        </Swiper>
        {/* Navigation buttons: Added opacity and transition for hover effect */}
        <button
          className={`${prevButtonClass} absolute top-1/2 -left-3 z-10 bg-white hover:bg-gray-100 shadow-lg p-3 rounded-full transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block`}
          aria-label="Previous combo offer products"
        >
          <FaAngleLeft className="text-xl text-gray-700" />
        </button>
        <button
          className={`${nextButtonClass} absolute top-1/2 -right-3 z-10 bg-white hover:bg-gray-100 shadow-lg p-3 rounded-full transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block`}
          aria-label="Next combo offer products"
        >
          <FaAngleRight className="text-xl text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default ComboOfferProductDisplay;