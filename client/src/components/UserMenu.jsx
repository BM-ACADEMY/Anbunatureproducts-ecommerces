import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Divider from "./Divider";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { logout } from "../store/userSlice";
import toast from "react-hot-toast";
import isAdmin from "../utils/isAdmin";
import { FiUser, FiLogOut, FiHome, FiGrid, FiLayers, FiUpload, FiPackage, FiList } from "react-icons/fi";
import { useGlobalContext } from "../provider/GlobalProvider";

const UserMenu = ({ close, avatarColor, isSidebar = false }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleLogoutOut } = useGlobalContext();
  const [openDialog, setOpenDialog] = useState(false);

  const userInitial = user?.name?.charAt(0) || user?.mobile?.charAt(0) || "U";

  const handleLogout = async () => {
    try {
      const response = await Axios({
        url: SummaryApi.logout.url,
        method: SummaryApi.logout.method,
        withCredentials: true,
      });

      if (response?.data?.success) {
        handleLogoutOut();
        close?.();
        dispatch(logout());
        toast.success(response.data.message || "Logged out successfully");
        navigate("/");
      } else {
        toast.error(response?.data?.message || "Logout failed. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Logout failed.");
    }
  };

  const menuItems = [
    ...(!isSidebar && isAdmin(user?.role) ? [
      {
        text: "Dashboard",
        icon: <FiGrid size={20} />,
        path: "/dashboard",
      }
    ] : []),
    
    ...((isSidebar || !isAdmin(user?.role)) ? [
      {
        text: "Profile",
        icon: <FiUser size={20} />,
        path: isAdmin(user?.role) ? "/dashboard/profile" : "/user/profile",
      },
      ...(isAdmin(user?.role)
        ? [
            { text: "Overview", icon: <FiGrid size={20} />, path: "/dashboard" },
            { text: "Category", icon: <FiGrid size={20} />, path: "/dashboard/category" },
            { text: "Sub Category", icon: <FiLayers size={20} />, path: "/dashboard/subcategory" },
            { text: "Upload Product", icon: <FiUpload size={20} />, path: "/dashboard/upload-product" },
            { text: "Product", icon: <FiPackage size={20} />, path: "/dashboard/product" },
            { text: "All Orders", icon: <FiList size={20} />, path: "/dashboard/allorders" },
          ]
        : [
            { text: "My Orders", icon: <FiList size={20} />, path: "/user/myorders" },
          ]),
      ...(!isAdmin(user?.role)
        ? [
            { text: "Save Address", icon: <FiHome size={20} />, path: "/user/address" },
          ]
        : []),
    ] : []),

    {
      text: "Log Out",
      icon: <FiLogOut size={20} />,
      onClick: () => setOpenDialog(true),
    },
  ];

  return (
    <div className={`${isSidebar ? 'w-full px-2' : 'w-52 py-2 bg-white rounded-md shadow-lg border border-gray-100'}`}>
      {!isSidebar && (
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg overflow-hidden shrink-0"
              style={{ backgroundColor: user?.avatar ? 'transparent' : avatarColor }}
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                userInitial.toUpperCase()
              )}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold text-gray-800 truncate text-sm">
                {user?.name || user?.mobile}
              </span>
              {isAdmin(user?.role) && (
                <span className="text-[10px] text-red-500 font-medium uppercase tracking-wider">Admin</span>
              )}
            </div>
          </div>
        </div>
      )}

      <nav className="mt-1 space-y-1">
        {menuItems.map((item, index) => (
          item.path ? (
            <Link
              key={index}
              to={item.path}
              onClick={close}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                isSidebar 
                ? 'text-gray-400 hover:text-white hover:bg-white/5 rounded-lg mb-1' 
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className={isSidebar ? 'text-gray-400' : 'text-gray-500'}>{item.icon}</span>
              <span>{item.text}</span>
            </Link>
          ) : (
            <button
              key={index}
              onClick={item.onClick}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                isSidebar 
                ? 'text-gray-400 hover:text-white hover:bg-white/5 rounded-lg' 
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className={isSidebar ? 'text-gray-400' : 'text-gray-500'}>{item.icon}</span>
              <span>{item.text}</span>
            </button>
          )
        ))}
      </nav>

      {/* Logout Confirmation Dialog (Custom Tailwind Modal) */}
      {openDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpenDialog(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden p-6 animate-in fade-in zoom-in duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to log out of your account?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpenDialog(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FiLogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;