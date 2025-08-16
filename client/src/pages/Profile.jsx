import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegUser, FaEdit, FaSave } from "react-icons/fa";
import { MdEmail, MdPhone, MdPerson } from "react-icons/md";
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
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
    <div className="p-6">
      <div className="max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h1>

        {/* Avatar Section */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-full overflow-hidden border-2 border-white shadow-md">
              {user.avatar ? (
                <img alt={user.name} src={user.avatar} className="w-full h-full object-cover" />
              ) : (
                <FaRegUser size={48} className="text-gray-500" />
              )}
            </div>
            <button
              onClick={() => setProfileAvatarEdit(true)}
              className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow hover:bg-gray-100 transition"
              aria-label="Edit profile picture"
            >
              <FaEdit className="text-blue-600 text-sm" />
            </button>
          </div>
          <div>
            <h2 className="text-lg font-semibold">{user.name}</h2>
            {/* <p className="text-gray-600 text-sm">{maskEmail(user.email)}</p> */}
          </div>
        </div>

        {openProfileAvatarEdit && (
          <UserProfileAvatarEdit open={openProfileAvatarEdit} close={() => setProfileAvatarEdit(false)} />
        )}

        {/* Profile Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdPerson className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Enter your name"
                className="pl-10 w-full p-2 border border-gray-300 rounded-md"
                value={userData.name}
                name="name"
                onChange={handleOnChange}
                required
                aria-label="Name"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdEmail className="text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="Enter your email"
                className="pl-10 w-full p-2 border border-gray-300 rounded-md"
                value={userData.email}
                name="email"
                onChange={handleOnChange}
                required
                aria-label="Email"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Mobile</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdPhone className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Enter your mobile"
                className="pl-10 w-full p-2 border border-gray-300 rounded-md"
                value={userData.mobile}
                name="mobile"
                onChange={handleOnChange}
                required
                aria-label="Mobile"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!isModified || loading}
            className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <FaSave className="mr-2" />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
