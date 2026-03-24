import React from "react";
import { Box, Typography, Container, useTheme, useMediaQuery } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { motion } from "framer-motion";

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
    icon: manImg,
    title: "Direct from farmers",
  },
  {
    icon: leafImg,
    title: "100% organic",
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: "white" }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 500,
              mb: { xs: 4, md: 8 },
              fontFamily: "'Outfit', sans-serif",
              color: "#1a1a1a",
              fontSize: { xs: "1.5rem", md: "2.25rem" },
            }}
          >
            Why buy with Anbu Nature Products?
          </Typography>
        </motion.div>

        {isMobile ? (
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
            style={{ paddingBottom: "40px" }}
          >
            {features.map((feature, index) => (
              <SwiperSlide key={index}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    p: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 80, md: 120 },
                      height: { xs: 80, md: 120 },
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={feature.icon}
                      alt={feature.title}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontFamily: "'Outfit', sans-serif",
                      color: "#333",
                      fontSize: "0.85rem",
                      lineHeight: 1.2,
                    }}
                  >
                    {feature.title}
                  </Typography>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 2,
            }}
          >
            {features.map((feature, index) => (
              <Box
                key={index}
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                sx={{
                  flex: "1 1 20%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    fontFamily: "'Outfit', sans-serif",
                    color: "#333",
                    fontSize: "1.1rem",
                    maxWidth: "150px",
                    lineHeight: 1.3,
                  }}
                >
                  {feature.title}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default WhyChooseUs;
