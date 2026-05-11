import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegUser, FaEdit, FaSave, FaCamera, FaTimes } from "react-icons/fa";
import { MdEmail, MdPhone, MdPerson, MdVerifiedUser } from "react-icons/md";
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
import { FiPlus, FiMapPin } from 'react-icons/fi';
import Breadcrumbs from '../components/Breadcrumbs';

const Profile = () => {
    const user = useSelector(state => state.user);
    const addressList = useSelector(state => state.addresses.addressList);
    const { fetchAddress } = useGlobalContext();
    const dispatch = useDispatch();

    const [openProfileAvatarEdit, setProfileAvatarEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isModified, setIsModified] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

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

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            setIsModified(Object.keys(updated).some(key => updated[key] !== initialFormData[key]));
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userResponse = await Axios({ ...SummaryApi.updateUserDetails, data: formData });
            if (userResponse.data.success) {
                toast.success("Profile updated successfully");
                const updatedUserData = await fetchUserDetails();
                dispatch(setUserDetails(updatedUserData.data));
                setIsEditMode(false);
                setIsModified(false);
            }
        } catch (error) { AxiosToastError(error); } finally { setLoading(false); }
    };

    // Reusable styling for the cards
    const cardStyle = "bg-white rounded-3xl p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 ring-1 ring-slate-100";

    return (
        <section className="min-h-screen bg-[#fdf5e6] py-6 lg:py-10">
            <div className={`container px-4 ${user.role === 'ADMIN' ? 'max-w-5xl lg:ml-10' : 'mx-auto max-w-6xl'}`}>
                {user.role !== "ADMIN" && <Breadcrumbs />}

                <header className="my-8">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Profile Settings</h1>
                    <p className="text-slate-500 font-medium">Manage your account information{user.role !== "ADMIN" && " and saved addresses"}</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                    {/* TOP LEFT: Avatar Card */}
                    <div className="lg:col-span-4">
                        <div className={`${cardStyle} flex border-1 border-[#DBDBDB] flex-col items-center justify-center text-center h-full`}>
                            <div className="relative mb-6">
                                <div className="w-32 h-32 lg:w-36 lg:h-36 rounded-full p-1 bg-gradient-to-tr from-[#BC2E2E] to-orange-400">
                                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-white bg-slate-50">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300"><FaRegUser size={40} /></div>
                                        )}
                                    </div>
                                </div>
                                <button onClick={() => setProfileAvatarEdit(true)} className="absolute bottom-1 right-1 bg-slate-900 text-white p-2.5 rounded-full hover:scale-110 transition-transform shadow-lg border-2 border-white">
                                    <FaCamera size={14} />
                                </button>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 justify-center">
                                    {user.name} 
                                    {user.role === "ADMIN" && <MdVerifiedUser className="text-blue-500" title="Admin Verified" size={18} />}
                                </h2>
                                {user.role === "ADMIN" ? (
                                    <span className="bg-red-50 text-[#BC2E2E] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100 shadow-sm">
                                        Admin
                                    </span>
                                ) : (
                                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{user.role}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* TOP RIGHT: Personal Info Card */}
                    <div className={user.role === "ADMIN" ? "lg:col-span-7" : "lg:col-span-8"}>
                        <div className={`${cardStyle} h-full border-1 border-[#DBDBDB] !p-0 overflow-hidden`}>
                            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                                <h3 className="font-bold text-slate-800">Personal Details</h3>
                                <button
                                    onClick={() => isEditMode ? setIsEditMode(false) : setIsEditMode(true)}
                                    className={`text-sm font-bold flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${isEditMode ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-600'}`}
                                >
                                    {isEditMode ? <><FaTimes /> Cancel</> : <><FaEdit /> Edit</>}
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-4 lg:space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                                        <div className="relative">
                                            <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input type="text" name="name" disabled={!isEditMode} value={formData.name} onChange={handleOnChange} className={`w-full pl-11 pr-4 py-3 rounded-2xl border transition-all font-semibold outline-none ${isEditMode ? 'bg-white border-slate-300 focus:border-[#BC2E2E] ring-1 ring-transparent focus:ring-red-100' : 'bg-slate-50/50 border-transparent text-slate-600'}`} />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Phone</label>
                                        <div className={`flex items-center px-4 py-3 rounded-2xl border transition-all ${isEditMode ? 'bg-white border-slate-300 focus-within:ring-1 focus-within:ring-red-100 focus-within:border-[#BC2E2E]' : 'bg-slate-50/50 border-transparent text-slate-600'}`}>
                                            <MdPhone className="text-slate-400 mr-3" />
                                            <span className="text-slate-400 font-bold mr-1">+91</span>
                                            <input type="text" name="mobile" disabled={!isEditMode} value={formData.mobile} onChange={(e) => handleOnChange({ target: { name: 'mobile', value: e.target.value.replace(/\D/g, '').slice(0, 10) } })} className="w-full bg-transparent outline-none font-semibold" />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Email</label>
                                        <div className="relative">
                                            <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input type="email" name="email" disabled={!isEditMode} value={formData.email} onChange={handleOnChange} className={`w-full pl-11 pr-4 py-3 rounded-2xl border transition-all font-semibold outline-none ${isEditMode ? 'bg-white border-slate-300 focus:border-[#BC2E2E] ring-1 ring-transparent focus:ring-red-100' : 'bg-slate-50/50 border-transparent text-slate-600'}`} />
                                        </div>
                                    </div>
                                </div>
                                {isEditMode && (
                                    <button type="submit" disabled={!isModified || loading} className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${!isModified || loading ? 'bg-slate-100 text-slate-400' : 'bg-[#BC2E2E] text-white shadow-lg shadow-red-100 hover:bg-red-700'}`}>
                                        <FaSave /> {loading ? "Saving..." : "Save Changes"}
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* BOTTOM: Address Details (Full Width) - Only for non-admin users */}
                    {user.role !== "ADMIN" && (
                        <div className="lg:col-span-12">
                            <div className={`${cardStyle} border-1 border-[#DBDBDB] !p-0 overflow-hidden`}>
                                <div className="px-6 py-5 lg:px-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                                    <div className="flex items-center gap-2">
                                        <FiMapPin className="text-[#BC2E2E]" size={20} />
                                        <h3 className="font-bold text-slate-800">Saved Shipping Addresses</h3>
                                    </div>

                                    {/* Limit logic updated to 2 addresses */}
                                    <button
                                        onClick={() => setOpenAddress(true)}
                                        disabled={addressList.filter(a => a.status).length >= 2}
                                        className={`p-2 rounded-xl transition-all flex items-center gap-2 px-4 shadow-sm ${addressList.filter(a => a.status).length >= 2
                                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                                : "bg-slate-900 text-white hover:bg-black"
                                            }`}
                                    >
                                        <FiPlus size={18} />
                                        <span className="text-xs font-bold uppercase hidden sm:inline">
                                            {addressList.filter(a => a.status).length >= 2 ? "Limit Reached" : "Add New"}
                                        </span>
                                    </button>
                                </div>

                                <div className="p-6 lg:p-8">
                                    {addressList.filter(a => a.status).length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                            {addressList.filter(a => a.status).map((address) => (
                                                <AddressCard
                                                    key={address._id}
                                                    address={address}
                                                    showRadio={false}
                                                    onEdit={(addr) => { setEditData(addr); setOpenEditAddress(true); }}
                                                    onDelete={(id) => { setDeleteId(id); setOpenDeleteConfirm(true); }}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => setOpenAddress(true)}
                                            className="border-2 border-dashed border-slate-200 rounded-3xl py-12 flex flex-col items-center justify-center gap-3 group cursor-pointer hover:bg-slate-50 hover:border-[#BC2E2E]/30 transition-all"
                                        >
                                            <div className="p-4 bg-slate-50 rounded-full text-slate-300 group-hover:text-[#BC2E2E] transition-all">
                                                <FiPlus size={32} />
                                            </div>
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No addresses found. Add up to 2 addresses.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {openProfileAvatarEdit && <UserProfileAvatarEdit open={openProfileAvatarEdit} close={() => setProfileAvatarEdit(false)} />}
                {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
                {openEditAddress && <EditAddressDetails data={editData} close={() => setOpenEditAddress(false)} />}
                <DeleteConfirmation
                    open={openDeleteConfirm}
                    close={() => setOpenDeleteConfirm(false)}
                    confirm={async () => {
                        try {
                            const response = await Axios({ ...SummaryApi.disableAddress, data: { _id: deleteId } });
                            if (response.data.success) {
                                toast.success(response.data.message);
                                setOpenDeleteConfirm(false);
                                fetchAddress();
                            }
                        } catch (error) { AxiosToastError(error); }
                    }}
                    title="Remove Address"
                    message="Are you sure you want to delete this address?"
                />
            </div>
        </section>
    );
};

export default Profile;