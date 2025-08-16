import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGlobalContext } from "../provider/GlobalProvider";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import uploadImage from "../utils/UploadImage";
import { FaCopy, FaCheckCircle } from "react-icons/fa"; // Import icons
import Qrcodeiamge from '../assets/qrcodeimage.jpg'

const Processing = () => {
  const { totalPrice, totalQty, fetchCartItem, fetchOrder } =
    useGlobalContext();
  const cartItemsList = useSelector((state) => state.cartItem.cart);
  const addressList = useSelector((state) => state.addresses.addressList);
  const user = useSelector((state) => state.user);

  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false); // New state for copy icon
  const navigate = useNavigate();

  const upiId = "lallip9188-3@oksbi"; // Define UPI ID here

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  useEffect(() => {
    if (step === 4) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step, navigate]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
      setImageFile(file);
    } else {
      setUploadedImage(null);
      setImageFile(null);
    }
  };

  const handleCopyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setIsCopied(true);
      toast.success("UPI ID copied!");
      setTimeout(() => setIsCopied(false), 2000); // Reset icon after 2 seconds
    } catch (err) {
      console.error("Failed to copy UPI ID: ", err);
      toast.error("Failed to copy UPI ID.");
    }
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      let customImageUrl = "";
      if (imageFile) {
        const uploadResponse = await uploadImage(imageFile);
        if (uploadResponse.data.success) {
          customImageUrl = uploadResponse.data.data.url;
        } else {
          toast.error("Image upload failed");
          setIsLoading(false);
          return;
        }
      }

      const payload = {
        list_items: cartItemsList,
        addressId: addressList[selectedAddress]?._id,
      };

      if (customImageUrl) {
        payload.customImage = customImageUrl;
      }

      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: payload,
      });

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        fetchCartItem?.();
        fetchOrder?.();
        setStep(4);
      } else {
        toast.error(responseData.message || "Failed to place order.");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error("Failed to place order: " + (error.response?.data?.message || error.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    const currentAddress = addressList[selectedAddress];

    switch (step) {
      case 1:
        return (
          <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8">
            {/* Payment Section */}
            <div className="text-center mb-8 border-b border-gray-200 pb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Complete Your Payment
              </h2>
              <p className="text-gray-600 mb-5">
                Scan the QR code below to pay the total amount.
              </p>
              <div className="mt-4 mb-2">
                <p className="text-lg font-semibold text-gray-800"><span className="text-blue-700">Name:</span> lalli p</p>
              </div>
              <div className="flex justify-center">
                <img
                  src={Qrcodeiamge}
                  alt="Payment QR Code"
                  className="w-56 h-56 object-contain rounded-lg shadow-md border"
                />
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                <p className="text-lg text-gray-700 font-medium">UPI ID: {upiId}</p>
                <button
                  onClick={handleCopyUpiId}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  aria-label="Copy UPI ID"
                >
                  {isCopied ? (
                    <FaCheckCircle className="text-green-500 text-xl" />
                  ) : (
                    <FaCopy className="text-blue-600 text-xl" />
                  )}
                </button>
              </div>
              <div className="mt-6">
                <p className="text-lg text-gray-700">Total Amount to Pay:</p>
                <p className="text-3xl font-extrabold text-blue-600">
                  {DisplayPriceInRupees(totalPrice)}
                </p>
              </div>
            </div>

            {/* Order Summary Section */}
            <h3 className="text-xl font-bold text-gray-800 mb-5">
              Order Summary ({totalQty} {totalQty > 1 ? "items" : "item"})
            </h3>
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {cartItemsList.map((item, index) => {
                const itemPrice = item.selectedAttributes.reduce(
                  (sum, attr) => sum + (attr.price || 0),
                  0
                );
                const selectedAttributesDisplay = item.selectedAttributes
                  .map((attr) => `${attr.attributeName}: ${attr.optionName}`)
                  .join(", ");

                return (
                  <div
                    key={item._id || index}
                    className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200"
                  >
                    <img
                      src={item.productId?.image?.[0]}
                      alt={item.productId?.name}
                      className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-lg text-gray-900 truncate">
                        {item.productId?.name}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {selectedAttributesDisplay || "No attributes selected"}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-blue-700 font-semibold">
                          Price: {DisplayPriceInRupees(itemPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Button alignment: full width on small, then centered and max-w on larger */}
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setStep(2)}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg transition-all transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                I have Paid, Proceed
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-5">
              Upload Custom Image <span className="text-gray-500 text-base">(Optional)</span>
            </h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full mb-4 p-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {uploadedImage && (
              <img
                src={uploadedImage}
                alt="Uploaded Preview"
                className="w-64 h-64 object-cover rounded mb-4 mx-auto"
              />
            )}
            <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-end"> {/* Use flex-col for small, flex-row for sm+, justify-end */}
              <button
                onClick={() => setStep(1)}
                className="w-full sm:w-auto px-8 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold transition"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition disabled:bg-gray-400"
                disabled={!imageFile}
              >
                Next
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-5">
              Review Order
            </h2>
            <div className="mb-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Delivery Details</h3>
              <h3 className="font-semibold text-lg mt-4 mb-2">
                Delivery Address
              </h3>
              {currentAddress ? (
                <>
                  {user.name && <p className="">{user.name}</p>}
                  {user.email && <p>{user.email}</p>}
                  {currentAddress.mobile && (
                    <p>{currentAddress.mobile}</p>
                  )}
                  <p>{currentAddress.address_line}</p>
                  <p>
                    {currentAddress.city}, {currentAddress.state}
                  </p>
                  <p>
                    {currentAddress.country} - {currentAddress.pincode}
                  </p>
                </>
              ) : (
                <p className="text-red-500">
                  No address selected or available.
                </p>
              )}
            </div>
            <div className="mb-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Order Summary</h3>
              <p className="flex justify-between">
                <span>Total Quantity:</span>
                <span>{totalQty} items</span>
              </p>
              <p className="flex justify-between font-semibold text-xl mt-2">
                <span>Grand Total:</span>
                <span>{DisplayPriceInRupees(totalPrice)}</span>
              </p>
            </div>
            {uploadedImage && (
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-2">Uploaded Image</h3>
                <img
                  src={uploadedImage}
                  alt="Uploaded Preview"
                  className="w-64 h-64 object-cover rounded"
                />
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-end"> {/* Use flex-col for small, flex-row for sm+, justify-end */}
              <button
                onClick={() => setStep(2)}
                className="w-full sm:w-auto px-8 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold transition"
              >
                Back
              </button>
              <button
                onClick={handlePlaceOrder}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition disabled:bg-gray-400 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="bg-white shadow rounded-xl p-6 text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-5">
              Order Successful!
            </h2>
            <p className="text-gray-700 mb-4">
              Your custom order has been placed successfully.
            </p>
            <div className="flex justify-center mt-6"> {/* Centering the single button */}
              <button
                onClick={() => navigate("/")}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
              >
                Back to Home
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-tr from-blue-50 to-white py-10">
      <div className="container mx-auto px-4">
        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center">
            <div
              className={`flex-1 text-center ${
                step >= 1 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div className="relative mb-2">
                <div className="w-10 h-10 mx-auto bg-blue-600 rounded-full text-lg text-white flex items-center justify-center">
                  1
                </div>
              </div>
              <p className="font-semibold text-xs md:text-sm">Payment</p>
            </div>
            <div
              className={`flex-1 border-t-2 transition-colors duration-500 ${
                step >= 2 ? "border-blue-600" : "border-gray-300"
              }`}
            ></div>
            <div
              className={`flex-1 text-center ${
                step >= 2 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div className="relative mb-2">
                <div
                  className={`w-10 h-10 mx-auto rounded-full text-lg flex items-center justify-center transition-colors duration-500 ${
                    step >= 2
                      ? "bg-blue-600 text-white"
                      : "bg-white border-2 border-gray-300 text-gray-500"
                  }`}
                >
                  2
                </div>
              </div>
              <p className="font-semibold text-xs md:text-sm">Upload</p>
            </div>
            <div
              className={`flex-1 border-t-2 transition-colors duration-500 ${
                step >= 3 ? "border-blue-600" : "border-gray-300"
              }`}
            ></div>
            <div
              className={`flex-1 text-center ${
                step >= 3 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div className="relative mb-2">
                <div
                  className={`w-10 h-10 mx-auto rounded-full text-lg flex items-center justify-center transition-colors duration-500 ${
                    step >= 3
                      ? "bg-blue-600 text-white"
                      : "bg-white border-2 border-gray-300 text-gray-500"
                  }`}
                >
                  3
                </div>
              </div>
              <p className="font-semibold text-xs md:text-sm">Review</p>
            </div>
            <div
              className={`flex-1 border-t-2 transition-colors duration-500 ${
                step >= 4 ? "border-blue-600" : "border-gray-300"
              }`}
            ></div>
            <div
              className={`flex-1 text-center ${
                step >= 4 ? "text-green-600" : "text-gray-400"
              }`}
            >
              <div className="relative mb-2">
                <div
                  className={`w-10 h-10 mx-auto rounded-full text-lg flex items-center justify-center transition-colors duration-500 ${
                    step >= 4
                      ? "bg-green-600 text-white"
                      : "bg-white border-2 border-gray-300 text-gray-500"
                  }`}
                >
                  ✓
                </div>
              </div>
              <p className="font-semibold text-xs md:text-sm">Success</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">{renderStep()}</div>
      </div>
    </section>
  );
};

export default Processing;