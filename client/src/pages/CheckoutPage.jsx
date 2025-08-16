import React, { useState } from "react";
import { useGlobalContext } from "../provider/GlobalProvider";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import AddAddress from "../components/AddAddress";
import { useSelector } from "react-redux";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } =
    useGlobalContext();

  const [openAddress, setOpenAddress] = useState(false);
  const addressList = useSelector((state) => state.addresses.addressList);
  // Initialize with 0 for the first address, assuming addressList might be loaded
  // or a default selection is desired. Adjust if your initial state logic differs.
  const [selectAddress, setSelectAddress] = useState(0);
  const cartItemsList = useSelector((state) => state.cartItem.cart);
  const navigate = useNavigate();

  // Helper function to check if an address is currently selected
  const isAddressSelected = () => {
    // Ensure addressList exists, has elements, and the selected index is valid and active.
    // Assuming 'status' means the address is active/usable.
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
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
        },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        fetchCartItem?.();
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
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
        },
      });

      const { data: responseData } = response;
      stripePromise.redirectToCheckout({ sessionId: responseData.id });

      // Note: fetchCartItem and fetchOrder are typically called after a successful
      // payment confirmation from the payment gateway (e.g., in a Stripe webhook handler
      // or on your success page after verification). Calling them here might be premature
      // if the user doesn't complete the payment on Stripe's side.
      fetchCartItem?.();
      fetchOrder?.();
    } catch (error) {
      AxiosToastError(error);
    }
  };

  // This function is triggered by the "Online Payment" button on this page.
  // It checks for address selection and then navigates to the /processing route.
  const handleProceedToPayment = () => {
    if (!isAddressSelected()) {
      toast.error("Please select a delivery address first.");
      // Optional: If you want to automatically open the AddAddress modal when no address is selected
      // setOpenAddress(true);
      return;
    }
    // If an address is selected, navigate to the processing page.
    // The actual payment initiation will likely happen on the /processing page.
    navigate("/processing");
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
          <div className="bg-white shadow-lg rounded-xl p-6 sticky top-20">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Order Summary</h2>

            <div className="space-y-4 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Items Total</span>
                <span>
                  <span className="font-semibold text-gray-900">
                    {DisplayPriceInRupees(totalPrice)}
                  </span>
                </span>
              </div>
              <div className="flex justify-between">
                <span>Quantity</span>
                <span>{totalQty} items</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>

              <div className="border-t pt-4 flex justify-between text-base font-semibold text-gray-900">
                <span>Grand Total</span>
                <span>{DisplayPriceInRupees(totalPrice)}</span>
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