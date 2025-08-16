import React, { useRef } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Box,
  Divider,
  Grid,
} from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";

const InvoiceModal = ({ open, handleClose, order }) => {
  const invoiceRef = useRef();

 const companyDetails = {
  name: "Anbu Natural",
  phone: "7338886850, 9944736850",
  email: "anbunaturalproducts@gmail.com",
};

  // Mock invoice details
  const invoiceDetails = {
    invoiceNumber: order?.orderId || "INV-000007",
    invoiceDate: new Date(order?.createdAt).toLocaleDateString() || "10-02-2023",
    dueDate:
      new Date(new Date(order?.createdAt).setDate(new Date(order?.createdAt).getDate() + 14)).toLocaleDateString() ||
      "10-16-2023",
  };

  // Calculate totals
  const subTotal = order?.totalAmt || 0;
  const totalAmount = subTotal; // No tax
  const unitPrice = order?.quantity ? (order.totalAmt / order.quantity).toFixed(2) : order?.totalAmt || 0;

  const downloadInvoice = async () => {
    const element = invoiceRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice_${order?.orderId}.pdf`);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ p: 0, overflow: "hidden" }}>
        <Box
          ref={invoiceRef}
          sx={{
            width: "595px", // A4 width in pixels (210mm at 96 DPI)
            height: "842px", // A4 height in pixels (297mm at 96 DPI)
            bgcolor: "#fff",
            p: 3,
            boxSizing: "border-box",
            fontSize: "12px",
            position: "relative",
            "@media (max-width: 600px)": {
              transform: "scale(0.5)",
              transformOrigin: "top left",
              width: "595px",
              height: "842px",
              margin: "auto",
            },
            "@media (min-width: 601px) and (max-width: 960px)": {
              transform: "scale(0.7)",
              transformOrigin: "top left",
              width: "595px",
              height: "842px",
              margin: "auto",
            },
            "@media (min-width: 961px)": {
              transform: "scale(1)",
              width: "595px",
              height: "842px",
              margin: "auto",
            },
          }}
        >
          {/* Watermark */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) rotate(-45deg)",
              opacity: 0.1,
              pointerEvents: "none",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: "60px",
                fontWeight: "bold",
                color: "#000",
                textTransform: "uppercase",
              }}
            >
              {companyDetails.name}
            </Typography>
          </Box>

          {/* Header Section */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ fontSize: "18px", color: "#1a3c34" }}>
                {companyDetails.name}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "10px", color: "#555" }}>
                {companyDetails.address}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "10px", color: "#555" }}>
                Phone: {companyDetails.phone}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "10px", color: "#555" }}>
                Email: {companyDetails.email}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <img
                src="/logo.png" // Replace with your logo path
                alt="Company Logo"
                style={{ width: 80, height: "auto" }}
              />
            </Box>
          </Box>

          {/* Invoice Title */}
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ fontSize: "24px", color: "#1a3c34" }}>
              INVOICE
            </Typography>
            <Divider sx={{ my: 0.5, borderColor: "#1a3c34" }} />
          </Box>

          {/* Billing Details */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: "14px", color: "#1a3c34" }}>
                Bill To
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "10px", color: "#555" }}>
                Name: {order?.userId?.name}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "10px", color: "#555" }}>
                Email: {order?.userId?.email}
              </Typography>
              {/* Corrected: Using delivery_address.mobile for the contact number at the delivery location */}
              <Typography variant="body2" sx={{ fontSize: "10px", color: "#555" }}>
                Phone: {order?.delivery_address?.mobile} {/* Changed from order?.userId?.mobile */}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "10px", color: "#555" }}>
                Address: {order?.delivery_address?.address_line}, {order?.delivery_address?.city}{" "}
                {order?.delivery_address?.state}, {order?.delivery_address?.pincode}
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "left" }}>
              <Typography variant="body2" sx={{ fontSize: "10px", color: "#555" }}>
                <strong>Invoice #:</strong> {invoiceDetails.invoiceNumber}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "10px", color: "#555" }}>
                <strong>Invoice Date:</strong> {invoiceDetails.invoiceDate}
              </Typography>
            </Grid>
          </Grid>

          {/* Order Details Table */}
          <Table sx={{ mb: 3 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#1a3c34", color: "#fff" }}>
                <TableCell sx={{ color: "#fff", fontSize: "10px", py: 1 }}>
                  <strong>Qty</strong>
                </TableCell>
                <TableCell sx={{ color: "#fff", fontSize: "10px", py: 1 }}>
                  <strong>Description</strong>
                </TableCell>
                <TableCell sx={{ color: "#fff", fontSize: "10px", py: 1 }}>
                  <strong>Unit Price</strong>
                </TableCell>
                <TableCell sx={{ color: "#fff", fontSize: "10px", py: 1 }}>
                  <strong>Total</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontSize: "10px", py: 0.5 }}>{order?.quantity || 1}</TableCell>
                <TableCell sx={{ fontSize: "10px", py: 0.5 }}>{order?.product_details?.name}</TableCell>
                <TableCell sx={{ fontSize: "10px", py: 0.5 }}>₹{unitPrice}</TableCell>
                <TableCell sx={{ fontSize: "10px", py: 0.5 }}>₹{order?.totalAmt}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {/* Totals Section */}
          <Box sx={{ textAlign: "right", mb: 3 }}>
            <Typography variant="body2" sx={{ fontSize: "10px", color: "#555" }}>
              <strong>Subtotal:</strong> ₹{subTotal.toFixed(2)}
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: "14px", color: "#1a3c34" }}>
              <strong>Total:</strong> ₹{totalAmount.toFixed(2)}
            </Typography>
          </Box>

          {/* Payment and Tracking Status */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontSize: "10px", color: "#555" }}>
              <strong>Payment Status:</strong> {order?.payment_status}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "10px", color: "#555" }}>
              <strong>Tracking Status:</strong> {order?.tracking_status}
            </Typography>
            {order?.isCancelled && (
              <Typography variant="body2" sx={{ fontSize: "10px", color: "#d32f2f" }}>
                <strong>Cancelled:</strong> {order?.cancellationReason} (on{" "}
                {new Date(order?.cancellationDate).toLocaleDateString()})
              </Typography>
            )}
          </Box>

          
        </Box>
      </DialogContent>

      {/* Footer Buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2, gap: 2 }}>
        <Button className="!bg-red-100 !text-red-900" startIcon={<CloseIcon />} onClick={handleClose}>
          Close
        </Button>
        <Button className="!bg-green-100 !text-green-900" startIcon={<DownloadIcon />} onClick={downloadInvoice}>
          Download PDF
        </Button>
      </Box>
    </Dialog>
  );
};

export default InvoiceModal;