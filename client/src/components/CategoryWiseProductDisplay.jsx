import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import CardLoading from "./CardLoading";
import CardProduct from "./CardProduct";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const CategoryWiseProductDisplay = ({ id, name }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadingCardNumber = new Array(6).fill(null);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: { page: 1, limit: 10, categoryId: id },
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
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const prevButtonClass = `swiper-button-prev-${id}`;
  const nextButtonClass = `swiper-button-next-${id}`;

  // Conditional rendering: Only render if not loading AND data is available
  if (!loading && (!data || data.length === 0)) {
    return null; // Don't render anything if there are no products
  }

  return (
    <div className="mb-12">
      <div className="container mx-auto p-4 flex items-center justify-between gap-4">
        <div class="flex items-center space-x-2">
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true }}
            class="block w-1 h-6 md:h-8 bg-[#196806] rounded-lg"
          ></motion.span>
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true }}
            class="font-sans text-xl sm:text-xl md:text-2xl lg:text-3xl font-medium tracking-normal text-gray-800"
          >
            {name}
          </motion.h3>
        </div>
      </div>

      <div className="relative container mx-auto px-4">
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
                <SwiperSlide key={"loading-" + id + index}>
                  <CardLoading />
                </SwiperSlide>
              ))
            : data.map((p, index) => (
                <SwiperSlide key={p._id + "-slide-" + index}>
                  <CardProduct data={p} />
                </SwiperSlide>
              ))}
        </Swiper>

        {/* Navigation buttons */}
        <button
          className={`${prevButtonClass} absolute top-1/2 left-0 z-10 bg-white hover:bg-gray-100 shadow-lg p-3 rounded-full transform -translate-y-1/2`}
          aria-label={`Previous ${name} products`}
        >
          <FaAngleLeft className="text-xl text-gray-700" />
        </button>
        <button
          className={`${nextButtonClass} absolute top-1/2 right-0 z-10 bg-white hover:bg-gray-100 shadow-lg p-3 rounded-full transform -translate-y-1/2`}
          aria-label={`Next ${name} products`}
        >
          <FaAngleRight className="text-xl text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default CategoryWiseProductDisplay;
