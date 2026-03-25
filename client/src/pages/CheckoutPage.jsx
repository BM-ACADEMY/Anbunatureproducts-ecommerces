import React, { useState } from "react";
import { useGlobalContext } from "../provider/GlobalProvider";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import AddAddress from "../components/AddAddress";
import { useSelector } from "react-redux";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { FiEdit2, FiTrash2, FiPlus, FiTruck } from "react-icons/fi";
import { MdPayment } from "react-icons/md";
import EditAddressDetails from "../components/EditAddressDetails";
import Breadcrumbs from "../components/Breadcrumbs";
import DeleteConfirmation from "../components/DeleteConfirmation";


const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } =
    useGlobalContext();

  const [openAddress, setOpenAddress] = useState(false);
  const [openEditAddress, setOpenEditAddress] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editData, setEditData] = useState({});
  const { fetchAddress } = useGlobalContext();

  const addressList = useSelector((state) => state.addresses.addressList);
  const [selectAddress, setSelectAddress] = useState("");

  const cartItemsList = useSelector((state) => state.cartItem.cart);
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-select first active address
  React.useEffect(() => {
    if (!selectAddress && addressList.length > 0) {
      const firstActive = addressList.find(a => a.status);
      if (firstActive) {
        setSelectAddress(firstActive._id);
      }
    }
  }, [addressList, selectAddress]);

  // Single item override from Buy Now
  const singleItem = location.state?.singleItem;

  const displayCartItems = singleItem ? [singleItem] : cartItemsList;

  const displayTotalQty = singleItem
    ? singleItem.quantity
    : totalQty;

  const displayTotalPrice = singleItem
    ? singleItem.selectedAttributes.reduce((sum, attr) => sum + (attr.price || 0), 0) * singleItem.quantity
    : totalPrice;

  // Helper function to check if an address is currently selected
  const isAddressSelected = () => {
    return !!selectAddress && addressList.some(a => a._id === selectAddress && a.status);
  };

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
        if (selectAddress === deleteId) {
            setSelectAddress("");
        }
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


  const handleCashOnDelivery = async () => {
    if (!isAddressSelected()) {
      toast.error("Please select a delivery address first.");
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: displayCartItems,
          addressId: selectAddress,
        },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        if (!singleItem) {
            fetchCartItem?.();
        }
        fetchOrder?.();
        navigate("/success", {
          state: { text: "Order" },
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleOnlinePayment = async () => {
    // This function is intended to be called when the actual payment initiation occurs,
    // potentially from the /processing page, or if you re-introduce direct online payment.
    if (!isAddressSelected()) {
      toast.error("Please select a delivery address first.");
      return;
    }

    try {
      toast.loading("Redirecting to payment...");
      const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
      const stripePromise = await loadStripe(stripePublicKey);

      const response = await Axios({
        ...SummaryApi.payment_url,
        data: {
          list_items: displayCartItems,
          addressId: selectAddress,
        },
      });

      const { data: responseData } = response;
      stripePromise.redirectToCheckout({ sessionId: responseData.id });

      if (!singleItem) {
          fetchCartItem?.();
      }
      fetchOrder?.();
    } catch (error) {
      AxiosToastError(error);
    }
  };

  // This function is triggered by the "Online Payment" button on this page.
  // It checks for address selection and then navigates to the /processing page.
  const handleProceedToPayment = () => {
    if (!isAddressSelected()) {
      toast.error("Please select a delivery address first.");
      return;
    }
    // If an address is selected, navigate to the processing page.
    navigate("/processing", { state: { singleItem } });
  };

  return (
    <section className="min-h-screen bg-[#fcf8ed] py-8 lg:py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-6">
            <Breadcrumbs />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

        {/* Left Side: Address Section */}
        <div className="w-full lg:w-[65%]">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Checkout</h2>
          </div>

          <div className="bg-white shadow-sm border border-slate-200 rounded-3xl p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-700 uppercase text-xs tracking-widest">Select Shipping Address</h3>
                {addressList.filter(a => a.status).length < 2 && (
                    <button
                        onClick={() => setOpenAddress(true)}
                        className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full transition-all"
                    >
                        <FiPlus size={14} />
                        <span>NEW ADDRESS</span>
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addressList.filter(a => a.status).map((address, index) => (
                <div
                  key={address._id}
                  className={`relative border-2 rounded-2xl p-4 transition-all duration-300 ${
                    selectAddress === address._id
                    ? "border-blue-300 bg-blue-50/30 shadow-md"
                    : "border-slate-100 hover:border-slate-200 hover:shadow-sm"
                  }`}
                >
                  <label
                    htmlFor={`address${address._id}`}
                    className="flex gap-3 items-start cursor-pointer"
                  >
                    <input
                      id={`address${address._id}`}
                      type="radio"
                      value={address._id}
                      checked={selectAddress === address._id}
                      onChange={(e) => setSelectAddress(e.target.value)}
                      name="address"
                      className="accent-blue-600 mt-1 h-4 w-4 flex-shrink-0"
                    />
                    <div className="flex-grow min-w-0 pr-2">
                        <p className="text-[13px] font-bold text-slate-800 leading-snug line-clamp-2">
                            {address.address_line}{address.address_line_2 && `, ${address.address_line_2}`}
                        </p>

                      <div className="text-[11px] text-slate-500 mt-2 space-y-1">
                        <p className="font-medium">{address.city}, {address.state}</p>
                        <p className="font-bold text-slate-400">{address.pincode}</p>
                        <p className="font-bold text-slate-700 pt-1 flex items-center gap-1">
                            <span className="text-[9px] bg-blue-50 text-blue-500 px-1 rounded border border-blue-100 uppercase tracking-tighter font-black">PH</span>
                            {address.mobile}
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Actions Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-end gap-2">
                      <button
                          onClick={() => handleEditAddress(address)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit Address"
                      >
                          <FiEdit2 size={13} />
                      </button>
                      <button
                          onClick={() => handleDeleteAddress(address._id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Address"
                      >
                          <FiTrash2 size={13} />
                      </button>
                  </div>
                </div>
              ))}

              {/* Add New Address Card Placeholder */}
              {(addressList.filter(a => a.status).length === 0) && (
                  <div
                    onClick={() => setOpenAddress(true)}
                    className="md:col-span-2 border-2 border-dashed border-slate-100 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 transition-all text-slate-400 hover:text-slate-600"
                  >
                      <FiPlus size={32} />
                      <p className="text-sm font-bold">Add your first shipping address</p>
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="w-full max-w-md">
          <div className="bg-white shadow-lg rounded-xl p-6 sticky top-20 flex flex-col max-h-[calc(100vh-100px)]">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Order Summary</h2>

            {/* Product List */}
            <div className="flex-grow overflow-y-auto mb-6 pr-2 custom-scrollbar">
              <div className="space-y-4">
                {displayCartItems.map((item, index) => {
                  const itemOfferPrice = item.selectedAttributes.reduce(
                    (sum, attr) => sum + (attr.offerPrice || attr.price || 0),
                    0
                  );
                  const itemOriginalPrice = item.selectedAttributes.reduce(
                    (sum, attr) => sum + (attr.originalPrice || attr.price || 0),
                    0
                  );
                  return (
                    <div key={index} className="flex gap-3 items-start p-2 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                        <img
                          src={item.productId?.image[0]}
                          alt={item.productId?.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="font-bold text-gray-800 text-sm line-clamp-1">
                          {item.productId?.name}
                        </h4>
                        <p className="text-[10px] text-gray-500 italic mb-1">
                          {item.selectedAttributes.map(a => `${a.attributeName}: ${a.optionName}`).join(", ")}
                        </p>
                        <div className="flex justify-between items-end">
                          <span className="text-xs font-semibold text-gray-600">Qty: {item.quantity}</span>
                          <div className="flex flex-col items-end">
                            {itemOriginalPrice > itemOfferPrice && (
                              <span className="text-[10px] text-gray-400 line-through">
                                {DisplayPriceInRupees(itemOriginalPrice)}
                              </span>
                            )}
                            <span className="text-sm font-bold text-green-700">
                              {DisplayPriceInRupees(itemOfferPrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 text-sm text-gray-700 mt-auto pt-4 border-t border-gray-100">
              <div className="flex justify-between">
                <span>Items Total</span>
                <span className="font-semibold text-gray-900">
                  {DisplayPriceInRupees(displayTotalPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Quantity</span>
                <span>{displayTotalQty} items</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Shipping</span>
                <span className="text-green-600 font-medium tracking-wide">FREE</span>
              </div>

              <div className="pt-2 flex justify-between text-lg font-extrabold text-blue-700">
                <span>Grand Total</span>
                <span>{DisplayPriceInRupees(displayTotalPrice)}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {/* Online Payment Button - Triggers address check and navigation */}
              <button
                onClick={handleProceedToPayment}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition flex items-center justify-center gap-2"
              >
                <MdPayment size={20} />
                <span>Online Payment</span>
              </button>

              <div className="flex items-center justify-center gap-2 mt-1 py-2 border-t border-slate-50">
                  <FiTruck className="text-black" size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-black opacity-80">Deliver within 2 to 5 days all over India</span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

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

    </section>
  );
};

export default CheckoutPage;
