import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { logout } from "../store/userSlice";
import { toast } from "sonner";
import isAdmin from "../utils/isAdmin";
import { FiUser, FiLogOut, FiGrid, FiLayers, FiUpload, FiPackage, FiList, FiHome, FiShoppingCart } from "react-icons/fi";
import { useGlobalContext } from "../provider/GlobalProvider";

const UserMenu = ({ close, isSidebar = false, isCollapsed = false, isHome = false }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogoutOut } = useGlobalContext();
  const [openDialog, setOpenDialog] = useState(false);

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || user?.mobile?.charAt(0) || "U";

  const handleLogout = async () => {
    try {
      await Axios({
        url: SummaryApi.logout.url,
        method: SummaryApi.logout.method,
        withCredentials: true,
      });
    } catch (error) {
      console.warn("Server logout error (continuing):", error?.response?.data?.message || error.message);
    } finally {
      localStorage.removeItem('accesstoken');
      localStorage.removeItem('refreshToken');
      dispatch(logout());
      handleLogoutOut();
      close?.();
      toast.success("Logged out successfully");
      navigate("/");
    }
  };

  const LogoutDialog = () => {
    if (!openDialog) return null;
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setOpenDialog(false)} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[320px] p-6 z-10 animate-in fade-in zoom-in duration-200">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-rose-50 mx-auto mb-4">
            <FiLogOut size={22} className="text-rose-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 text-center mb-1">Confirm Logout</h3>
          <p className="text-xs text-slate-500 text-center mb-6 font-medium">Are you sure you want to sign out?</p>
          <div className="flex gap-3">
            <button
              onClick={() => setOpenDialog(false)}
              className="flex-1 px-4 py-2.5 text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 px-4 py-2.5 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-lg shadow-rose-100 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  };

  const adminItems = [
    { text: "Dashboard", icon: <FiGrid size={20} />, path: "/dashboard" },
    { text: "Category", icon: <FiLayers size={20} />, path: "/dashboard/category" },
    { text: "Sub Category", icon: <FiLayers size={20} />, path: "/dashboard/subcategory" },
    { text: "Product", icon: <FiPackage size={20} />, path: "/dashboard/product" },
    { text: "All Orders", icon: <FiList size={20} />, path: "/dashboard/allorders" },
    { text: "Banners", icon: <FiLayers size={21} />, path: "/dashboard/banner" },
  ];

  const userItems = [
    { text: "Profile", icon: <FiUser size={20} />, path: "/user/profile" },
    { text: "My Cart", icon: <FiShoppingCart size={20} />, path: "/cart" },
    { text: "My Orders", icon: <FiList size={18} />, path: "/user/myorders" },
  ];

  const menuItems = isAdmin(user?.role) 
    ? (isHome ? [adminItems[0]] : adminItems)
    : userItems;

  // Sidebar mode
  if (isSidebar) {
    return (
      <>
        <div className="flex flex-col h-full">
          {/* Menu Items */}
          <div className="flex-1 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
            {menuItems.map((item, idx) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={idx}
                  to={item.path}
                  onClick={close}
                  title={isCollapsed ? item.text : ""}
                  className={`flex items-center transition-all duration-300 group rounded-xl ${
                      isCollapsed ? 'justify-center p-3' : 'gap-3.5 px-4 py-3'
                  } ${
                      isActive 
                      ? 'bg-white text-slate-900 shadow-lg shadow-white/10' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className={`${isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-white'} transition-colors duration-300`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && <span className="font-semibold tracking-wide text-[14.5px]">{item.text}</span>}
                </Link>
              );
            })}
          </div>

          {/* Sidebar Footer - User Profile */}
          <div className="mt-auto border-t border-slate-800/50 p-3">
            <div 
              className={`flex items-center justify-between cursor-pointer group/footer hover:bg-white/5 rounded-xl p-1 transition-all ${isCollapsed ? 'flex-col gap-4' : 'px-1'}`}
              onClick={handleLogout}
              title="Logout and Go Home"
            >
              {!isCollapsed ? (
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-indigo-600 shadow-md flex items-center justify-center text-white font-bold text-lg border border-white/10 group-hover/footer:ring-2 group-hover/footer:ring-white/20 transition-all">
                    {user?.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" /> : userInitial}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13.5px] font-bold text-slate-100 truncate leading-tight group-hover/footer:text-white">{user?.name || "User"}</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5 group-hover/footer:text-slate-400">Admin Account</span>
                  </div>
                </div>
              ) : (
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-indigo-600 shadow-md flex items-center justify-center text-white font-bold text-lg border border-white/10 group-hover/footer:ring-2 group-hover/footer:ring-white/20 transition-all">
                      {user?.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" /> : userInitial}
                  </div>
              )}
              
              <div className={`p-2.5 rounded-xl transition-all duration-200 ${
                  isCollapsed 
                  ? 'bg-slate-800/50 text-slate-400 group-hover/footer:text-rose-400 group-hover/footer:bg-rose-500/10' 
                  : 'text-slate-500 group-hover/footer:text-rose-400 group-hover/footer:bg-rose-500/10'
              }`}>
                <FiLogOut size={19} />
              </div>
            </div>
          </div>
        </div>
        <LogoutDialog />
      </>
    );
  }

  // Home Header mode (matches user reference image aesthetic)
  if (isHome) {
    return (
      <div className="w-72 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-200 overflow-hidden py-2 flex flex-col">
        {/* User Profile Header */}
        <div className="px-4 py-2.5 mb-1.5">
          <h4 className="text-[15px] font-bold text-slate-800 leading-tight">{user?.name || "User"}</h4>
          <p className="text-[13px] text-slate-400 font-medium truncate">{user?.email || user?.mobile || "No contact set"}</p>
        </div>

        {/* Menu Items */}
        <div className="px-1.5 space-y-0.5">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              onClick={close}
              className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-[14px] font-medium text-slate-600 hover:bg-slate-100 group transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-slate-400 group-hover:text-slate-900 transition-colors">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="h-px bg-slate-50 my-2 mx-1.5" />

        {/* Logout */}
        <div className="px-1.5">
          <button
            onClick={() => setOpenDialog(true)}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[14px] font-medium text-slate-600 hover:bg-slate-50 group transition-all"
          >
            <FiLogOut size={18} className="text-slate-400 group-hover:text-rose-500 transition-colors" />
            <span className="group-hover:text-rose-600 transition-colors">Log out</span>
          </button>
        </div>
        <LogoutDialog />
      </div>
    );
  }

  // Header dropdown mode (Internal logic remains same, but styling modernized)
  return (
    <>
      <div className="w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="px-5 pt-5 pb-4 border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0 bg-indigo-600 shadow-lg flex items-center justify-center text-white font-bold text-xl ring-2 ring-indigo-50">
              {user?.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" /> : userInitial}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-extrabold text-slate-900 truncate">{user?.name || "User"}</span>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-0.5">Administrator</span>
            </div>
          </div>
        </div>

        <div className="py-2.5 px-2">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              onClick={close}
              className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all duration-200 group"
            >
              <span className="text-slate-400 group-hover:text-indigo-500 transition-colors duration-200">{item.icon}</span>
              <span>{item.text}</span>
            </Link>
          ))}
        </div>

        <div className="border-t border-slate-50 py-2.5 px-2">
          <button
            onClick={() => setOpenDialog(true)}
            className="flex w-full items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 group"
          >
            <FiLogOut size={18} className="text-rose-400 group-hover:text-rose-600 transition-colors" />
            <span>Logout Account</span>
          </button>
        </div>
      </div>
      <LogoutDialog />
    </>
  );
};

export default UserMenu;