import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";

const BannerSlider = () => {
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await Axios({ ...SummaryApi.getBanners });
      const { data: responseData } = response;
      if (responseData.success) {
        setBanners(responseData.data);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  if (loading) {
    return (
      <div className="w-full aspect-[2/1] md:aspect-[16/4] bg-slate-100 animate-pulse flex items-center justify-center">
        <span className="text-slate-400 font-medium">Loading Banners...</span>
      </div>
    );
  }

  if (banners.length === 0) {
    return null; // Don't show anything if no banners
  }

  return (
    <div className="relative w-full mx-auto overflow-hidden">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div
            key={banner._id}
            className="min-w-full relative aspect-[2/1] md:aspect-[16/4]"
          >
            {banner.link ? (
              <a href={banner.link} target="_blank" rel="noopener noreferrer">
                {/* Desktop Banner (LG) */}
                <img
                  src={banner.desktopImage}
                  alt={banner.altText}
                  className="hidden md:block w-full h-full object-cover"
                />
                {/* Mobile Banner (MD/SM) */}
                <img
                  src={banner.mobileImage}
                  alt={banner.altText}
                  className="block md:hidden w-full h-full object-cover"
                />
              </a>
            ) : (
              <>
                {/* Desktop Banner (LG) */}
                <img
                  src={banner.desktopImage}
                  alt={banner.altText}
                  className="hidden md:block w-full h-full object-cover"
                />
                {/* Mobile Banner (MD/SM) */}
                <img
                  src={banner.mobileImage}
                  alt={banner.altText}
                  className="block md:hidden w-full h-full object-cover"
                />
              </>
            )}
          </div>
        ))}
      </div>

      {/* Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                currentSlide === index ? "bg-white scale-125" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerSlider;
