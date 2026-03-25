import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegUser, FaEdit, FaSave } from "react-icons/fa";
import { MdEmail, MdPhone, MdPerson } from "react-icons/md";
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { toast } from 'sonner';
import { setUserDetails } from '../store/userSlice';
import fetchUserDetails from '../utils/fetchUserDetails';

const Profile = () => {
  const user = useSelector(state => state.user);
  const [openProfileAvatarEdit, setProfileAvatarEdit] = useState(false);
  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  });
  const [initialUserData, setInitialUserData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  });
  const [loading, setLoading] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setUserData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    });
    setInitialUserData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    });
  }, [user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => {
      const updatedData = { ...prev, [name]: value };
      setIsModified(
        updatedData.name !== initialUserData.name ||
        updatedData.email !== initialUserData.email ||
        updatedData.mobile !== initialUserData.mobile
      );
      return updatedData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await Axios({
        ...SummaryApi.updateUserDetails,
        data: userData,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        const updatedUserData = await fetchUserDetails();
        dispatch(setUserDetails(updatedUserData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const maskEmail = (email) => {
    const [name, domain] = email.split('@');
    if (!name || !domain) return email;
    const maskedName = name[0] + '*'.repeat(Math.max(name.length - 2, 1)) + name[name.length - 1];
    return `${maskedName}@${domain}`;
  };

  return (
    <div className="p-10 lg:p-12">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Account Settings</h1>

        <div className="flex flex-col sm:flex-row items-center gap-6 mb-12">
            <div className="relative group">
               <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden border-2 border-white shadow-md ring-4 ring-gray-50 transition-transform hover:scale-105">
                  {user.avatar ? (
                    <img alt={user.name} src={user.avatar} className="w-full h-full object-cover" />
                  ) : (
                    <FaRegUser size={40} className="text-gray-300 mx-auto mt-6" />
                  )}
               </div>
               <button
                 onClick={() => setProfileAvatarEdit(true)}
                 className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg border border-gray-100 text-blue-600 hover:bg-gray-50"
               >
                 <FaEdit size={14} />
               </button>
            </div>
            <div className="text-center sm:text-left">
               <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
               <p className="text-gray-500 text-sm font-medium">{user.role || "Customer"}</p>
            </div>
        </div>

        {openProfileAvatarEdit && (
          <UserProfileAvatarEdit open={openProfileAvatarEdit} close={() => setProfileAvatarEdit(false)} />
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 ml-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <MdPerson size={20} />
              </div>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-gray-800"
                value={userData.name}
                name="name"
                onChange={handleOnChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <MdEmail size={20} />
              </div>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-gray-800"
                value={userData.email}
                name="email"
                onChange={handleOnChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 ml-1">Mobile Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <MdPhone size={20} />
              </div>
              <input
                type="text"
                placeholder="Enter your mobile"
                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-gray-800"
                value={userData.mobile || ""}
                name="mobile"
                onChange={handleOnChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!isModified || loading}
            className={`w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl font-bold text-lg transition-all active:scale-[0.98] ${
              !isModified || loading 
              ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100"
            }`}
          >
            {loading ? (
                <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
                <FaSave size={18} />
            )}
            {loading ? "Saving Changes..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
