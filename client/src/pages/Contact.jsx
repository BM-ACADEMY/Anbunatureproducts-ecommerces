import React from 'react';
import { Container, Breadcrumbs, Link, Typography } from '@mui/material';
import { Mail, Phone, Instagram } from 'lucide-react';
import ContactForm from '../components/ContactUs';

const Contact = () => {
  return (
    <div className="min-h-screen font-outfit">
      <header className="bg-[#f5f5f5] py-6">
        <Container maxWidth="lg">
          <h1 className="text-3xl font-medium text-center pb-5 font-outfit">Contact Us</h1>
          <Breadcrumbs aria-label="breadcrumb" className="mt-4 flex justify-center">
            <Link underline="hover" color="inherit" href="/">
              Home
            </Link>
            <Typography color="text.primary">Contact Us</Typography>
          </Breadcrumbs>
        </Container>
      </header>

      <div className="flex items-center justify-center">
        <div className="flex flex-col w-full max-w-6xl">
          {/* Main Content */}
          <div className="flex-1 p-4 sm:p-6">
            <div className="container mx-auto flex flex-col lg:flex-row gap-4 sm:gap-6">
              {/* Left Sidebar - Card Style */}
              <div className="w-full lg:w-1/3 p-4 sm:p-6 flex flex-col gap-4 border border-gray-200 rounded bg-white shadow">
                {/* Email Section - Increased vertical padding */}
                <div className="flex items-center gap-4 px-4 py-6 border border-gray-300 rounded">
                  <Mail strokeWidth={1} absoluteStrokeWidth className="w-8 h-8" />
                  <div>
                    <h3 className="font-medium font-outfit text-base sm:text-lg text-gray-600">Email Address</h3>
                    <p className="text-gray-600 font-light text-sm sm:text-base">anbunaturalproducts@gmail.com</p>
                  </div>
                </div>

                {/* Phone Number Section - Increased vertical padding */}
                <div className="flex items-center gap-4 px-4 py-6 border border-gray-300 rounded">
                  <Phone strokeWidth={1} absoluteStrokeWidth className="w-8 h-8" />
                  <div>
                    <h3 className="font-medium font-outfit text-base sm:text-lg text-gray-600">Phone Number</h3>
                    <p className="text-gray-600 font-light text-sm sm:text-base">7338886850</p>
                    <p className="text-gray-600 font-light text-sm sm:text-base">9944736850</p>
                  </div>
                </div>

                {/* Instagram Section - Increased vertical padding */}
                <div className="flex items-center gap-4 px-4 py-6 border border-gray-300 rounded">
                  <Instagram strokeWidth={1} absoluteStrokeWidth className="w-8 h-8" />
                  <div>
                    <h3 className="font-medium font-outfit text-base sm:text-lg text-gray-600">Instagram</h3>
                    <Link
                      href="https://www.instagram.com/anbu_natural_products"
                      className="text-gray-600 font-light text-sm sm:text-base hover:text-green-600"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @anbu_natural_products
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Map Section */}
              <div className="w-full lg:w-2/3 p-4 flex flex-col border border-gray-200 rounded bg-white shadow">
                <div className="h-[300px] sm:h-[390px] overflow-hidden">
                  <iframe
                    title="Google Map Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1960.8050477025834!2d78.41485086320205!3d10.609626653980577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baa6f784aa8494d%3A0x5eced2ed18b03aa2!2sAnbu%20Natural%20Products!5e0!3m2!1sen!2sin!4v1753964396336!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <ContactForm />
      </div>
    </div>
  );
};

export default Contact;