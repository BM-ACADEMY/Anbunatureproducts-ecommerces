import React, { useState } from 'react';
import UserMenu from '../components/UserMenu';
import { Outlet } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import '../assets/css/dashboard.css';

const Dashboard = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <section className="dashboard-layout">
      {/* Mobile Overlay */}
      <div 
        className={`dash-modal-overlay ${mobileMenuOpen ? 'open' : ''}`} 
        onClick={closeMobileMenu}
        style={{ zIndex: 40 }}
      />

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <UserMenu close={closeMobileMenu} />
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-content-card">
          <Outlet />
        </div>
      </main>

      {/* Mobile Toggle Button */}
      <button 
        className="dash-mobile-toggle" 
        onClick={toggleMobileMenu}
        aria-label="Toggle Menu"
      >
        {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>
    </section>
  );
};

export default Dashboard;
