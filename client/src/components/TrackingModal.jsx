// frontend/src/components/TrackingModal.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Box,
} from "@mui/material";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import TrackingStepper from "./TrackingStepper";

const TrackingModal = ({ open, handleClose, order, onUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState(order?.tracking_status || "Pending");

  const handleUpdateTracking = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.updateTracking,
        data: {
          orderId: order.orderId,
          tracking_status: selectedStatus,
        },
      });

      if (response.data.success) {
        toast.success("Tracking status updated successfully");
        onUpdate(); // Refresh orders
        handleClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update tracking");
    }
  };

  // Define available statuses based on current status
  const currentIndex = ["Pending", "Processing", "Shipped", "Delivered"].indexOf(
    order?.tracking_status
  );
  const availableStatuses = ["Pending", "Processing", "Shipped", "Delivered"].slice(
    currentIndex === -1 ? 0 : currentIndex
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Tracking for Order #{order?.orderId}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            Current Status: {order?.tracking_status}
          </Typography>
          <TrackingStepper
            trackingStatus={order?.tracking_status}
            isCancelled={order?.isCancelled}
          />
        </Box>
        {!order?.isCancelled && (
          <FormControl component="fieldset">
            <Typography variant="body1" gutterBottom>
              Select New Tracking Status:
            </Typography>
            <RadioGroup
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {availableStatuses.map((status) => (
                <FormControlLabel
                  key={status}
                  value={status}
                  control={<Radio />}
                  label={status}
                  disabled={status === order?.tracking_status}
                />
              ))}
            </RadioGroup>
          </FormControl>
        )}
        {order?.isCancelled && (
          <Typography color="error">
            This order is cancelled and cannot have its tracking status updated.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Close
        </Button>
        {!order?.isCancelled && (
          <Button
            onClick={handleUpdateTracking}
            color="primary"
            variant="contained"
            disabled={selectedStatus === order?.tracking_status}
          >
            Update
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TrackingModal;