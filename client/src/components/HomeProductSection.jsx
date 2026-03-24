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

const HomeProductSection = ({ title, apiEndpoint, barColor = "bg-[#196806]" }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
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
      <div className="max-w-[1800px] mx-auto p-4 flex items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true }}
            className={`block w-1 h-6 md:h-8 ${barColor} rounded-lg`}
          ></motion.span>
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true }}
            className="font-sans text-xl sm:text-xl md:text-2xl lg:text-3xl font-medium tracking-normal text-gray-800"
          >
            {title}
          </motion.h3>
        </div>
      </div>

      <div className="relative max-w-[1800px] mx-auto px-4 group">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={16}
          slidesPerView={1.2}
          breakpoints={{
            480: { slidesPerView: 1.5 },
            640: { slidesPerView: 2.2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 3.5 },
            1280: { slidesPerView: 4 },
            1536: { slidesPerView: 5 },
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
            : data.map((p, index) => (
                <SwiperSlide key={`${p._id}-slide-${index}`}>
                  <CardProduct data={p} />
                </SwiperSlide>
              ))}
        </Swiper>

        <button
          className={`${prevButtonClass} absolute top-1/2 -left-3 z-10 bg-white hover:bg-gray-100 shadow-lg p-3 rounded-full transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block`}
          aria-label={`Previous ${title}`}
        >
          <FaAngleLeft className="text-xl text-gray-700" />
        </button>
        <button
          className={`${nextButtonClass} absolute top-1/2 -right-3 z-10 bg-white hover:bg-gray-100 shadow-lg p-3 rounded-full transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block`}
          aria-label={`Next ${title}`}
        >
          <FaAngleRight className="text-xl text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default HomeProductSection;
