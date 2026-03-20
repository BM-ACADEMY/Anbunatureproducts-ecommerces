import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { logout } from "../store/userSlice";
import { toast } from "sonner";
import isAdmin from "../utils/isAdmin";
import { FiUser, FiLogOut, FiGrid, FiLayers, FiUpload, FiPackage, FiList, FiHome, FiSettings } from "react-icons/fi";
import { useGlobalContext } from "../provider/GlobalProvider";

const UserMenu = ({ close, isSidebar = false }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  // Define menu items based on role and context (sidebar vs dropdown)
  const adminMenuItems = isSidebar
    ? [
        { text: "Dashboard", icon: <FiGrid size={17} />, path: "/dashboard" },
        { text: "Category", icon: <FiLayers size={17} />, path: "/dashboard/category" },
        { text: "Sub Category", icon: <FiLayers size={17} />, path: "/dashboard/subcategory" },
        { text: "Upload Product", icon: <FiUpload size={17} />, path: "/dashboard/upload-product" },
        { text: "Product", icon: <FiPackage size={17} />, path: "/dashboard/product" },
        { text: "All Orders", icon: <FiList size={17} />, path: "/dashboard/allorders" },
        { text: "Banners", icon: <FiLayers size={17} />, path: "/dashboard/banner" },
      ]
    : [
        { text: "Dashboard", icon: <FiGrid size={17} />, path: "/dashboard" },
      ];

  const userMenuItems = [
    { text: "Profile", icon: <FiUser size={17} />, path: "/user/profile" },
    { text: "My Orders", icon: <FiList size={17} />, path: "/user/myorders" },
    { text: "Save Address", icon: <FiHome size={17} />, path: "/user/address" },
  ];

  const menuItems = isAdmin(user?.role) ? adminMenuItems : userMenuItems;

  // Sidebar mode
  if (isSidebar) {
    return (
      <div className="w-full px-2 space-y-1">
        {menuItems.map((item, idx) => (
          <Link
            key={idx}
            to={item.path}
            onClick={close}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
          >
            <span className="text-gray-400">{item.icon}</span>
            <span>{item.text}</span>
          </Link>
        ))}
        <button
          onClick={() => setOpenDialog(true)}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-all"
        >
          <FiLogOut size={17} />
          <span>Log Out</span>
        </button>
      </div>
    );
  }

  // Header dropdown mode
  return (
    <>
      <div className="w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">

        {/* Top — Avatar, Name, Role */}
        <div className="px-4 pt-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-green-600 shadow flex items-center justify-center text-white font-bold text-xl">
              {user?.avatar
                ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                : userInitial
              }
            </div>

            {/* Name + Email/Role */}
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-gray-900 truncate">{user?.name || user?.mobile}</span>
              {user?.email && (
                <span className="text-xs text-gray-400 truncate">{user.email}</span>
              )}
              {isAdmin(user?.role) && (
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-wide mt-0.5">Administrator</span>
              )}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-1.5 px-1.5">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              onClick={close}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all group"
            >
              <span className="text-gray-400 group-hover:text-gray-700 transition-colors">{item.icon}</span>
              <span>{item.text}</span>
            </Link>
          ))}
        </div>

        {/* Separator + Logout */}
        <div className="border-t border-gray-100 py-1.5 px-1.5">
          <button
            onClick={() => setOpenDialog(true)}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all group"
          >
            <FiLogOut size={17} className="text-red-400 group-hover:text-red-600 transition-colors" />
            <span>Log out</span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {openDialog && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpenDialog(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-sm:w-[90vw] p-6 z-10 animate-fade-in">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <FiLogOut size={22} className="text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-1">Log out?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">Are you sure you want to log out of your account?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setOpenDialog(false)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <FiLogOut size={15} />
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserMenu;