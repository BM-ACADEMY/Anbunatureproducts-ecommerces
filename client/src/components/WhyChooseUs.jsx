import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import useMobile from "../hooks/useMobile";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// Import assets
import manImg from "../assets/whychoose/man.png";
import leafImg from "../assets/whychoose/leaf.png";
import chemicalImg from "../assets/whychoose/chemical.png";
import truckImg from "../assets/whychoose/truck.png";

const features = [
  {
    icon: leafImg,
    title: "100% organic",
  },
  {
    icon: manImg,
    title: "Direct from farmers",
  },
  {
    icon: chemicalImg,
    title: "Zero chemicals",
  },
  {
    icon: truckImg,
    title: "Door step delivery",
  },
];

const WhyChooseUs = () => {
  const [isMobile] = useMobile(768); // Using the project's hook instead of MUI

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4 lg:max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[1.5rem] md:text-[2.25rem] font-medium text-center mb-1 md:mb-10 font-outfit text-[#1a1a1a] tracking-tight">
            Why buy with Anbu Nature Products?
          </h2>
        </motion.div>

        {isMobile ? (
          <div className="pb-10">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={20}
              slidesPerView={2}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              breakpoints={{
                320: { slidesPerView: 2, spaceBetween: 15 },
                480: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 20 },
              }}
            >
              {features.map((feature, index) => (
                <SwiperSlide key={index}>
                  <div className="flex flex-col items-center text-center p-2">
                    <div className="w-[80px] h-[80px] mb-3 flex items-center justify-center">
                      <img
                        src={feature.icon}
                        alt={feature.title}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <p className="font-semibold font-outfit text-[#333] text-[0.85rem] leading-tight">
                      {feature.title}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="flex justify-between items-start gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-1 flex flex-col items-center text-center"
              >
                <div className="w-[120px] h-[120px] mb-5 flex items-center justify-center">
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <p className="font-semibold font-outfit text-[#333] text-[1.1rem] max-w-[150px] leading-tight">
                  {feature.title}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WhyChooseUs;
