import React from 'react';
import founderDesktop from '../assets/Founder/Banners founder.png';
import founderMobile from '../assets/Founder/founder Banner  mobile.png';

const FounderSection = () => {
    return (
        <section className="pt-10 pb-10 md:pt-15 md:pb-16 px-4 sm:px-6 lg:px-10">
            <div className="container mx-auto max-w-7xl overflow-hidden rounded-2xl sm:rounded-[1.5rem] shadow-sm">
                
                {/* Desktop Banner */}
                <div className="hidden md:block w-full">
                    <img 
                        src={founderDesktop} 
                        alt="Anbu Nature Products Founder" 
                        className="w-full h-auto object-cover"
                    />
                </div>

                {/* Mobile Banner */}
                <div className="block md:hidden w-full">
                    <img 
                        src={founderMobile} 
                        alt="Anbu Nature Products Founder - Mobile" 
                        className="w-full h-auto object-cover"
                    />
                </div>

            </div>
        </section>
    );
};

export default FounderSection;
