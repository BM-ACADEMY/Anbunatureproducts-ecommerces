import React from 'react';
import { Container } from '@mui/material';

const PolicyLayout = ({ title, lastUpdated, children }) => {
  return (
    <div className="min-h-screen font-outfit bg-white py-12 pt-24">
      {/* Background SVG Pattern similar to AboutUs */}
      <div className="absolute top-0 left-0 w-full overflow-hidden -z-10 h-96">
        <svg className="size-full" width="1440" height="720" viewBox="0 0 1440 720" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path stroke="#5ab14b1a" strokeOpacity=".7" d="M-15.227 702.342H1439.7" />
          <circle cx="711.819" cy="372.562" r="308.334" stroke="#5ab14b1a" strokeOpacity=".7" />
          <circle cx="16.942" cy="20.834" r="308.334" stroke="#5ab14b1a" strokeOpacity=".7" />
          <path stroke="#5ab14b1a" strokeOpacity=".7" d="M-15.227 573.66H1439.7M-15.227 164.029H1439.7" />
          <circle cx="782.595" cy="411.166" r="308.334" stroke="#5ab14b1a" strokeOpacity=".7" />
        </svg>
      </div>

      <Container maxWidth="lg">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 font-outfit">{title}</h1>
          {lastUpdated && (
            <p className="text-slate-500 text-sm mb-10 font-outfit flex items-center gap-2">
              <span className="w-8 h-[1px] bg-slate-300"></span>
              Last Updated: {lastUpdated}
            </p>
          )}
          <div className="space-y-8 text-slate-700 leading-relaxed font-outfit">
            {children}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PolicyLayout;
