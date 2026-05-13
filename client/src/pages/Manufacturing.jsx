import React from 'react';
import { Container, Breadcrumbs, Link, Typography, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Leaf, ShieldCheck, Zap, Check, Factory, Microscope } from 'lucide-react';
import FounderSection from '../components/FounderSection';

const ManufacturingHero = '/assets/manufacturing/wood.webp'; // Should be updated to a factory/production photo
const Process1 = '/assets/manufacturing/service-1.webp';
const Process2 = '/assets/manufacturing/service-2.webp';

const Manufacturing = () => {
  return (
    <div className="min-h-screen font-outfit bg-[#fdfcf8]">
      {/* Header */}
      <header className="bg-[#f5f5f5] py-10">
        <Container maxWidth="lg">
          <h1 className="text-4xl font-bold text-center pb-4 font-outfit text-gray-900">Manufacturing Excellence</h1>
          <Breadcrumbs aria-label="breadcrumb" className="mt-4 flex justify-center">
            <Link underline="hover" color="inherit" href="/" className="text-emerald-600">
              Home
            </Link>
            <Typography color="text.primary" className="font-medium">Manufacturing</Typography>
          </Breadcrumbs>
        </Container>
      </header>

      <main className="py-16 bg-white">
        <Container maxWidth="lg" className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2 relative group">
            <div className="absolute -inset-2 bg-emerald-100 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            <img
              src={ManufacturingHero}
              alt="Anbu Natural Manufacturing Process"
              className="relative w-full h-[450px] object-cover rounded-2xl shadow-lg"
            />
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm text-emerald-900 px-6 py-3 font-bold rounded-xl shadow-lg border border-emerald-100">
              Traditional Methods, Modern Standards
            </div>
          </div>

          <div className="md:w-1/2 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-outfit text-gray-900 leading-tight">
              Purity in Every Batch,<br />
              <span className="text-emerald-600">Responsibility in Every Step.</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 font-light leading-relaxed">
              Our manufacturing unit is where traditional herbal wisdom meets rigorous safety standards. We ensure that every product—from our herbal oils to millet health mixes—is prepared with utmost care and hygiene.
            </p>
            
            <List className="space-y-4">
              <ListItem className="bg-emerald-50/50 rounded-xl border border-emerald-100 p-4">
                <ListItemIcon>
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <Leaf className="w-6 h-6 text-emerald-600" />
                  </div>
                </ListItemIcon>
                <ListItemText 
                  primary={<Typography className="font-bold text-gray-900">Ethical Sourcing</Typography>} 
                  secondary="We source the finest natural ingredients directly from trusted farmers." 
                />
              </ListItem>
              <ListItem className="bg-emerald-50/50 rounded-xl border border-emerald-100 p-4">
                <ListItemIcon>
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  </div>
                </ListItemIcon>
                <ListItemText 
                  primary={<Typography className="font-bold text-gray-900">Quality Control</Typography>} 
                  secondary="Rigorous multi-stage testing for purity, safety, and nutritional value." 
                />
              </ListItem>
            </List>
          </div>
        </Container>
      </main>

      {/* Innovation Section */}
      <section className="py-20 bg-[#f9fafb]">
        <Container maxWidth="lg">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold py-2 px-6 rounded-full uppercase tracking-widest mb-6 border border-emerald-200">
              Our Production Philosophy
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight font-outfit text-gray-900">
              Innovating for a Healthier Tomorrow
            </h2>
            <p className="text-gray-600 text-lg font-light leading-relaxed mb-10">
              At Anbu Natural, we specialize in creating high-quality wellness products that blend traditional craftsmanship with modern food technology. Our processes ensure every item meets the highest standards of safety and efficacy. We use traditional techniques where they matter most, while our quality assurance team monitors every stage to deliver products you can trust for your family.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <Zap size={20} />, text: "Cold-Pressed Processing" },
                { icon: <Check size={20} />, text: "No Artificial Additives" },
                { icon: <Microscope size={20} />, text: "Lab-Tested Formulations" },
                { icon: <Factory size={20} />, text: "Hygienic Environment" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="text-emerald-500">{item.icon}</div>
                  <span className="text-gray-800 font-medium text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>       
      </section>

      {/* Founder Section Integration */}
      <FounderSection />
    </div>
  );
};

export default Manufacturing;