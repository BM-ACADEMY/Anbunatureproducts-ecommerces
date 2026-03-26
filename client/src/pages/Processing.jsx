import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGlobalContext } from "../provider/GlobalProvider";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useNavigate, useLocation } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { toast } from "sonner";
import uploadImage from "../utils/UploadImage";
import { FaCopy, FaCheckCircle } from "react-icons/fa"; // Import icons
import Qrcodeiamge from '../assets/qrcodeimage.jpg'

const Processing = () => {
  const { totalPrice, totalQty, fetchCartItem, fetchOrder } =
    useGlobalContext();
  const cartItemsList = useSelector((state) => state.cartItem.cart);
  const addressList = useSelector((state) => state.addresses.addressList);
  const user = useSelector((state) => state.user);
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

  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false); // New state for copy icon

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
        const uploadResponse = await uploadImage(imageFile, 'misc');
        if (uploadResponse.data.success) {
          customImageUrl = uploadResponse.data.data.url;
        } else {
          toast.error("Image upload failed");
          setIsLoading(false);
          return;
        }
      }

      const payload = {
        list_items: displayCartItems,
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
        if (!singleItem) {
            fetchCartItem?.();
        }
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
          <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Order Summary Section - Left Side */}
              <div className="p-8 md:p-10 bg-gray-50 border-r border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  Order Summary
                  <span className="text-sm font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    {displayTotalQty} {displayTotalQty > 1 ? "items" : "item"}
                  </span>
                </h3>
                <div className="space-y-5 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {displayCartItems.map((item, index) => {
                    const itemOfferPrice = item.selectedAttributes.reduce(
                      (sum, attr) => sum + (attr.offerPrice || attr.price || 0),
                      0
                    );
                    const itemOriginalPrice = item.selectedAttributes.reduce(
                        (sum, attr) => sum + (attr.originalPrice || attr.price || 0),
                        0
                    );
                    const selectedAttributesDisplay = item.selectedAttributes
                      .map((attr) => `${attr.attributeName}: ${attr.optionName}`)
                      .join(", ");

                    return (
                      <div
                        key={item._id || index}
                        className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm transition-hover hover:shadow-md"
                      >
                        <div className="relative">
                          <img
                            src={item.productId?.image?.[0]}
                            alt={item.productId?.name}
                            className="w-24 h-24 object-cover rounded-xl"
                          />
                          <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 truncate">
                            {item.productId?.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 italic leading-tight">
                            {selectedAttributesDisplay || "No attributes selected"}
                          </p>
                          <div className="flex justify-between items-end mt-2">
                            <div className="flex flex-col">
                                {itemOriginalPrice > itemOfferPrice && (
                                    <span className="text-xs text-gray-400 line-through">
                                        {DisplayPriceInRupees(itemOriginalPrice)}
                                    </span>
                                )}
                                <p className="text-blue-700 font-extrabold text-lg">
                                    {DisplayPriceInRupees(itemOfferPrice)}
                                </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2 text-gray-600">
                    <span>Total Quantity</span>
                    <span className="font-semibold">{displayTotalQty} items</span>
                  </div>
                  <div className="flex justify-between items-center text-xl font-extrabold text-gray-900 border-t border-dashed border-gray-300 pt-4">
                    <span>Grand Total</span>
                    <span className="text-blue-700">{DisplayPriceInRupees(displayTotalPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Section - Right Side */}
              <div className="p-8 md:p-10 flex flex-col items-center justify-center text-center bg-white">
                <div className="max-w-xs mx-auto">
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                      Complete Payment
                    </h2>
                    <p className="text-gray-500 text-sm mb-8">
                       Scan the QR code below using any UPI app like GPay, PhonePe, or Paytm.
                    </p>
                    
                    <div className="relative group p-4 bg-white rounded-3xl border-2 border-dashed border-blue-100 shadow-sm transition-all hover:border-blue-300">
                      <img
                        src={Qrcodeiamge}
                        alt="Payment QR Code"
                        className="w-56 h-56 object-contain rounded-2xl mx-auto"
                      />
                      <div className="mt-4 p-3 bg-blue-50 rounded-2xl flex items-center justify-between gap-3">
                         <div className="flex flex-col items-start px-1 overflow-hidden">
                           <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">UPI ID</span>
                           <span className="text-sm font-bold text-gray-700 truncate w-full">{upiId}</span>
                         </div>
                         <button
                           onClick={handleCopyUpiId}
                           className="p-2.5 bg-white text-blue-600 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 flex-shrink-0"
                           title="Copy UPI ID"
                         >
                           {isCopied ? (
                             <FaCheckCircle className="text-green-500" />
                           ) : (
                             <FaCopy />
                           )}
                         </button>
                      </div>
                    </div>
                    
                    <div className="mt-8 space-y-4 w-full">
                       <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Payable Amount</p>
                          <p className="text-3xl font-black text-blue-700">{DisplayPriceInRupees(displayTotalPrice)}</p>
                       </div>
                       <button
                          onClick={() => setStep(2)}
                          className="w-full py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 font-bold text-lg shadow-lg shadow-blue-100 transition-all transform hover:-translate-y-1 active:scale-95"
                        >
                          I Have Paid, Proceed
                        </button>
                    </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="bg-white shadow-2xl rounded-3xl p-8 md:p-10 animate-in slide-in-from-right duration-300">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              Upload Payment Details
            </h2>
            <p className="text-gray-500 mb-8 max-w-lg">
              To verify your transaction, please upload a screenshot of your payment confirmation screen.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="relative group">
                    <input
                      type="file"
                      id="payment-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label 
                      htmlFor="payment-upload"
                      className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 ${
                        imageFile 
                          ? "bg-blue-50 border-blue-400" 
                          : "bg-gray-50 border-gray-200 hover:bg-white hover:border-blue-300"
                      }`}
                    >
                      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      </div>
                      <span className="text-gray-900 font-bold mb-1">Click to Upload Screenshot</span>
                      <span className="text-gray-400 text-sm font-medium">PNG, JPG up to 5MB</span>
                    </label>
                </div>

                <div className="h-full">
                    {uploadedImage ? (
                      <div className="relative h-full flex flex-col items-center">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 self-start">Preview</p>
                        <div className="relative w-full aspect-square md:aspect-auto md:h-64 rounded-2xl overflow-hidden border-2 border-gray-100 shadow-lg">
                            <img
                              src={uploadedImage}
                              alt="Uploaded Preview"
                              className="w-full h-full object-cover"
                            />
                            <button 
                                onClick={() => { setUploadedImage(null); setImageFile(null); }}
                                className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all active:scale-95"
                                title="Remove Image"
                            >
                                <FaCheckCircle className="rotate-45" size={14} />
                            </button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-3xl border-2 border-gray-100 p-6 text-center">
                         <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-200 mb-3 shadow-inner">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                         </div>
                         <p className="text-gray-400 text-sm font-medium">Upload a screenshot to see preview here</p>
                      </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-12 justify-center">
              <button
                onClick={() => setStep(1)}
                className="w-full sm:w-auto px-10 py-4 border-2 border-gray-100 text-gray-500 rounded-2xl hover:bg-gray-50 font-bold transition-all"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 font-bold text-lg shadow-lg shadow-blue-100 transition-all disabled:opacity-50 transform hover:-translate-y-1"
                disabled={!imageFile}
              >
                Next Step
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="bg-white shadow-2xl rounded-3xl p-8 md:p-10 animate-in slide-in-from-right duration-300">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
              Order Overview
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-lg text-gray-800">Delivery Address</h3>
                </div>
                {currentAddress ? (
                  <div className="space-y-1 text-gray-600 text-sm leading-relaxed">
                    <p className="font-extrabold text-gray-900">{user.name}</p>
                    <p>{currentAddress.mobile}</p>
                    <p>{currentAddress.address_line}</p>
                    <p>
                      {currentAddress.city}, {currentAddress.state}
                    </p>
                    <p className="font-bold text-gray-700">
                      {currentAddress.pincode}
                    </p>
                  </div>
                ) : (
                  <p className="text-red-500 font-bold bg-red-50 p-3 rounded-xl border border-red-100">
                    No address selected or available.
                  </p>
                )}
              </div>

              <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-lg text-gray-800">Summary</h3>
                </div>
                <div className="space-y-3 flex-grow">
                   <div className="flex justify-between text-sm text-gray-500">
                      <span>Total Items</span>
                      <span className="font-bold text-gray-900">{displayTotalQty}</span>
                   </div>
                   <div className="flex justify-between text-sm text-gray-500">
                      <span>Shipping Fee</span>
                      <span className="font-bold text-green-500 uppercase tracking-tighter">Free</span>
                   </div>
                   <div className="pt-4 mt-4 border-t border-dashed border-gray-200 flex justify-between items-center text-xl font-black text-gray-900">
                      <span>Total</span>
                      <span className="text-blue-700">{DisplayPriceInRupees(displayTotalPrice)}</span>
                   </div>
                </div>
              </div>
            </div>

            {uploadedImage && (
              <div className="mb-8">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Attached Payment Proof</p>
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm">
                    <img
                      src={uploadedImage}
                      alt="Uploaded Preview"
                      className="w-full h-full object-cover"
                    />
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
              <button
                onClick={() => setStep(2)}
                className="w-full sm:w-auto px-10 py-4 border-2 border-gray-100 text-gray-500 rounded-2xl hover:bg-gray-50 font-bold transition-all"
              >
                Back
              </button>
              <button
                onClick={handlePlaceOrder}
                className="w-full sm:w-auto px-12 py-4 bg-green-600 text-white rounded-2xl hover:bg-green-700 font-bold text-lg shadow-lg shadow-green-100 transition-all disabled:opacity-50 flex items-center justify-center transform hover:-translate-y-1 active:scale-95"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      fill="none"
                      viewBox="0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Confirming...
                  </span>
                ) : (
                  "Place Order Now"
                )}
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="bg-white shadow-2xl rounded-3xl p-10 text-center animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <FaCheckCircle size={56} />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              Order Successful!
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Your order has been placed successfully. We have received your payment details and will process your request shortly.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => navigate("/")}
                className="w-full sm:w-auto px-10 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold text-lg transition-all shadow-lg hover:shadow-green-200 transform hover:-translate-y-1"
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
    <section className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-indigo-50 py-12">
      <div className="container mx-auto px-6 lg:px-10">
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
              <p className="font-semibold text-xs md:text-sm">Overview</p>
            </div>
            <div
              className={`flex-1 border-t-2 transition-colors duration-500 ${
                step >= 4 ? "border-green-600" : "border-gray-300"
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