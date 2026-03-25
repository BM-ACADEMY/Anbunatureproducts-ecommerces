import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import CardLoading from "./CardLoading";
import CardProduct from "./CardProduct";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import useMobile from "../hooks/useMobile";

const HomeProductSection = ({ title, apiEndpoint, isSliderOnMobile = true, barColor = "bg-[#196806]" }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMobile] = useMobile(1024); // Detected as mobile/tablet below 1024px
  const loadingCardNumber = new Array(6).fill(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...apiEndpoint,
        data: { page: 1, limit: 12 },
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
    fetchProducts();
  }, []);

  const sectionId = title.toLowerCase().replace(/\s+/g, '-');
  const prevButtonClass = `swiper-button-prev-${sectionId}`;
  const nextButtonClass = `swiper-button-next-${sectionId}`;

  if (!loading && (!data || data.length === 0)) {
    return null;
  }

  return (
    <div className="mb-12">
    <div className="container mx-auto px-6 lg:px-10 py-4 flex gap-4">
        <div className="flex flex-col items-center">
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center font-medium text-[#1a1a1a] font-outfit text-xl sm:text-2xl md:text-3xl tracking-tight leading-none"
          >
            {title}
          </motion.h3>
        </div>
      </div>

      <div className="relative container mx-auto px-6 lg:px-10 group/section">
        {isSliderOnMobile && isMobile ? (
          <>
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={16}
              watchSlidesProgress={true}
              grabCursor={true}
              slidesPerView={1.2}
              breakpoints={{
                480: { slidesPerView: 1.4 },
                640: { slidesPerView: 2.1 },
                768: { slidesPerView: 2.9 },
                1024: { slidesPerView: 3.0 },
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
                    <SwiperSlide key={`loading-${sectionId}-${index}`}>
                      <CardLoading />
                    </SwiperSlide>
                  ))
                : data.slice(0, 12).map((p, index) => (
                    <SwiperSlide key={`${p._id}-slide-${index}`}>
                      <CardProduct data={p} />
                    </SwiperSlide>
                  ))}
            </Swiper>

            <button
              className={`${prevButtonClass} absolute top-1/2 -left-3 z-10 bg-white hover:bg-gray-100 shadow-lg p-3 rounded-full transform -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity duration-300 hidden md:block`}
              aria-label={`Previous ${title}`}
            >
              <FaAngleLeft className="text-xl text-gray-700" />
            </button>
            <button
              className={`${nextButtonClass} absolute top-1/2 -right-3 z-10 bg-white hover:bg-gray-100 shadow-lg p-3 rounded-full transform -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity duration-300 hidden md:block`}
              aria-label={`Next ${title}`}
            >
              <FaAngleRight className="text-xl text-gray-700" />
            </button>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? loadingCardNumber.map((_, index) => <CardLoading key={`loading-grid-${index}`} />)
              : data.slice(0, 12).map((p) => <CardProduct key={`${p._id}-grid`} data={p} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeProductSection;
