import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Instagram, MapPin } from 'lucide-react';
import ContactForm from '../components/ContactUs';

const Contact = () => {
  // Animation variants for staggered rendering
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <div className="min-h-screen bg-gray-50 font-outfit relative pb-20">
      
      {/* Background Map Section (Top Half) */}
      <div className="absolute top-0 left-0 w-full h-[50vh] z-0">
        <iframe
          title="Google Map Location"
          src="https://maps.google.com/maps?q=anbu+natural+products&t=&z=13&ie=UTF8&iwloc=&output=embed" // Replace with your actual embed URL
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'grayscale(0.2) contrast(1.1)' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        {/* Dark overlay to make the map less distracting */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
      </div>

      {/* Main Content (Overlapping the map) */}
      <div className="relative z-10 pt-[35vh] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        <motion.div 
          className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          
          {/* Left Side - Contact Info (Dark Theme) */}
          <motion.div 
            className="w-full lg:w-2/5 bg-emerald-900 text-white p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden"
            // variants={itemVariants}
          >
            {/* Decorative background circles */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-emerald-800 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-emerald-700 rounded-full opacity-50 blur-2xl"></div>

            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2">Get in Touch</h2>
              <p className="text-emerald-100/80 mb-12 text-sm sm:text-base">
                We'd love to hear from you. Our friendly team is always here to chat.
              </p>

              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-emerald-300 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-emerald-100 text-sm mb-1">Chat with us</h3>
                    <a href="mailto:anbunaturalproducts@gmail.com" className="text-white hover:text-emerald-300 transition-colors break-all">
                      anbunaturalproducts@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-emerald-300 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-emerald-100 text-sm mb-1">Ring us</h3>
                    <div className="flex flex-col space-y-1">
                      <a href="tel:7338886850" className="text-white hover:text-emerald-300 transition-colors">7338886850</a>
                      <a href="tel:9944736850" className="text-white hover:text-emerald-300 transition-colors">9944736850</a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Instagram className="w-6 h-6 text-emerald-300 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-emerald-100 text-sm mb-1">Social Media</h3>
                    <a 
                      href="https://www.instagram.com/anbu_natural_products" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-white hover:text-emerald-300 transition-colors"
                    >
                      @anbu_natural_products
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-emerald-300 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-emerald-100 text-sm mb-1">Location</h3>
                    <p className="text-white">
                      Puducherry, Tamil Nadu<br />
                      India
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.div 
            className="w-full lg:w-3/5 p-10 lg:p-14 bg-[#fafafa]"
            // variants={itemVariants}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
            {/* The form container */}
            <div className="w-full">
              <ContactForm />
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
};

export default Contact;