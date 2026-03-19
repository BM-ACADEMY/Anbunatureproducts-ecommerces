import React, { useState } from 'react';
import UserMenu from '../components/UserMenu';
import DashboardHeader from '../components/DashboardHeader';
import { Link, Outlet } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import logo from '../assets/logo.png';
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
        <Link to="/">
        <div className="sidebar-logo">
           <img src={logo} alt="Anbu Logo" className="logo-img" />
           <span className="logo-text">Anbu</span>
        </div>
        </Link>
        <div className="sidebar-content">
          <UserMenu close={closeMobileMenu} isSidebar={true} />
        </div>
      </aside>

      {/* Main Container */}
      <div className="dashboard-main-container">
        {/* Dashboard Top Header */}
        <DashboardHeader onMenuClick={toggleMobileMenu} />

        {/* Main Content Area */}
        <main className="dashboard-main">
          <div className="dashboard-content-card">
            <Outlet />
          </div>
        </main>
      </div>
    </section>
  );
};


export default Dashboard;
