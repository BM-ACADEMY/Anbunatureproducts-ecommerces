// frontend/src/components/TrackingStepper.jsx
import React from "react";
import { Stepper, Step, StepLabel, useMediaQuery, useTheme } from "@mui/material";
import {
  CheckCircle,
  HourglassEmpty,
  LocalShipping,
  ShoppingCart,
} from "@mui/icons-material";

const trackingSteps = [
  {
    label: "Order Received",
    description: "Your order has been received.",
    status: "Pending",
    icon: <ShoppingCart />,
  },
  {
    label: "Processing",
    description: "Your order is being processed and prepared.",
    status: "Processing",
    icon: <HourglassEmpty />,
  },
  {
    label: "Shipped",
    description: "Your order has been packed and dispatched for delivery.",
    status: "Shipped",
    icon: <LocalShipping />,
  },
  {
    label: "Delivered",
    description: "Your order has been delivered and set up.",
    status: "Delivered",
    icon: <CheckCircle />,
  },
];

const TrackingStepper = ({ activeStep, isCancelled }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Stepper
      activeStep={activeStep}
      orientation={isMobile ? "vertical" : "horizontal"}
      sx={{ mt: 2, mb: 2 }}
    >
      {trackingSteps.map((step, index) => (
        <Step key={step.label} completed={index <= activeStep && !isCancelled}>
          <StepLabel
            icon={
              index <= activeStep && !isCancelled ? (
                <CheckCircle color="success" />
              ) : (
                step.icon
              )
            }
            sx={{
              "& .MuiStepLabel-label": {
                fontSize: isMobile ? "0.85rem" : "1rem",
                color:
                  isCancelled || index > activeStep
                    ? "text.secondary"
                    : "primary.main",
                fontWeight: index === activeStep && !isCancelled ? "bold" : "normal",
              },
            }}
          >
            {step.label}
            {isMobile && (
              <div style={{ fontSize: "0.75rem", color: "text.secondary" }}>
                {step.description}
              </div>
            )}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default TrackingStepper;