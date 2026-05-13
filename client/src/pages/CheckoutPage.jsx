import React, { useState } from "react";
import { useGlobalContext } from "../provider/GlobalProvider";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import AddAddress from "../components/AddAddress";
import { useSelector } from "react-redux";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { toast } from "sonner";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { FiEdit2, FiTrash2, FiPlus, FiTruck, FiHeart } from "react-icons/fi";
import { MdPayment } from "react-icons/md";
import EditAddressDetails from "../components/EditAddressDetails";
import Breadcrumbs from "../components/Breadcrumbs";
import DeleteConfirmation from "../components/DeleteConfirmation";
import AddressCard from "../components/AddressCard";


const CheckoutPage = () => {
  const { notDiscountTotalPrice, fetchCartItem, fetchOrder, totalQty, totalPrice, settings } =
    useGlobalContext();

  const [openAddress, setOpenAddress] = useState(false);
  const [openEditAddress, setOpenEditAddress] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editData, setEditData] = useState({});
  const { fetchAddress } = useGlobalContext();

  const addressList = useSelector((state) => state.addresses.addressList);
  const [selectAddress, setSelectAddress] = useState("");
  const [foundationSettings, setFoundationSettings] = useState(null);
  const [donationAmount, setDonationAmount] = useState(0);

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

  React.useEffect(() => {
    const fetchFoundation = async () => {
      try {
        const response = await Axios({ ...SummaryApi.getFoundation });
        if (response.data.success) {
          setFoundationSettings(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching foundation", error);
      }
    };
    fetchFoundation();
  }, []);

  // Single item override from Buy Now
  const singleItem = location.state?.singleItem;

  const displayCartItems = singleItem ? [singleItem] : cartItemsList;

  const displayTotalQty = singleItem
    ? singleItem.quantity
    : totalQty;

  const displayTotalOriginalPrice = singleItem
    ? singleItem.selectedAttributes.reduce((sum, attr) => sum + (attr.originalPrice || attr.price || 0), 0) * singleItem.quantity
    : notDiscountTotalPrice;

  const displayTotalOfferPrice = singleItem
    ? singleItem.selectedAttributes.reduce((sum, attr) => sum + (attr.price || 0), 0) * singleItem.quantity
    : totalPrice;

  const totalDiscount = displayTotalOriginalPrice - displayTotalOfferPrice;
  const discountPercentage = displayTotalOriginalPrice > 0 
    ? Math.round((totalDiscount / displayTotalOriginalPrice) * 100) 
    : 0;

  const displayGrandTotal = displayTotalOfferPrice + donationAmount + (displayTotalOfferPrice >= (settings?.freeShippingThreshold || 0) && settings?.freeShippingThreshold > 0 ? 0 : (settings?.shippingCharge || 0));

  const shippingCharge = (displayTotalOfferPrice >= (settings?.freeShippingThreshold || 0) && settings?.freeShippingThreshold > 0) ? 0 : (settings?.shippingCharge || 0);

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
          donationAmount: donationAmount,
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

  const handleProceedToPayment = () => {
    if (!isAddressSelected()) {
      toast.error("Please select a delivery address first.");
      return;
    }
    navigate("/processing", { state: { singleItem, donationAmount } });
  };

  return (
    <section className="min-h-screen bg-[#fcf8ed] py-8 lg:py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-6">
            <Breadcrumbs />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* Left Side: Address Section */}
        <div className="w-full lg:w-[65%] space-y-6">
          <div className="mb-2">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Checkout</h2>
          </div>

          <div className="bg-white shadow-sm border border-slate-200 rounded-3xl p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-700 uppercase text-xs tracking-widest">Select Shipping Address</h3>
                <button
                    onClick={() => setOpenAddress(true)}
                    disabled={addressList.filter(a => a.status).length >= 2}
                    className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all border ${
                        addressList.filter(a => a.status).length >= 2
                        ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                        : "text-blue-600 hover:text-blue-700 bg-blue-50 border-blue-100"
                    }`}
                >
                    <FiPlus size={14} />
                    <span>{addressList.filter(a => a.status).length >= 2 ? "LIMIT REACHED" : "NEW ADDRESS"}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-500">
              {addressList.filter(a => a.status).map((address, index) => (
                <AddressCard
                  key={address._id}
                  address={address}
                  isSelected={selectAddress === address._id}
                  onSelect={(id) => setSelectAddress(id)}
                  onEdit={handleEditAddress}
                  onDelete={handleDeleteAddress}
                />
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

        {/* Order Summary Sidebar Section */}
        <div className="w-full max-w-md lg:sticky lg:top-8">
          <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col max-h-[calc(100vh-100px)] border border-slate-100 overflow-y-auto custom-scrollbar">
            <h2 className="text-2xl font-bold mb-5 text-gray-800">Order Summary</h2>

            {/* Foundation Section - Matching Screenshot EXACTLY */}
            {foundationSettings?.isActive && (
              <div className="mb-6 bg-[#f0f7ff] rounded-2xl p-5 pb-6 border border-[#e5e7eb] relative flex-shrink-0 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="text-[15px] font-bold text-slate-800 leading-tight">{foundationSettings.title}</h2>
                    <p className="text-[12px] text-slate-500 font-medium leading-tight mt-0.5">{foundationSettings.description}</p>
                  </div>
                  <img src="/assets/common/logoheader.webp" alt="Logo" className="h-10 w-auto flex-shrink-0" />
                </div>
                
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {foundationSettings.amounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setDonationAmount(donationAmount === amount ? 0 : amount)}
                      className={`py-2 rounded-xl text-[11px] font-bold transition-all border shadow-sm ${
                        donationAmount === amount 
                        ? "bg-blue-600 text-white border-blue-600 shadow-md scale-105" 
                        : "bg-white text-slate-500 border-white hover:border-slate-200"
                      }`}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest leading-tight mt-2">Note: GST and No cost EMI will not apply</p>
              </div>
            )}

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
                    <div key={index} className="flex gap-3 items-start p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                        <img
                          src={item.productId?.image[0]}
                          alt={item.productId?.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="font-bold text-gray-800 text-xs line-clamp-1">
                          {item.productId?.name}
                        </h4>
                        <p className="text-[10px] text-gray-400 italic mb-1">
                          {item.selectedAttributes.map(a => `${a.attributeName}: ${a.optionName}`).join(", ")}
                        </p>
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] font-bold text-gray-500">Qty: {item.quantity}</span>
                          <span className="text-xs font-bold text-green-700">
                            {DisplayPriceInRupees(itemOfferPrice)}
                          </span>
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
                <span className="font-bold text-gray-900">
                  {DisplayPriceInRupees(displayTotalOfferPrice)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Total Quantity</span>
                <span className="font-medium">{displayTotalQty} {displayTotalQty > 1 ? "items" : "item"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className={`${shippingCharge === 0 ? "text-green-600 font-bold" : "text-gray-900 font-semibold"}`}>
                  {shippingCharge === 0 ? "FREE" : DisplayPriceInRupees(shippingCharge)}
                </span>
              </div>
              
              {donationAmount > 0 && (
                <div className="flex justify-between text-blue-600 font-bold bg-blue-50/50 px-3 py-2 rounded-lg border border-blue-100/50">
                  <span>Donation</span>
                  <span>+ {DisplayPriceInRupees(donationAmount)}</span>
                </div>
              )}

              <div className="pt-2 flex justify-between items-center text-xl font-black text-slate-900 border-t-2 border-dashed border-slate-100 mt-2">
                <span className="tracking-tight">Grand Total</span>
                <span className="text-blue-700">{DisplayPriceInRupees(displayGrandTotal)}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={handleProceedToPayment}
                className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold transition flex items-center justify-center gap-2 shadow-md shadow-green-100"
              >
                <MdPayment size={18} />
                <span>Online Payment</span>
              </button>

              <p className="text-[10px] text-slate-400 text-center mt-2 leading-relaxed">
                By proceeding, you agree to our <NavLink to="/terms-and-conditions" className="underline hover:text-green-600">Terms & Conditions</NavLink> and <NavLink to="/privacy-policy" className="underline hover:text-green-600">Privacy Policy</NavLink>.
              </p>

              <div className="flex items-center justify-center gap-2 mt-1 py-1">
                  <FiTruck className="text-black opacity-60" size={12} />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-black opacity-60">Deliver within 2 to 5 days all over India</span>
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
