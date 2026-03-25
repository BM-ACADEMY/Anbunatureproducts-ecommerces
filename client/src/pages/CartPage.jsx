import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../provider/GlobalProvider';
import CartItem from '../components/CartItem';
import CartSummary from '../components/CartSummary';
import imageEmpty from '../assets/empty_cart.png';
import { toast } from 'sonner';

const CartPage = () => {
    const { notDiscountTotalPrice, totalPrice, totalQty } = useGlobalContext();
    const cartItem = useSelector((state) => state.cartItem.cart);
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();

    const redirectToCheckoutPage = () => {
        if (user?._id) {
            navigate('/checkout');
        } else {
            toast.error('Please Login to proceed');
            navigate('/login');
        }
    };

    const totalSavings = notDiscountTotalPrice - totalPrice;

    return (
        <section className="bg-gray-50 min-h-screen py-8 lg:py-12">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Cart Items */}
                    <div className="flex-grow">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <h1 className="text-2xl font-bold text-gray-800">My Cart ({totalQty})</h1>
                                {cartItem.length > 0 && (
                                    <button 
                                        onClick={() => navigate('/')}
                                        className="text-green-700 font-semibold hover:underline text-sm"
                                    >
                                        Continue Shopping
                                    </button>
                                )}
                            </div>

                            {cartItem.length > 0 ? (
                                <div className="p-6 space-y-6">
                                    {cartItem.map((item) => (
                                        <CartItem key={item._id} item={item} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-12 text-center">
                                    <img
                                        src={imageEmpty}
                                        alt="Empty Cart"
                                        className="max-w-[250px] h-auto opacity-70 mb-8"
                                    />
                                    <h3 className="text-2xl font-bold text-gray-700 mb-2">
                                        Your cart is empty!
                                    </h3>
                                    <p className="text-gray-500 mb-8 max-w-xs">
                                        Looks like you haven't added anything yet. Start exploring our premium products!
                                    </p>
                                    <button
                                        onClick={() => navigate("/")}
                                        className="px-10 py-3.5 bg-[#196806] hover:bg-[#104a02] rounded-full text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95"
                                    >
                                        Shop Now
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Summary (Sticky on desktop) */}
                    {cartItem.length > 0 && (
                        <div className="w-full lg:w-[380px] flex-shrink-0">
                            <div className="sticky top-24">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Details</h2>
                                    
                                    <CartSummary 
                                        notDiscountTotalPrice={notDiscountTotalPrice}
                                        totalPrice={totalPrice}
                                        totalSavings={totalSavings}
                                    />

                                    <button
                                        onClick={redirectToCheckoutPage}
                                        className="w-full mt-6 bg-[#fbb034] hover:bg-[#f39c12] text-black font-bold text-lg py-4 rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center"
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CartPage;
