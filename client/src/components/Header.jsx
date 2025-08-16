import React, { useState, useRef } from "react";
import logo from "../assets/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LuUserRound } from "react-icons/lu";
import useMobile from "../hooks/useMobile";
import { useSelector } from "react-redux";
import { AiOutlineMenu } from "react-icons/ai";
import { RiCloseLargeLine } from "react-icons/ri";
import UserMenu from "./UserMenu";
import { useGlobalContext } from "../provider/GlobalProvider";
import DisplayCartItem from "./DisplayCartItem";
import Avatar from "@mui/material/Avatar";
import { Tooltip, Badge, Drawer } from "@mui/material";
import { SlHandbag } from "react-icons/sl";
import TopContactBar from "./Topbarnavbar";

const getAvatarColor = (letter) => {
  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#F033FF", "#FF33F0",
    "#33FFF5", "#FFC733", "#8E33FF", "#33FFBD", "#57FF33",
    "#3385FF", "#FF33A8", "#33FF8E", "#FF8E33",
  ];
  const charCode = letter?.charCodeAt(0) || 0;
  return colors[charCode % colors.length];
};

const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [closeTimeout, setCloseTimeout] = useState(null);
  const userMenuRef = useRef(null);
  const cartItem = useSelector((state) => state.cartItem.cart);
  const { totalQty } = useGlobalContext();
  const [openCartSection, setOpenCartSection] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const userInitial = user?.name?.charAt(0) || user?.mobile?.charAt(0) || "U";
  const avatarColor = getAvatarColor(userInitial);

  const redirectToLoginPage = () => navigate("/login");
  const handleCloseUserMenu = () => setOpenUserMenu(false);
  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);

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

  return (
    <>
    {/* <TopContactBar/> */}
    <header className="h-24 lg:h-20 sticky top-0 z-50 flex flex-col justify-center shadow-md gap-1 bg-white border-b border-gray-200">
      {!isSearchPage && (
        <div className="container mx-auto flex items-center px-2 justify-between">
          <div className="h-full">
            <Link to="/" className="h-full flex justify-center items-center">
              <img
                src={logo}
                width={130}
                height={60}
                alt="logo"
                className="hidden lg:block"
              />
              <img
                src={logo}
                width={120}
                height={60}
                alt="logo"
                className="lg:hidden"
              />
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-4 lg:gap-8">
            <Link 
              to="/" 
              className="text-neutral-600 hover:text-gray-900 transition-colors duration-300 font-medium text-[16px]"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="text-neutral-600 hover:text-gray-900 transition-colors duration-300 font-medium text-[16px]"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-neutral-600 hover:text-gray-900 transition-colors duration-300 font-medium text-[16px]"
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <button
              className="lg:hidden text-neutral-600 hover:text-gray-900 transition-colors duration-300"
              onClick={toggleMobileMenu}
            >
              {showMobileMenu ? <RiCloseLargeLine size={26} /> : <AiOutlineMenu size={26} />}
            </button>

            <div className="hidden lg:flex items-center gap-6">
              {user?._id ? (
                <div
                  className="relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  ref={userMenuRef}
                >
                  <div
                    onClick={() => setOpenUserMenu((prev) => !prev)}
                    className="flex select-none items-center cursor-pointer"
                  >
                    {user?.avatar ? (
                      <Avatar src={user.avatar} alt={user.name} sx={{ width: 36, height: 36 }} />
                    ) : (
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: avatarColor,
                          fontSize: "1rem",
                          color: "white",
                          fontWeight: "bold",
                          "&:hover": {
                            transform: "scale(1.1)",
                            transition: "transform 0.2s",
                          },
                        }}
                      >
                        {userInitial.toUpperCase()}
                      </Avatar>
                    )}
                  </div>

                  {openUserMenu && (
                    <div
                      className="absolute right-0 top-12 z-50"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="bg-white rounded shadow-lg border border-gray-100">
                        <UserMenu avatarColor={avatarColor} close={handleCloseUserMenu} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={redirectToLoginPage}
                  className="text-lg px-2 flex items-center gap-2 text-neutral-600 hover:text-gray-900 transition-colors duration-300 text-[16px]"
                >
                  <LuUserRound size={20} />
                  <span>Login</span>
                </button>
              )}

              <Tooltip title="Cart" placement="right">
                <button
                  onClick={() => setOpenCartSection(true)}
                  className="p-2 text-neutral-600 hover:text-gray-900 transition-colors duration-300"
                >
                  <Badge
                    badgeContent={totalQty || 0}
                    color="secondary"
                    overlap="circular"
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "0.6rem",
                        minWidth: "16px",
                        height: "16px",
                        padding: "0 4px",
                        backgroundColor: "red",
                        color: "white",
                      },
                    }}
                  >
                    <SlHandbag size={28} />
                  </Badge>
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <Drawer
        anchor="left"
        open={showMobileMenu}
        onClose={toggleMobileMenu}
        sx={{
          "& .MuiDrawer-paper": {
            width: "250px",
            padding: "16px",
            backgroundColor: "#fff",
            boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <div className="flex justify-start mb-10">
          <img src={logo} width={120} height={60} alt="logo" />
        </div>
        
        <div className="flex flex-col gap-6">
          <Link 
            to="/" 
            className="text-neutral-600 hover:text-gray-900 transition-colors duration-300 px-4 py-2 text-[16px]"
            onClick={toggleMobileMenu}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className="text-neutral-600 hover:text-gray-900 transition-colors duration-300 px-4 py-2 text-[16px]"
            onClick={toggleMobileMenu}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className="text-neutral-600 hover:text-gray-900 transition-colors duration-300 px-4 py-2 text-[16px]"
            onClick={toggleMobileMenu}
          >
            Contact
          </Link>

          <div className="mt-8 border-t pt-4">
            {user?._id ? (
              <Link
                to="/user"
                className="flex items-center gap-2 text-neutral-600 hover:text-gray-900 transition-colors duration-300 px-4 py-2 text-[16px]"
                onClick={toggleMobileMenu}
              >
                {user?.avatar ? (
                  <Avatar src={user.avatar} alt={user.name} sx={{ width: 24, height: 24 }} />
                ) : (
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      bgcolor: avatarColor,
                      fontSize: "0.8rem",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {userInitial.toUpperCase()}
                  </Avatar>
                )}
                <span className="truncate">My Account</span>
              </Link>
            ) : (
              <button
                onClick={() => {
                  toggleMobileMenu();
                  redirectToLoginPage();
                }}
                className="text-neutral-600 hover:text-gray-900 transition-colors duration-300 flex items-center gap-2 px-4 py-2 w-full text-left text-[16px]"
              >
                <LuUserRound size={20} />
                <span>Login</span>
              </button>
            )}
          </div>

          <div className="mt-4 border-t pt-4">
            <button
              onClick={() => {
                toggleMobileMenu();
                setOpenCartSection(true);
              }}
              className="flex items-center gap-2 px-4 py-2 w-full text-left"
            >
              <Badge
                badgeContent={totalQty || 0}
                color="secondary"
                overlap="circular"
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "0.6rem",
                    minWidth: "16px",
                    height: "16px",
                    padding: "0 4px",
                    backgroundColor: "red",
                    color: "white",
                  },
                }}
              >
                <SlHandbag size={28} />
              </Badge>
              <span className="text-neutral-600 hover:text-gray-900 transition-colors duration-300 text-[16px]">Cart</span>
            </button>
          </div>
        </div>
      </Drawer>

      {openCartSection && (
        <DisplayCartItem close={() => setOpenCartSection(false)} />
      )}
    </header>
    
    </>
    
  );
};

export default Header;