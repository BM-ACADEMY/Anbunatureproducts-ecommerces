// frontend/src/components/UserTrackingModal.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import TrackingStepper from "./TrackingStepper";

const trackingSteps = [
  { status: "Pending" },
  { status: "Processing" },
  { status: "Shipped" },
  { status: "Delivered" },
];

const UserTrackingModal = ({ open, handleClose, order }) => {
  const [currentStep, setCurrentStep] = useState(0);

  // Calculate the target step based on order's tracking_status
  const targetStep = order?.isCancelled
    ? -1 // No steps highlighted for cancelled orders
    : trackingSteps.findIndex((step) => step.status === order?.tracking_status);

  useEffect(() => {
    if (!open) {
      // Reset currentStep when modal closes
      setCurrentStep(0);
      return;
    }

    if (targetStep === -1) {
      // For cancelled orders, keep activeStep at -1
      setCurrentStep(-1);
      return;
    }

    // Animate steps one by one
    let step = 0;
    const timer = setInterval(() => {
      if (step <= targetStep) {
        setCurrentStep(step);
        step++;
      } else {
        clearInterval(timer);
      }
    }, 500); // 500ms delay between each step

    return () => clearInterval(timer); // Cleanup on unmount or modal close
  }, [open, targetStep]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Tracking for Order #{order?.orderId}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            Current Status: {order?.tracking_status}
          </Typography>
          <TrackingStepper
            activeStep={currentStep}
            isCancelled={order?.isCancelled}
          />
        </Box>
        {order?.isCancelled && (
          <Typography color="error">
            This order is cancelled: {order.cancellationReason} on{" "}
            {new Date(order.cancellationDate).toLocaleDateString()}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserTrackingModal;