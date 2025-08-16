import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

// Desktop banners
import banner from "../assets/banners/banner1.png";
import banner2 from "../assets/banners/banner2.png";

// Mobile banners
import bannerMobile from "../assets/banners/bannermobile1.png";
import bannerMobile2 from "../assets/banners/bannermobile2.png";

const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Media query to check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // lg = 1024px
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Banners by device
  const mobileBanners = [
    { id: 1, src: bannerMobile, alt: "New Arrivals - Mobile Exclusive" },
    { id: 2, src: bannerMobile2, alt: "Festival Offers - Limited Time Only" },
  ];

  const desktopBanners = [
    { id: 1, src: banner, alt: "Premium Cloths Collection" },
    { id: 2, src: banner2, alt: "Summer Sale - Up to 40% Off" },
  ];

  const banners = isMobile ? mobileBanners : desktopBanners;

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="relative w-full max-w-[1800px] mx-auto px-4 py-8 overflow-hidden">
      <div className="relative h-96 md:h-[420px] rounded-xl overflow-hidden  group">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentSlide
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <img
              src={banner.src}
              alt={banner.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            
          </div>
        ))}

        {/* Navigation Buttons - show on hover */}
        {/* Left Button */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all duration-300 hover:scale-110 z-10 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
        >
          <ChevronLeft />
        </button>

        {/* Right Button */}
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all duration-300 hover:scale-110 z-10 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
        >
          <ChevronRight />
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/80"
              } transition-all duration-300`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerSlider;
