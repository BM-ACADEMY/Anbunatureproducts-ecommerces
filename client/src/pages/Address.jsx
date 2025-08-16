import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import AddAddress from "../components/AddAddress";
import EditAddressDetails from "../components/EditAddressDetails";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import {
  MdDelete,
  MdEdit,
  MdAdd,
  MdLocationOn,
  MdMoreVert,
  MdCancel,
} from "react-icons/md"; // Correctly import icons
import { useGlobalContext } from "../provider/GlobalProvider";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Addresses</h1>
          <p className="text-gray-600">Manage your shipping addresses</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {addressList.map((address) => (
          <div
            key={address._id}
            className={`relative border rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 ${
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
                  className="p-2 rounded-full hover:bg-gray-100"
                  aria-label="More options"
                >
                  <MdMoreVert size={20} />
                </button>
                {menuOpenId === address._id && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-50">
                    <button
                      onClick={() => {
                        setEditData(address);
                        setOpenEdit(true);
                        setMenuOpenId(null);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAddressId(address._id);
                        setDeleteDialogOpen(true);
                        setMenuOpenId(null);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 mb-4">
              <div className="bg-indigo-100 p-2 rounded-full">
                <MdLocationOn className="text-indigo-600" size={20} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {address.name || "Shipping Address"}
                </h3>
                <p className="text-sm text-gray-500">
                  {address.address_type || "Home/Office"}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-gray-700">
              <p>{address.address_line}</p>
              <p>
                {address.city}, {address.state} {address.pincode}
              </p>
              <p>{address.country}</p>
              <p className="mt-3 font-medium">Phone: {address.mobile}</p>
            </div>
          </div>
        ))}

        <div
          onClick={() => setOpenAddress(true)}
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors duration-200"
        >
          <div className="bg-indigo-100 p-3 rounded-full mb-3">
            <MdAdd className="text-indigo-600" size={24} />
          </div>
          <h3 className="font-medium text-gray-800">Add New Address</h3>
          <p className="text-sm text-gray-500 text-center mt-1">
            Click here to add a new shipping address
          </p>
        </div>
      </div>

      {/* Modals */}
      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
      {openEdit && <EditAddressDetails data={editData} close={() => setOpenEdit(false)} />}

      {/* Delete Confirmation Dialog */}
      {/* Delete Confirmation Dialog */}
<Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
  <DialogTitle>Confirm Delete</DialogTitle>
  <DialogContent>
    <Typography>Are you sure you want to delete this address?</Typography>
  </DialogContent>
  <DialogActions>
    <Button
      onClick={() => setDeleteDialogOpen(false)}
      color="inherit"
       // Correctly using React Icon for Cancel
     
    >
      Cancel
    </Button>
    <Button
      onClick={async () => {
        await handleDisableAddress(selectedAddressId);
        setDeleteDialogOpen(false);
        setSelectedAddressId(null);
      }}
      color="error"
       // Correctly using React Icon for Delete
    >
      Delete
    </Button>
  </DialogActions>
</Dialog>

    </div>
  );
};

export default Address;
