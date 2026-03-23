import React, { useState } from 'react';
import { FiMenu, FiHome, FiLogOut, FiHelpCircle, FiBell } from 'react-icons/fi';
import { BsLayoutSidebarInset, BsReverseLayoutSidebarInsetReverse } from "react-icons/bs";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { logout } from '../store/userSlice';
import { toast } from 'sonner';

const DashboardHeader = ({ onMenuClick, onSidebarToggle, isCollapsed }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInitial = user?.name?.charAt(0) || user?.mobile?.charAt(0) || "U";
  const [openUserMenu, setOpenUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await Axios({ ...SummaryApi.logout, withCredentials: true });
    } catch (error) {
       console.error("Logout error", error);
    } finally {
      localStorage.clear();
      dispatch(logout());
      toast.success("Logged out successfully");
      navigate("/");
    }
  };

  return (
    <header className="dashboard-top-header">
      <div className="header-left">
        <button className="menu-toggle-btn" onClick={onMenuClick}>
          <FiMenu size={24} />
        </button>
        <button className="sidebar-toggle-btn" onClick={onSidebarToggle}>
          {isCollapsed ? <BsReverseLayoutSidebarInsetReverse size={20} /> : <BsLayoutSidebarInset size={20} />}
        </button>
      </div>

      <div className="header-right">
        <div className="header-actions">
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

        <div className="relative">
          <div 
            className="flex items-center gap-2.5 ml-4 pl-4 border-l border-slate-200 cursor-pointer group"
            onClick={() => setOpenUserMenu(!openUserMenu)}
          >
            <div className="w-9 h-9 rounded-xl border-2 border-white shadow-sm ring-1 ring-slate-200 overflow-hidden flex-shrink-0 bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
              {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : userInitial.toUpperCase()}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-[13px] font-bold text-slate-700 leading-tight group-hover:text-indigo-600 transition-colors">{user?.name || "User"}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Admin</span>
            </div>
          </div>

          {openUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpenUserMenu(false)} />
              <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-200 overflow-hidden py-2 z-50 animate-in fade-in zoom-in duration-200 origin-top-right flex flex-col">
                {/* User Profile Header */}
                <div className="px-4 py-2.5 mb-1.5">
                  <h4 className="text-[14px] font-bold text-slate-800 leading-tight">{user?.name || "User"}</h4>
                  <p className="text-[12px] text-slate-400 font-medium truncate">{user?.email || user?.mobile || "Administrator"}</p>
                </div>

                <div className="px-1.5 space-y-0.5">
                  <button 
                    onClick={() => navigate("/")}
                    className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-[13.5px] font-medium text-slate-600 hover:bg-slate-100 transition-all"
                  >
                    <FiHome size={17} className="text-slate-400" />
                    <span>Go to Home</span>
                  </button>
                  
                  <div className="h-px bg-slate-50 my-1.5 mx-1" />
                  
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-[13.5px] font-medium text-slate-600 hover:bg-slate-100 transition-all group"
                  >
                    <FiLogOut size={17} className="text-slate-400 group-hover:text-rose-500 transition-colors" />
                    <span className="group-hover:text-rose-600 transition-colors">Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

