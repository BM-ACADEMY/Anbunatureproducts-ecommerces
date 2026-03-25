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

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } =
    useGlobalContext();

  const [openAddress, setOpenAddress] = useState(false);
  const addressList = useSelector((state) => state.addresses.addressList);
  const [selectAddress, setSelectAddress] = useState(0);
  const cartItemsList = useSelector((state) => state.cartItem.cart);
  const navigate = useNavigate();
  const location = useLocation();

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
    return addressList && addressList.length > 0 && addressList[selectAddress] && addressList[selectAddress].status;
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
          addressId: addressList[selectAddress]?._id,
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
          addressId: addressList[selectAddress]?._id,
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
    <section className="min-h-screen bg-gradient-to-tr from-blue-50 to-white py-10">
      <div className="container mx-auto px-4 lg:px-8 flex flex-col lg:flex-row gap-10">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-5">Select Delivery Address</h2>
          <div className="bg-white shadow rounded-xl p-6 space-y-4">
            {/* Map through addressList to display available addresses */}
            {addressList.map((address, index) => (
              <label
                key={index}
                htmlFor={`address${index}`}
                // Dynamically apply styling based on selection and address status
                className={`border rounded-xl p-5 cursor-pointer block transition-all duration-200 hover:border-blue-400 ${
                  selectAddress === index ? "border-blue-500 bg-blue-50" : "border-gray-200"
                } ${!address.status ? "hidden" : ""}`} 
              >
                <div className="flex gap-4 items-start">
                  <input
                    id={`address${index}`}
                    type="radio"
                    value={index}
                    checked={selectAddress === index}
                    onChange={(e) => setSelectAddress(Number(e.target.value))} // Ensure value is a number
                    name="address"
                    className="accent-blue-600 mt-1"
                  />
                  <div className="text-sm text-gray-700 space-y-1">
                    <p className="font-semibold">{address.address_line}</p>
                    <p>
                      {address.city}, {address.state}
                    </p>
                    <p>
                      {address.country} - {address.pincode}
                    </p>
                    <p className="text-gray-500">Mobile: {address.mobile}</p>
                  </div>
                </div>
              </label>
            ))}

            {/* Button to add a new address */}
            <div
              onClick={() => setOpenAddress(true)}
              className="border-2 border-dashed border-blue-400 text-blue-600 rounded-xl flex items-center justify-center h-14 cursor-pointer hover:bg-blue-50 transition"
            >
              + Add New Address
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
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition"
              >
                Online Payment
              </button>

              {/* Cash on Delivery Button - Currently commented out in your original code,
                  but logic for address check is included if uncommented. */}
              {/* <button
                onClick={handleCashOnDelivery}
                className="w-full py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold transition"
              >
                Cash on Delivery
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* AddAddress Modal/Component */}
      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  );
};

export default CheckoutPage;