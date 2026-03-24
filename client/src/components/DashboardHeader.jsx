import React, { useState } from 'react';
import { FiMenu, FiHome, FiLogOut, FiHelpCircle, FiBell } from 'react-icons/fi';
import { BsLayoutSidebarInset, BsReverseLayoutSidebarInsetReverse } from "react-icons/bs";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { logout } from '../store/userSlice';
import { toast } from 'sonner';
import { IoSearchOutline, IoCloseCircle, IoArrowBackOutline } from "react-icons/io5";

const DashboardHeader = ({ onMenuClick, onSidebarToggle, isCollapsed }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const userInitial = user?.name?.charAt(0) || user?.mobile?.charAt(0) || "U";
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);
  
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || "");

  const isProductPage = location.pathname === "/dashboard/product";

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    updateSearchParams(value);
  };

  const updateSearchParams = (value) => {
    if (value.trim()) {
      setSearchParams({ search: value.trim() });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchParams({});
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

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
    <header className="dashboard-top-header relative">
      {/* Left Section */}
      <div className={`header-left transition-all duration-300 ${isMobileSearchExpanded ? 'opacity-0 -translate-x-full pointer-events-none' : 'opacity-100 flex items-center'}`}>
        <button className="menu-toggle-btn" onClick={onMenuClick}>
          <FiMenu size={24} />
        </button>
        <button className="sidebar-toggle-btn" onClick={onSidebarToggle}>
          {isCollapsed ? <BsReverseLayoutSidebarInsetReverse size={20} /> : <BsLayoutSidebarInset size={20} />}
        </button>
      </div>

      {isProductPage && (
        <>
          {/* Desktop Search - Hidden on MD/SM */}
          <div className="hidden lg:flex flex-1" /> {/* Spacer to push search to right */}
          <div className="hidden lg:block w-72 xl:w-80 mx-4">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <IoSearchOutline size={19} className={`transition-colors ${isSearchFocused ? 'text-indigo-600' : 'text-slate-400 opacity-60'}`} />
              </div>
              <input 
                type="text" 
                placeholder="Search products..." 
                className={`block w-full pl-11 pr-10 py-2.5 rounded-2xl text-[14px] text-slate-700 placeholder:text-slate-400 transition-all outline-none border border-transparent shadow-sm ${isSearchFocused ? 'bg-white ring-4 ring-indigo-500/10 border-indigo-500/30' : 'bg-slate-100/80 hover:bg-slate-200/50'}`}
                value={searchInput}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              />
              {searchInput && (
                <button 
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-300 hover:text-rose-400 transition-colors"
                >
                  <IoCloseCircle size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Search Icon Toggle - Visible only on MD/SM and when page is products */}
          {!isMobileSearchExpanded && (
            <div className="lg:hidden flex-1 flex justify-end">
              <button 
                onClick={() => setIsMobileSearchExpanded(true)}
                className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors mx-1"
                title="Search"
              >
                <IoSearchOutline size={22} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Expanded Mobile Search Overlay */}
      {isMobileSearchExpanded && isProductPage && (
        <div className="absolute inset-0 bg-white z-[60] flex items-center px-4 gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <button 
            onClick={() => setIsMobileSearchExpanded(false)}
            className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <IoArrowBackOutline size={22} />
          </button>
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <IoSearchOutline size={19} className="text-indigo-600" />
            </div>
            <input 
              autoFocus
              type="text" 
              placeholder="Search products..." 
              className="block w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[15px] text-slate-700 outline-none shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all font-medium"
              value={searchInput}
              onChange={handleSearchChange}
            />
            {searchInput && (
              <button 
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-300 hover:text-rose-400 transition-colors"
              >
                <IoCloseCircle size={20} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Right Section */}
      <div className={`header-right transition-all duration-300 ${isMobileSearchExpanded ? 'opacity-0 translate-x-full pointer-events-none' : 'opacity-100 flex items-center'}`}>
        <div className="header-actions">
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
