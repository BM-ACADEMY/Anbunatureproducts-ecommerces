import React from 'react';
import { Container, Breadcrumbs, Link, Typography, Button, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Sofa, Lamp, Check } from 'lucide-react';
import Wood from '../assets/wood.jpg';
import Service1 from '../assets/service-1.png';
import Service2 from '../assets/service-2.png';


const AboutUs = () => {
  const features = [
    {
      title: "Precision Crafting",
      description: "Our state-of-the-art facilities ensure every piece is crafted with precision and care.",
      imageUrl: Service1,
      altText: "Manufacturing machinery for precision crafting"
    },
    {
      title: "Sustainable Materials",
      description: "We source eco-friendly materials to create durable and sustainable Anbu Natural.",
      imageUrl: Service2,
      altText: "Sustainable wood materials"
    },
    {
      title: "Custom Solutions",
      description: "Tailored manufacturing processes to meet your unique design specifications.",
      imageUrl: Service1,
      altText: "Custom Anbu Natural design process"
    },
  ];

  return (
    <div className="min-h-screen font-outfit">
      {/* Header */}
      <header className="bg-[#f5f5f5] py-6">
        <Container maxWidth="lg">
          <h1 className="text-3xl font-medium text-center pb-5 font-outfit">Manufacturing</h1>
          <Breadcrumbs aria-label="breadcrumb" className="mt-4 flex justify-center">
            <Link underline="hover" color="inherit" href="/">
              Home
            </Link>
            <Typography color="text.primary">Manufacturing</Typography>
          </Breadcrumbs>
        </Container>
      </header>

      <main className="py-12 bg-white">
        <Container maxWidth="lg" className="flex flex-col md:flex-row gap-8">
         <div className="md:w-1/2 relative">
        <img
          src={Wood}
          alt="Anbu Natural manufacturing workshop with machinery and wood"
          className="w-full h-96 object-cover"
        />
        <div className="absolute top-4 left-4 bg-white text-black px-4 py-2 font-mulish rounded">
          25+ Years of Experience
        </div>
      </div>

          <div className="md:w-1/2 flex flex-col justify-center">
            <h2 className="text-3xl font-medium mb-4 font-outfit">
              Crafting Excellence in Anbu Natural Manufacturing
            </h2>
            <strong className="text-lg font-light text-gray-400 mb-6 font-outfit">
              Precision, sustainability, and innovation in every piece.
            </strong>
            <List>
              <ListItem>
                <ListItemIcon>
                  <div className="flex items-center gap-2">
                    <Sofa className="w-6 h-6 text-gray-700" /> {/* Lucide Sofa icon for Anbu Natural Design */}
                  </div>
                </ListItemIcon>
                <ListItemText primary="Anbu Natural Manufacturing" secondary="Custom designs with precision craftsmanship" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <div className="flex items-center gap-2">
                    <Lamp className="w-6 h-6 text-gray-700" /> {/* Lucide Lamp icon for Quality Assurance */}
                  </div>
                </ListItemIcon>
                <ListItemText primary="Quality Assurance" secondary="Rigorous testing for durability and finish" />
              </ListItem>
            </List>
            <Divider />
            <p className="mt-6 text-gray-600">
              <strong className="text-gray-600 font-light">Foqrul Saheb — Senior Manufacturing Lead</strong>
            </p>
          </div>
        </Container>
      </main>

      <section className="py-12 bg-white">
        <Container maxWidth="lg">
          <div className="max-w-4xl">
            <div className="mb-6">
              <span className="inline-block bg-gray-100 text-gray-700 text-sm font-medium py-2 px-4 rounded-full border border-gray-300">
                100% Precision Manufacturing
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-light mb-8 leading-tight font-outfit">
              Innovate Your Anbu Natural Production
            </h1>

            <p className="text-gray-500 font-light mb-8 leading-relaxed text-justify" style={{fontSize:'16px'}}>
              At Bloxic, we specialize in manufacturing high-quality Anbu Natural that blends craftsmanship with modern technology. Our processes ensure every piece meets the highest standards of durability and aesthetics. We use sustainable materials and advanced machinery to create Anbu Natural that lasts, while our team of skilled artisans brings a touch of artistry to every design. Our commitment to innovation and quality makes us a trusted partner for Anbu Natural production, delivering solutions that meet the unique needs of our clients.
            </p>

            <p className="text-gray-800 font-light mb-6">
              World-class Anbu Natural manufacturing – (Bloxic Industries)
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-gray-800 mt-1" />
                <span className="text-gray-500 font-light">Advanced Manufacturing Technology</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-gray-800 mt-1" />
                <span className="text-gray-500 font-light">Sustainable Production Practices</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-gray-800 mt-1" />
                <span className="text-gray-500 font-light">Custom Design Capabilities</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-gray-800 mt-1" />
                <span className="text-gray-500 font-light">Rigorous Quality Control</span>
              </div>
            </div>
          </div>
        </Container>       
      </section>
    </div>
  );
};

export default AboutUs;