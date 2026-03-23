import React, { useState, useRef, useEffect } from "react";
import logo from "../assets/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LuUserRound, LuSearch, LuTruck } from "react-icons/lu";
import useMobile from "../hooks/useMobile";
import { useSelector } from "react-redux";
import { AiOutlineMenu } from "react-icons/ai";
import { IoCloseOutline } from "react-icons/io5";
import UserMenu from "./UserMenu";
import DisplayCartItem from "./DisplayCartItem";
import { SlHandbag } from "react-icons/sl";
import isAdmin from "../utils/isAdmin";
import Search from "./Search";

const Header = () => {
    const [isMobile] = useMobile();
    const location = useLocation();
    const navigate = useNavigate();

    const user = useSelector((state) => state?.user);
    const [openUserMenu, setOpenUserMenu] = useState(false);
    const [closeTimeout, setCloseTimeout] = useState(null);
    const userMenuRef = useRef(null);
    
    const cartItem = useSelector((state) => state.cartItem.cart);
    const totalQty = cartItem?.reduce((prev, curr) => prev + curr.quantity, 0);

    const [openCartSection, setOpenCartSection] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    // Close user menu when user logs out
    useEffect(() => {
        if (!user?._id) {
            setOpenUserMenu(false);
        }
    }, [user?._id]);

    const handleMouseEnter = () => {
        if (closeTimeout) {
            clearTimeout(closeTimeout);
            setCloseTimeout(null);
        }
        setOpenUserMenu(true);
    };

    const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
            setOpenUserMenu(false);
        }, 300);
        setCloseTimeout(timeout);
    };

    const toggleMobileMenu = () => {
        setShowMobileMenu((prev) => !prev);
    };

    const navLinks = [
        { label: "Home", path: "/" },
        { label: "About", path: "/about" },
        { label: "Contact", path: "/contact" },
    ];

    return (
        <>
            {/* Announcement Bar with Marquee Effect */}
            <div className="w-full bg-[#fdf5e6] py-1 overflow-hidden whitespace-nowrap border-b border-gray-100">
                <div className="inline-block animate-marquee hover:pause-marquee cursor-default">
                    <div className="flex items-center space-x-12">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                            <div key={i} className="flex items-center space-x-2">
                                <LuTruck size={18} className="text-green-700" />
                                <span className="text-sm font-semibold text-gray-800 uppercase tracking-widest whitespace-nowrap">
                                    deliver with in 2 to 5 days all over india
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    
                    {/* Logo - Increased Size */}
                    <Link to="/" className="flex-shrink-0 transition-transform">
                        <img src={logo} alt="Anbu Logo" className="h-12 lg:h-16 w-auto" />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.label}
                                to={link.path}
                                className={`text-gray-700 hover:text-green-700 font-medium transition-colors ${
                                    location.pathname === link.path ? 'text-green-700' : ''
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Icons (Desktop) */}
                    <div className="hidden lg:flex items-center space-x-6">
                        <button 
                            onClick={() => setShowSearch(!showSearch)}
                            className={`transition-colors ${showSearch ? 'text-green-700' : 'text-gray-700 hover:text-green-700'}`}
                            title="Search"
                        >
                            <LuSearch size={24} />
                        </button>

                        <div 
                            className="relative"
                            onMouseEnter={() => user?._id && handleMouseEnter()}
                            onMouseLeave={() => user?._id && handleMouseLeave()}
                            ref={userMenuRef}
                        >
                            <button 
                                className="transition-colors flex items-center"
                                onClick={() => {
                                    if (!user?._id) {
                                        navigate('/login');
                                    } else {
                                        setOpenUserMenu(!openUserMenu);
                                    }
                                }}
                            >
                                {user?._id ? (
                                    user?.avatar ? (
                                        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-green-500 shadow-sm">
                                            <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm shadow-sm border-2 border-green-500">
                                            {user?.name?.charAt(0)?.toUpperCase() || user?.mobile?.charAt(0) || "U"}
                                        </div>
                                    )
                                ) : (
                                    <LuUserRound size={24} className="text-gray-700 hover:text-green-700" />
                                )}
                            </button>
                            
                            {user?._id && openUserMenu && (
                                <div className="absolute right-0 top-full pt-2">
                                    <UserMenu close={() => setOpenUserMenu(false)} isHome={true} />
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={() => setOpenCartSection(true)}
                            className="bg-[#1a1a1a] text-white flex items-center space-x-2 px-6 py-2.5 rounded-full hover:bg-black transition-all shadow-md group"
                        >
                            <SlHandbag size={20} className="group-hover:scale-110 transition-transform" />
                            <span className="font-semibold text-sm">Cart ({totalQty})</span>
                        </button>
                    </div>

                    {/* Mobile Icons + Menu Toggle */}
                    <div className="flex lg:hidden items-center space-x-4">
                        <button 
                            onClick={() => setShowSearch(!showSearch)}
                            className={`transition-colors ${showSearch ? 'text-green-700' : 'text-gray-700'}`}
                            title="Search"
                        >
                            <LuSearch size={22} />
                        </button>
                        
                        <Link to="/user" className="text-gray-700">
                            <LuUserRound size={22} />
                        </Link>

                        <button 
                            onClick={() => setOpenCartSection(true)}
                            className="relative text-gray-700"
                        >
                            <SlHandbag size={24} />
                            {totalQty > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#70a139] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white">
                                    {totalQty}
                                </span>
                            )}
                        </button>

                        <button 
                            onClick={toggleMobileMenu}
                            className="text-gray-700 focus:outline-none"
                        >
                            <AiOutlineMenu size={24} />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Drawer */}
                <div 
                    className={`fixed inset-0 z-[60] bg-black bg-opacity-40 transition-opacity duration-300 ${
                        showMobileMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                    onClick={toggleMobileMenu}
                >
                    <div 
                        className={`absolute top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-2xl transition-transform duration-300 transform ${
                            showMobileMenu ? 'translate-x-0' : 'translate-x-full'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-8">
                                <button onClick={toggleMobileMenu} className="text-gray-500">
                                    <IoCloseOutline size={30} />
                                </button>
                                <img src={logo} alt="Anbu Logo" className="h-10 w-auto" />
                                <div className="w-8" /> {/* Spacer */}
                            </div>

                            <nav className="flex flex-col space-y-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.label}
                                        to={link.path}
                                        onClick={toggleMobileMenu}
                                        className={`px-4 py-3 rounded-xl text-lg font-medium transition-all ${
                                            location.pathname === link.path && link.path === "/"
                                                ? 'bg-[#70a139] text-white shadow-md' 
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>

                            <div className="mt-auto border-t pt-6 space-y-4">
                                {isAdmin(user?.role) && (
                                    <Link 
                                        to="/dashboard" 
                                        onClick={toggleMobileMenu}
                                        className="block text-center py-3 bg-gray-100 rounded-xl font-medium text-gray-700"
                                    >
                                        Admin Dashboard
                                    </Link>
                                ) }
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Bar Overlay */}
                {showSearch && (
                    <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 py-4 px-4 shadow-md animate-fade-in z-40">
                        <div className="container mx-auto max-w-3xl">
                            <Search isFullWidth={true} close={() => setShowSearch(false)} />
                        </div>
                    </div>
                )}

                {/* Cart Section Overlay */}
                {openCartSection && (
                    <DisplayCartItem close={() => setOpenCartSection(false)} />
                )}
            </header>
        </>
    );
};

export default Header;