import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import AddAddress from "../components/AddAddress";
import EditAddressDetails from "../components/EditAddressDetails";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { toast } from "sonner";
import AxiosToastError from "../utils/AxiosToastError";
import {
  MdDelete,
  MdEdit,
  MdAdd,
  MdLocationOn,
  MdMoreVert,
  MdCancel,
} from "react-icons/md"; 
import { FiMapPin, FiMoreVertical, FiPlus, FiTrash2, FiEdit3, FiX, FiAlertTriangle } from "react-icons/fi";
import { useGlobalContext } from "../provider/GlobalProvider";

const Address = () => {
  const addressList = useSelector((state) => state.addresses.addressList);
  const [openAddress, setOpenAddress] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const { fetchAddress } = useGlobalContext();
  const [menuOpenId, setMenuOpenId] = useState(null);
  const dropdownRefs = useRef({});

  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const handleDisableAddress = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data: { _id: id },
      });
      if (response.data.success) {
        toast.success("Address Removed");
        fetchAddress();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const currentRef = dropdownRefs.current[menuOpenId];
      if (currentRef && !currentRef.contains(event.target)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpenId]);

  return (
    <div className="bg-white min-h-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">My Addresses</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage your shipping and billing locations</p>
        </div>
        <button 
           onClick={() => setOpenAddress(true)}
           className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-indigo-100"
        >
           <FiPlus size={18} />
           <span>Add New</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {addressList.map((address) => (
          <div
            key={address._id}
            className={`group relative bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 ${
              !address.status && "hidden"
            }`}
          >
            <div
              className="absolute top-4 right-4 z-20"
              ref={(el) => (dropdownRefs.current[address._id] = el)}
            >
              <div className="relative">
                <button
                  onClick={() =>
                    setMenuOpenId(menuOpenId === address._id ? null : address._id)
                  }
                  className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                  aria-label="More options"
                >
                  <FiMoreVertical size={18} />
                </button>
                {menuOpenId === address._id && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
                      onClick={() => {
                        setEditData(address);
                        setOpenEdit(true);
                        setMenuOpenId(null);
                      }}
                      className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      <FiEdit3 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAddressId(address._id);
                        setDeleteDialogOpen(true);
                        setMenuOpenId(null);
                      }}
                      className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                      <FiTrash2 size={16} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="bg-indigo-50 p-3.5 rounded-2xl text-indigo-600 shadow-sm border border-indigo-100/50">
                <FiMapPin size={22} />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-gray-900 truncate tracking-tight">
                  {address.name || "Shipping Address"}
                </h3>
                <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">
                  {address.address_type || "Home/Office"}
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-sm font-medium text-gray-500 leading-relaxed">
              <p className="text-gray-900 font-bold">{address.address_line}</p>
              <p>
                {address.city}, {address.state}
              </p>
              <div className="flex items-center gap-1.5 py-1">
                 <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Pin</span>
                 <span className="text-gray-900 font-bold tracking-widest">{address.pincode}</span>
              </div>
              <p className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                 <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Mobile</span>
                 <span className="font-black text-slate-800">{address.mobile}</span>
              </p>
            </div>
          </div>
        ))}

        <button
          onClick={() => setOpenAddress(true)}
          className="group border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all duration-300 min-h-[220px]"
        >
          <div className="bg-white p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-sm border border-gray-100 group-hover:border-indigo-100 group-hover:text-indigo-600 text-gray-400">
            <FiPlus size={28} />
          </div>
          <h3 className="font-bold text-gray-800 text-lg">Add New Address</h3>
          <p className="text-sm text-gray-400 font-medium text-center mt-2 px-4 leading-snug">
            Save a new shipping location for faster checkout
          </p>
        </button>
      </div>

      {/* Modals */}
      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
      {openEdit && <EditAddressDetails data={editData} close={() => setOpenEdit(false)} />}

      {/* Delete Confirmation Modal */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setDeleteDialogOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 z-10 animate-in fade-in zoom-in duration-200 text-center">
             <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mx-auto mb-6">
                <FiAlertTriangle size={32} />
             </div>
             <h3 className="text-xl font-extrabold text-gray-900 mb-2">Delete Address?</h3>
             <p className="text-sm font-medium text-gray-400 leading-relaxed mb-8">
                Are you sure you want to remove this address? This action cannot be undone.
             </p>
             <div className="flex gap-4">
                <button
                  onClick={() => setDeleteDialogOpen(false)}
                  className="flex-1 py-3 text-sm font-bold text-gray-400 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await handleDisableAddress(selectedAddressId);
                    setDeleteDialogOpen(false);
                    setSelectedAddressId(null);
                  }}
                  className="flex-1 py-3 text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-2xl shadow-lg shadow-rose-100 transition-all active:scale-95"
                >
                  Confirm Delete
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Address;

