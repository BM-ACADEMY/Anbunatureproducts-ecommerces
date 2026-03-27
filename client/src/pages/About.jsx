// import React from "react";
// import {
//   Container,
//   Breadcrumbs,
//   Link,
//   Typography,
//   Button,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
// } from "@mui/material";
// import { Leaf, Shield, Hand, Book, Heart, Check } from "lucide-react";
// import AboutImage from "../assets/about.png"; // Update with appropriate image
// // import TestimonialSlider from "./Reviews";
// import { Link as RouterLink } from 'react-router-dom';


// const AboutUs = () => {
//   const features = [
//     {
//       title: "100% Natural & Herbal Ingredients",
//       description:
//         "Crafted with pure, herbal, and organic ingredients, free from chemicals and preservatives.",
//       icon: <Leaf className="w-6 h-6 text-green-600" />,
//     },
//     {
//       title: "No Chemicals, No Artificial Preservatives",
//       description:
//         "Completely free from harmful chemicals and synthetic additives for safe use.",
//       icon: <Shield className="w-6 h-6 text-green-600" />,
//     },
//     {
//       title: "Made in Small Batches with Quality & Care",
//       description:
//         "Handcrafted in small batches to ensure consistent quality and attention to detail.",
//       icon: <Hand className="w-6 h-6 text-green-600" />,
//     },
//     {
//       title: "Inspired by Traditional Indian Wisdom",
//       description:
//         "Rooted in time-tested Indian recipes for holistic health, skincare, and haircare.",
//       icon: <Book className="w-6 h-6 text-green-600" />,
//     },
//     {
//       title: "Focused on Health, Family, and Sustainability",
//       description:
//         "Promoting wellness for families and sustainable practices for communities.",
//       icon: <Heart className="w-6 h-6 text-green-600" />,
//     },
//   ];

//   return (
//     <div className="min-h-screen font-outfit">
//       {/* Header */}
//       <header className="bg-[#f5f5f5] py-6">
//         <Container maxWidth="lg">
//           <h1 className="text-3xl font-medium text-center pb-5 font-outfit">
//             About Anbu Natural
//           </h1>
//           <Breadcrumbs
//             aria-label="breadcrumb"
//             className="mt-4 flex justify-center"
//           >
//             <Link underline="hover" color="inherit" href="/">
//               Home
//             </Link>
//             <Typography color="text.primary">About Us</Typography>
//           </Breadcrumbs>
//         </Container>
//       </header>

//       {/* Main Section */}
//       <main className="py-12 bg-white">
//         <Container maxWidth="lg" className="flex flex-col md:flex-row gap-8">
//           <div className="md:w-1/2 relative">
//             <img
//               src={AboutImage}
//               alt="Anbu Natural products"
//               className="w-full h-96 object-cover rounded-lg"
//             />
//             <div className="absolute top-4 left-4 bg-white text-green-600 px-4 py-2 font-mulish rounded">
//               Inspired by Nature
//             </div>
//           </div>

//           <div className="md:w-1/2 flex flex-col justify-center">
//             <h2 className="text-3xl font-medium mb-4 font-outfit">
//               Bringing Back Nature, Rooted in Love
//             </h2>
//             <strong className="text-lg font-light text-gray-400 mb-6 font-outfit">
//               Stay Organic, Stay Natural
//             </strong>
//             <p className="text-gray-600 mb-4">
//               At Anbu Natural, we believe true wellness begins with what we put
//               into and onto our bodies. Our handcrafted products use natural,
//               herbal, and organic ingredients that are safe, effective, and
//               chemical-free.
//             </p>
//             <p className="text-gray-600">
//               What started as a small dream is now a growing movement to make
//               natural living affordable and accessible to every home. We
//               specialize in creating products for daily health, baby care, women
//               wellness, skincare, and haircare, using time-tested recipes passed
//               down through generations. Every batch is made with love, purity,
//               and purpose. From millet health mixes to herbal hair oils and
//               sanitary napkins, every product is made with love, ensuring
//               purity, safety, and sustainability.
//             </p>
//           </div>
//         </Container>
//       </main>

//       {/* Mission & Vision Section */}
//       <section className="py-12 bg-[#f7f7f7]">
//         <Container maxWidth="lg">
//           <div className="max-w-4xl mx-auto">
//             <div className="mb-6">
//               <span className="inline-block bg-green-100 text-green-600 text-sm font-medium py-2 px-4 rounded-full border border-green-300">
//                 Our Mission
//               </span>
//             </div>
//             <h2 className="text-3xl md:text-4xl font-light mb-4 font-outfit">
//               Safe, Natural, and Affordable Wellness
//             </h2>
//             <p className="text-gray-600 font-light mb-6">
//               To provide safe, natural, and affordable products that improve the
//               health and lives of individuals and families — while supporting
//               traditional farming and women empowerment.
//             </p>
//             <h3 className="text-xl font-medium mb-4 font-outfit">Our Vision</h3>
//             <p className="text-gray-600 font-light">
//               To become a trusted household name in herbal and natural wellness
//               across India and the world, while continuing to innovate and
//               empower communities.
//             </p>
//           </div>
//         </Container>
//       </section>

//       {/* Why Choose Us */}
//       <section className="py-12 bg-white">
//         <Container maxWidth="lg">
//           <h2 className="text-3xl font-medium mb-8 text-center font-outfit">
//             Why Choose Anbu Natural?
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {features.map((feature, index) => (
//               <div
//                 key={index}
//                 className="bg-[#f7f7f7] rounded-lg transition-all duration-300 overflow-hidden flex flex-col items-center hover:bg-green-50"
//               >
//                 <div className="p-6 text-center w-full">
//                   <div className="flex justify-center mb-4">{feature.icon}</div>
//                   <h3 className="text-xl font-medium font-outfit text-gray-800 mb-4">
//                     {feature.title}
//                   </h3>
//                   <p className="text-gray-400 font-light font-outfit">
//                     {feature.description}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Container>
//       </section>

//       {/* Anbu Care Trust */}
//       <section className="py-12 bg-[#f5f5f5]">
//         <Container maxWidth="lg">
//           <h2 className="text-3xl font-medium mb-4 text-center font-outfit">
//             Expanding Our Mission Through Anbu Care Trust
//           </h2>
//           <p className="text-gray-600 text-center mb-6 max-w-3xl mx-auto">
//             Anbu Natural is not just a business — it's a mission. Through our
//             registered non-profit trust, Anbu Care Trust, we extend our love and
//             care to the needy, malnourished children, pregnant mothers, and
//             underprivileged communities in rural areas. We believe everyone
//             deserves health, dignity, and support — no matter their background.
//           </p>
//           <div className="py-10">
//             <h2 className="text-3xl font-medium mb-8 text-center font-outfit">
//               Our Mission
//             </h2>
//             <div className="flex justify-center">
//               <List className="w-full max-w-2xl space-y-2">
//                 <ListItem>
//                   <ListItemIcon>
//                     <Check className="w-5 h-5 text-green-600" />
//                   </ListItemIcon>
//                   <ListItemText primary="Provide free nutrition kits to undernourished children and pregnant women" />
//                 </ListItem>
//                 <ListItem>
//                   <ListItemIcon>
//                     <Check className="w-5 h-5 text-green-600" />
//                   </ListItemIcon>
//                   <ListItemText primary="Distribute herbal health mixes, sanitary napkins, and baby care packs to low-income families" />
//                 </ListItem>
//                 <ListItem>
//                   <ListItemIcon>
//                     <Check className="w-5 h-5 text-green-600" />
//                   </ListItemIcon>
//                   <ListItemText primary="Conduct wellness education camps in villages and slums" />
//                 </ListItem>
//                 <ListItem>
//                   <ListItemIcon>
//                     <Check className="w-5 h-5 text-green-600" />
//                   </ListItemIcon>
//                   <ListItemText primary="Empower women with health awareness and training in natural product making" />
//                 </ListItem>
//               </List>
//             </div>
//           </div>

//           <p className="text-gray-600 text-center mt-6 mb-6 max-w-3xl mx-auto">
//             When you buy a product from Anbu Natural, a portion of your support
//             goes directly to serve someone in need.
//           </p>
//           <div className="mb-6 text-center">
//             <span className="inline-block bg-green-100 text-green-600 text-sm font-medium py-2 px-4 rounded-full border border-green-300">
//               Our Concern
//             </span>
//           </div>
//           <p className="text-gray-600 text-center mb-6 max-w-3xl mx-auto">
//             To create a healthier, more conscious world — where natural wellness
//             and compassionate service go hand in hand.
//           </p>
//         </Container>
//       </section>

//       {/* Join Our Journey */}
//       <section className="py-12 bg-white">
//         <Container maxWidth="lg">
//           <h2 className="text-3xl font-medium mb-4 text-center font-outfit">
//             Join Our Journey
//           </h2>
//           <p className="text-gray-600 text-center mb-6 max-w-3xl mx-auto">
//             Support local. Support natural. Support purpose. Together with our
//             customers, partners, and community, we aim to build a brand with
//             soul and a mission with action.
//           </p>
//           <h3 className="text-xl font-medium mb-4 text-center font-outfit">
//             Let's Grow Together
//           </h3>
//           <p className="text-gray-600 text-center mb-6 max-w-3xl mx-auto">
//             When you choose Anbu Natural, you’re not just buying a product —
//             you're joining a community that values health, honesty, and
//             heritage.
//           </p>
//           <div className="text-center mt-6">
//             <button
//   component={RouterLink}
//   to="/"
//   className="bg-green-600 hover:bg-green-700 p-2 text-white mr-4"
// >
//   Shop With Us
// </button>
//           </div>
//         </Container>
//       </section>

//     </div>
//   );
// };

// export default AboutUs;





import React from "react";
import {
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Leaf, Shield, Hand, Book, Heart, Check } from "lucide-react";
import AboutImage from "../assets/about.png"; 
import { Link as RouterLink } from 'react-router-dom';
import { FaLeaf, FaEye } from "react-icons/fa";


const AboutUs = () => {
  const features = [
    {
      title: "100% Natural & Herbal Ingredients",
      description: "Crafted with pure, herbal, and organic ingredients, free from chemicals and preservatives.",
      icon: <Leaf className="w-6 h-6 text-green-600" />,
    },
    {
      title: "No Chemicals, No Artificial Preservatives",
      description: "Completely free from harmful chemicals and synthetic additives for safe use.",
      icon: <Shield className="w-6 h-6 text-green-600" />,
    },
    {
      title: "Made in Small Batches with Quality & Care",
      description: "Handcrafted in small batches to ensure consistent quality and attention to detail.",
      icon: <Hand className="w-6 h-6 text-green-600" />,
    },
    {
      title: "Inspired by Traditional Indian Wisdom",
      description: "Rooted in time-tested Indian recipes for holistic health, skincare, and haircare.",
      icon: <Book className="w-6 h-6 text-green-600" />,
    },
    {
      title: "Focused on Health, Family, and Sustainability",
      description: "Promoting wellness for families and sustainable practices for communities.",
      icon: <Heart className="w-6 h-6 text-green-600" />,
    },
  ];

  return (
    <div className="min-h-screen font-outfit">
      
      {/* Hero Section */}
      <div className="relative w-full overflow-hidden pt-10">
        {/* Background SVG Pattern */}
        <svg className="size-full absolute -z-10 inset-0" width="1440" height="720" viewBox="0 0 1440 720" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path stroke="#5ab14b3f" strokeOpacity=".7" d="M-15.227 702.342H1439.7" />
          <circle cx="711.819" cy="372.562" r="308.334" stroke="#5ab14b3f" strokeOpacity=".7" />
          <circle cx="16.942" cy="20.834" r="308.334" stroke="#5ab14b3f" strokeOpacity=".7" />
          <path stroke="#5ab14b3f" strokeOpacity=".7" d="M-15.227 573.66H1439.7M-15.227 164.029H1439.7" />
          <circle cx="782.595" cy="411.166" r="308.334" stroke="#5ab14b3f" strokeOpacity=".7" />
        </svg>

        <Container maxWidth="lg" className="relative z-10">
          <div className="flex flex-col max-md:gap-16 md:flex-row pb-20 items-center justify-between mt-10">
            <div className="flex flex-col items-center md:items-start md:pr-8">              
             <h1 className="text-center md:text-left text-3xl leading-tight md:text-4xl md:leading-[1.2] lg:text-5xl lg:leading-[1.2] font-semibold max-w-xl text-slate-900 mt-6 font-outfit">
        Bringing Back Nature, <br className="hidden md:block" /> Rooted in Love.
      </h1>
              
              <div className="space-y-4 text-center md:text-left text-base text-slate-600 max-w-lg mt-6 font-outfit leading-relaxed">
                <p>
                  At Anbu Natural, we believe true wellness begins with what we put into and onto our bodies. 
                  Our handcrafted products use natural, herbal, and organic ingredients that are safe, effective, and chemical-free.
                </p>
                <p>
                  What started as a small dream is now a movement to make natural living affordable and accessible. 
                  From millet health mixes to herbal hair oils and baby care, every batch is made with purity, safety, and purpose.
                </p>
              </div>
              
              <div className="flex items-center gap-4 mt-10 text-sm font-outfit">
                <RouterLink 
                  to="/all-products"
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center active:scale-95 transition-all rounded-md px-8 h-12 font-medium"
                >
                  Shop Now
                </RouterLink>
              </div>
            </div>
            
            <div className="relative mt-10 md:mt-0">
              <img 
                src={AboutImage} 
                alt="Anbu Natural Products" 
                className="w-full max-w-xs sm:max-w-sm lg:max-w-md rounded-2xl shadow-2xl transition-all duration-300 object-cover h-[500px]" 
              />
            </div>
          </div>
        </Container>
      </div>

      {/* Mission & Vision Section */}
       <section className="py-20 bg-gradient-to-b from-[#fdf5e6] to-white">
      <Container maxWidth="lg">
        <div className="grid md:grid-cols-2 gap-10">

          {/* Mission Card */}
          <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition duration-300 border border-[#f1dcd6]">
            <div className="flex items-start gap-4">
              <div className="bg-[#cb2800]/10 p-4 rounded-2xl text-[#cb2800] text-2xl">
                <FaLeaf />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-slate-800 mb-3">
                  Our Mission
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  To provide safe, natural, and affordable products that improve
                  the health and lives of individuals and families — while
                  supporting traditional farming and women empowerment.
                </p>
              </div>
            </div>
          </div>

          {/* Vision Card */}
          <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition duration-300 border border-[#f1dcd6]">
            <div className="flex items-start gap-4">
              <div className="bg-[#cb2800]/10 p-4 rounded-2xl text-[#cb2800] text-2xl">
                <FaEye />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-slate-800 mb-3">
                  Our Vision
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  To become a trusted household name in herbal and natural
                  wellness across India and the world, while continuing to
                  innovate and empower communities.
                </p>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </section>

      {/* Why Choose Us */}
     <section className="py-20 bg-white">
  <Container maxWidth="lg">
    <h2 className="text-4xl font-medium mb-16 text-center font-outfit text-slate-900">
      Why Choose Anbu Natural?
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {features.map((feature, index) => (
        <div
          key={index}
          className="group max-w-sm mx-auto border border-slate-300 p-8 rounded-2xl transition-all duration-300 flex flex-col items-center text-center bg-green-50 hover:shadow-xl hover:-translate-y-1"
        >
          <div className="flex justify-center mb-6 bg-white p-4 rounded-full shadow-sm group-hover:scale-110 transition-transform">
            {feature.icon}
          </div>

          <h3 className="text-xl font-semibold font-outfit text-slate-800 mb-4">
            {feature.title}
          </h3>

          <p className="text-slate-500 font-light font-outfit leading-relaxed">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  </Container>
</section>

      {/* Anbu Care Trust Section */}
      <section className="py-20 bg-[#f1f5f1]">
        <Container maxWidth="lg">
          <div className="text-center mb-12">
             <h2 className="text-3xl md:text-4xl font-medium mb-6 font-outfit text-slate-900">
              Expanding Our Mission Through Anbu Care Trust
            </h2>
            <p className="text-slate-600 text-lg mb-6 max-w-3xl mx-auto leading-relaxed">
              Anbu Natural is more than a brand — it's a mission of love. Through our
              registered non-profit, **Anbu Care Trust**, we support malnourished children, 
              expectant mothers, and underprivileged rural communities.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-green-100 max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold mb-8 text-center text-green-800">Our Direct Impact</h3>
            <List className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Free nutrition kits for undernourished children",
                "Support for pregnant women in rural areas",
                "Distribution of herbal health mixes & baby care",
                "Wellness education camps in villages",
                "Women empowerment through skill training",
                "Sanitary napkin distribution for hygiene"
              ].map((item, i) => (
                <ListItem key={i} className="items-start">
                  <ListItemIcon className="min-w-[40px]">
                    <Check className="w-6 h-6 text-green-500" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={item} 
                    primaryTypographyProps={{ className: "text-slate-700 font-medium" }}
                  />
                </ListItem>
              ))}
            </List>
          </div>
        </Container>
      </section>

      {/* Final Call to Action */}
      <section className="py-24 border-t border-slate-100">
        <Container maxWidth="md" className="text-center">
          <h2 className="text-4xl font-medium mb-6 font-outfit">
            Let’s Grow Together
          </h2>
          <p className="text-slate-600 text-lg mb-10 leading-relaxed">
            When you choose Anbu Natural, you’re joining a community that values health, honesty, and heritage. 
            Support local. Support natural. Support purpose.
          </p>
          <RouterLink
            to="/contact"
            className="inline-block bg-green-700 hover:bg-green-800 text-white rounded-full px-10 py-4 transition-all hover:px-12 font-bold text-lg shadow-md"
          >
            Join Our Journey
          </RouterLink>
        </Container>
      </section>
    </div>
  );
};

export default AboutUs;