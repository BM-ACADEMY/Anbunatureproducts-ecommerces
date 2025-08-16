import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Divider from "./Divider";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { logout } from "../store/userSlice";
import toast from "react-hot-toast";
import isAdmin from "../utils/isAdmin";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FiUser, FiLogOut, FiHome, FiGrid, FiLayers, FiUpload, FiPackage, FiList } from "react-icons/fi";

const UserMenu = ({ close, avatarColor }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  const userInitial = user?.name?.charAt(0) || user?.mobile?.charAt(0) || "U";

  const handleLogout = async () => {
    try {
      console.log("Initiating logout request with config:", SummaryApi.logout);
      const response = await Axios({
        url: SummaryApi.logout.url,
        method: SummaryApi.logout.method,
        withCredentials: true, // Ensure cookies/tokens are sent if needed
      });
      console.log("Logout response:", response);

      if (response?.data?.success) {
        console.log("Logout successful, clearing state...");
        close?.();
        dispatch(logout());
        localStorage.clear();
        toast.success(response.data.message || "Logged out successfully");
        navigate("/");
      } else {
        console.error("Logout failed, response data:", response?.data);
        toast.error(response?.data?.message || "Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Logout failed. Please check your connection and try again.";
      toast.error(errorMessage);
    }
  };

  const menuItems = [
    {
      text: "Profile",
      icon: <FiUser size={18} />,
      path: "/dashboard/profile",
    },
    ...(isAdmin(user?.role)
      ? [
          {
            text: "Category",
            icon: <FiGrid size={18} />,
            path: "/dashboard/category",
          },
          {
            text: "Sub Category",
            icon: <FiLayers size={18} />,
            path: "/dashboard/subcategory",
          },
          {
            text: "Upload Product",
            icon: <FiUpload size={18} />,
            path: "/dashboard/upload-product",
          },
          {
            text: "Product",
            icon: <FiPackage size={18} />,
            path: "/dashboard/product",
          },
          {
            text: "All Orders",
            icon: <FiList size={18} />,
            path: "/dashboard/allorders",
          },
        ]
      : [
          {
            text: "My Orders",
            icon: <FiList size={18} />,
            path: "/dashboard/myorders",
          },
        ]),
    ...(!isAdmin(user?.role)
      ? [
          {
            text: "Save Address",
            icon: <FiHome size={18} />,
            path: "/dashboard/address",
          },
        ]
      : []),
    {
      text: "Log Out",
      icon: <FiLogOut size={18} />,
      onClick: () => setOpenDialog(true),
    },
  ];

  return (
    <>
      <Box sx={{ width: 210 }}>
        {/* <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 5 }}>
          <Avatar
            src={user?.avatar}
            sx={{
              width: 40,
              height: 40,
              bgcolor: user?.avatar ? "transparent" : avatarColor,
              fontSize: "1.2rem",
              color: user?.avatar ? "transparent" : "white",
              fontWeight: "bold",
            }}
          >
            {user?.avatar ? null : userInitial.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight="medium">
              Profile
            </Typography>
            <Link
              to="/dashboard/profile"
              onClick={close}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Typography
                variant="body2"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  "&:hover": { color: "error.main" },
                }}
              >
                <span
                  style={{
                    maxWidth: 280,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.name || user.mobile}
                </span>
                {user.role === "ADMIN" && (
                  <Typography component="span" variant="caption" color="error.main">
                    (Admin)
                  </Typography>
                )}
              </Typography>
            </Link>
          </Box>
        </Box>

        <Divider /> */}

        <List sx={{ py: 0 }}>
          {menuItems.map((item, index) =>
            item.path ? (
              <ListItem
                button
                key={index}
                component={Link}
                to={item.path}
                onClick={close}
                sx={{
                  borderRadius: 1,
                  "&:hover": { backgroundColor: "action.hover" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ) : (
              <ListItem
                button
                key={index}
                onClick={item.onClick}
                sx={{
                  borderRadius: 1,
                  "&:hover": { backgroundColor: "action.hover" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} style={{ cursor: "pointer" }} />
              </ListItem>
            )
          )}
        </List>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to log out of your account?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="error" startIcon={<FiLogOut />} style={{ cursor: "pointer" }}>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserMenu;