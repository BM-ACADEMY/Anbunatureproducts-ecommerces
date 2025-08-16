import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { Quote } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';

const testimonials = [
  {
    quote: "The other hand we denounce with righteou indg ation and dislike men who are so beguiled and demoralied by the of pleasure of the moment. Dislike men who are so beguiled demoraliz worlds ed by the charms of pleasure of the moment. Lorem i sum dolor sit",
    author: "Fogul Saheb",
  },
  {
    quote: "The other hand we denounce with righteou indg ation and dislike men who are so beguiled and demoralied by the of pleasure of the moment. Dislike men who are so beguiled demoraliz worlds ed by the charms of pleasure of the moment. Lorem i sum dolor sit",
    author: "Fogul Saheb",
  },
  {
    quote: "The other hand we denounce with righteou indg ation and dislike men who are so beguiled and demoralied by the of pleasure of the moment. Dislike men who are so beguiled demoraliz worlds ed by the charms of pleasure of the moment. Lorem i sum dolor sit",
    author: "Fogul Saheb",
  },
];

const TestimonialSlider = () => {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4" style={{ cursor: 'pointer' }}>
      <h2 className="text-2xl text-gray-600 font-light font-outfit text-center pt-5 mb-3">Testimonials</h2>
      
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation={false}
        modules={[Autoplay]}
        className="mySwiper"
      >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white rounded-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <span className="text-gray-400 text-2xl">"</span>
                <Quote className="w-6 h-6 text-gray-400" />
                <span className="text-gray-400 text-2xl">"</span>
              </div>
              <p className="text-gray-500 font-light font-outfit text-center mb-6 text-1sm">
                {testimonial.quote}
              </p>
              <p className="text-gray-500 font-light font-outfit text-1sm">-{" "}
                {testimonial.author}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TestimonialSlider;