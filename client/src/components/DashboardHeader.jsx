import React from 'react';
import { FiMenu, FiSearch, FiHelpCircle, FiBell } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const DashboardHeader = ({ onMenuClick }) => {
  const user = useSelector((state) => state.user);
  const userInitial = user?.name?.charAt(0) || user?.mobile?.charAt(0) || "U";

  return (
    <header className="dashboard-top-header">
      <div className="header-left">
        <button className="menu-toggle-btn" onClick={onMenuClick}>
          <FiMenu size={24} />
        </button>
      </div>

      <div className="header-right">
        <div className="header-actions">
          <button className="header-action-btn" title="Search">
            <FiSearch size={20} />
          </button>
          <button className="header-action-btn" title="Help">
            <FiHelpCircle size={20} />
          </button>
          <button className="header-action-btn" title="Notifications">
            <div className="custom-badge-container">
              <FiBell size={20} />
              <span className="custom-badge">5</span>
            </div>
          </button>
        </div>

        <div className="header-user">
          <div className="custom-avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <span>{userInitial.toUpperCase()}</span>
            )}
          </div>
          <span className="user-name">{user?.name || "User"}</span>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

