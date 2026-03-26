import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegUser, FaEdit, FaSave, FaCamera, FaChevronDown } from "react-icons/fa";
import { MdEmail, MdPhone, MdPerson, MdLocationOn, MdHome, MdPinDrop, MdPublic, MdOutlinePushPin } from "react-icons/md";
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { toast } from 'sonner';
import { setUserDetails } from '../store/userSlice';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useGlobalContext } from '../provider/GlobalProvider';
import AddressCard from '../components/AddressCard';
import AddAddress from '../components/AddAddress';
import EditAddressDetails from '../components/EditAddressDetails';
import DeleteConfirmation from '../components/DeleteConfirmation';
import { FiPlus } from 'react-icons/fi';
import Breadcrumbs from '../components/Breadcrumbs';
// Removed problematic PhoneInput library

const Profile = () => {
    const user = useSelector(state => state.user);
    const addressList = useSelector(state => state.addresses.addressList);
    const { fetchAddress } = useGlobalContext();
    const dispatch = useDispatch();

    const [openProfileAvatarEdit, setProfileAvatarEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isModified, setIsModified] = useState(false);

    // Address Management State
    const [openAddress, setOpenAddress] = useState(false);
    const [openEditAddress, setOpenEditAddress] = useState(false);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [editData, setEditData] = useState({});
    
    const [formData, setFormData] = useState({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
    });

    const [initialFormData, setInitialFormData] = useState({ ...formData });

    useEffect(() => {
        if (user) {
            const newData = {
                name: user.name || "",
                email: user.email || "",
                mobile: user.mobile ? String(user.mobile) : "",
            };
            setFormData(newData);
            setInitialFormData(newData);
        }
    }, [user]);

    const handleDeleteAddress = (id) => {
        setDeleteId(id);
        setOpenDeleteConfirm(true);
    };

    const confirmDeleteAddress = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.disableAddress,
                data: { _id: deleteId }
            });
            if (response.data.success) {
                toast.success(response.data.message);
                setOpenDeleteConfirm(false);
                fetchAddress();
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    const handleEditAddress = (address) => {
        setEditData(address);
        setOpenEditAddress(true);
    };


    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            

            const isAnyModified = Object.keys(updated).some(key => updated[key] !== initialFormData[key]);
            setIsModified(isAnyModified);
            
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userResponse = await Axios({
                ...SummaryApi.updateUserDetails,
                data: {
                    name: formData.name,
                    email: formData.email,
                    mobile: formData.mobile
                },
            });

            if (userResponse.data.success) {
                toast.success("Profile updated successfully");
                const updatedUserData = await fetchUserDetails();
                dispatch(setUserDetails(updatedUserData.data));
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
            setIsModified(false);
        }
    };

    const handleCancel = () => {
        setFormData(initialFormData);
        setIsModified(false);
    };

    return (
        <section className="min-h-screen bg-[#fcf8ed] py-8">
            <div className="container mx-auto px-6 lg:px-10">
                <Breadcrumbs />
                
                <div className="space-y-8 mt-8">
                <h1 className="text-3xl font-extrabold text-[#232F3E] tracking-tight">Account Settings</h1>

                {/* Profile Header Card */}
                <div className="bg-white rounded-2xl p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl ring-2 ring-gray-50 bg-slate-50">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <FaRegUser size={48} />
                                    </div>
                                )}
                                <div 
                                    onClick={() => setProfileAvatarEdit(true)}
                                    className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                                >
                                    <FaCamera className="text-white" size={24} />
                                </div>
                            </div>
                            <div 
                                className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow-md border border-gray-100 cursor-pointer text-blue-500 hover:text-blue-600 transition-colors"
                                onClick={() => setProfileAvatarEdit(true)}
                            >
                                <div className="bg-blue-50 p-1.5 rounded-full">
                                    <FaEdit size={12} />
                                </div>
                            </div>
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-bold text-slate-800 tracking-tight leading-none">{user.name}</h2>
                            <div className="mt-2.5 inline-flex px-3 py-1 rounded-md bg-[#EDEFF2] text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                {user.role}
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => setProfileAvatarEdit(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-slate-700 font-bold text-sm shadow-sm hover:bg-gray-50 transition-all hover:border-gray-300 active:scale-95"
                    >
                        <FaEdit size={16} className="text-slate-400" />
                        <span>Change Photo</span>
                    </button>
                </div>

                {openProfileAvatarEdit && (
                    <UserProfileAvatarEdit open={openProfileAvatarEdit} close={() => setProfileAvatarEdit(false)} />
                )}

                <form className="space-y-10" onSubmit={handleSubmit}>
                    {/* Personal Info Card */}
                    <div className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)] border border-gray-100 space-y-8">
                        <h3 className="text-xl font-bold text-slate-800">Personal Info</h3>
                        
                        <div className="space-y-6">
                            {/* Full Name */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                    <MdPerson size={22} />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleOnChange}
                                    className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-xl text-slate-700 font-bold placeholder:text-slate-400 placeholder:font-medium outline-none transition-all focus:border-blue-100 focus:ring-4 focus:ring-blue-50/30"
                                    required
                                />
                            </div>

                            {/* Email Address */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 tracking-wide ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                        <MdEmail size={22} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleOnChange}
                                        className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-xl text-slate-700 font-bold placeholder:text-slate-400 placeholder:font-medium outline-none transition-all focus:border-blue-100 focus:ring-4 focus:ring-blue-50/30"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Mobile Number */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 tracking-wide ml-1">Mobile Number</label>
                                <div className="relative group/phone">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none border-r border-slate-200 pr-3">
                                        <span className="text-xl">🇮🇳</span>
                                        <span className="text-sm font-bold text-slate-400">+91</span>
                                    </div>
                                    <input
                                        type="text"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            setFormData(prev => {
                                                const updated = { ...prev, mobile: value };
                                                const isAnyModified = Object.keys(updated).some(key => updated[key] !== initialFormData[key]);
                                                setIsModified(isAnyModified);
                                                return updated;
                                            });
                                        }}
                                        placeholder="Enter 10-digit mobile number"
                                        className="w-full pl-24 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none transition-all focus:ring-4 focus:ring-slate-50 focus:border-slate-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="py-3 px-10 rounded-xl bg-white text-slate-600 font-bold text-sm border border-gray-200 hover:bg-gray-50 transition-all active:scale-[0.98]"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!isModified || loading}
                                className={`py-3 px-10 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${
                                    !isModified || loading
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200"
                                    : "bg-[#BC2E2E] text-white hover:bg-[#A32626] shadow-[#BC2E2E]/20"
                                }`}
                            >
                                <span>{loading ? "Saving..." : "Update Profile"}</span>
                            </button>
                        </div>

                    {/* Address Details Card */}
                    <div className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)] border border-gray-100 space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-800">Saved Addresses</h3>
                            <button
                                type="button"
                                onClick={() => setOpenAddress(true)}
                                disabled={addressList.filter(a => a.status).length >= 2}
                                className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm border ${
                                    addressList.filter(a => a.status).length >= 2
                                    ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                                    : "text-blue-600 hover:text-blue-700 bg-blue-50 border-blue-100"
                                }`}
                            >
                                <FiPlus size={14} />
                                <span>{addressList.filter(a => a.status).length >= 2 ? "LIMIT REACHED" : "ADD NEW"}</span>
                            </button>
                        </div>

                        {addressList.filter(a => a.status).length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
                                {addressList.filter(a => a.status).map((address) => (
                                    <AddressCard
                                        key={address._id}
                                        address={address}
                                        showRadio={false} // No radio needed in profile management
                                        onEdit={handleEditAddress}
                                        onDelete={handleDeleteAddress}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div 
                                onClick={() => setOpenAddress(true)}
                                className="border-2 border-dashed border-slate-100 rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 transition-all text-slate-400 hover:text-slate-600"
                            >
                                <FiPlus size={32} />
                                <p className="text-sm font-bold uppercase tracking-widest">Add your first address</p>
                            </div>
                        )}
                    </div>
                </form>

                {/* Modals */}
                {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
                {openEditAddress && <EditAddressDetails data={editData} close={() => setOpenEditAddress(false)} />}
                <DeleteConfirmation
                    open={openDeleteConfirm}
                    close={() => setOpenDeleteConfirm(false)}
                    confirm={confirmDeleteAddress}
                    title="Delete Address"
                    message="Are you sure you want to remove this address? This action cannot be undone."
                />
            </div>
            </div>
        </section>
    );
};

export default Profile;
