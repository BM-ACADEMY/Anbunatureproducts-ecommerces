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

const InvoiceModal = ({ open, handleClose, orderGroup }) => {
  const invoiceRef = useRef();

  const companyDetails = {
    name: "Anbu Natural",
    address: "30, veerachi south Street, Vellakal, Manaparai tk, Trichy dt, pin. 621307",
    phone: "9488549948, 7338886850",
    email: "anbunaturalproducts@gmail.com",
  };

  // Use the first item for shared details
  const firstItem = orderGroup?.items?.[0] || orderGroup;
  
  const invoiceDetails = {
    invoiceNumber: orderGroup?.groupId || firstItem?.orderId || "INV-000007",
    invoiceDate: new Date(firstItem?.createdAt).toLocaleDateString() || new Date().toLocaleDateString(),
    dueDate: firstItem?.createdAt 
      ? new Date(new Date(firstItem.createdAt).setDate(new Date(firstItem.createdAt).getDate() + 14)).toLocaleDateString()
      : new Date(new Date().setDate(new Date().getDate() + 14)).toLocaleDateString(),
  };

  // Total amount from the group
  const totalAmount = orderGroup?.totalAmt || firstItem?.totalAmt || 0;

  const downloadInvoice = async () => {
    const element = invoiceRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice_${invoiceDetails.invoiceNumber}.pdf`);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ p: 0, overflow: "hidden" }}>
        <Box
          ref={invoiceRef}
          sx={{
            width: "595px",
            height: "842px",
            bgcolor: "#fff",
            p: 3,
            boxSizing: "border-box",
            fontSize: "12px",
            position: "relative",
            margin: "auto",
          }}
        >
          {/* Watermark */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) rotate(-45deg)",
              opacity: 0.05,
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
                src="/assets/common/logo.png"
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
                Name: {firstItem?.userId?.name}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "10px", color: "#555" }}>
                Email: {firstItem?.userId?.email}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "10px", color: "#555" }}>
                Phone: {firstItem?.delivery_address?.mobile}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "10px", color: "#555" }}>
                Address: {firstItem?.delivery_address?.address_line}, {firstItem?.delivery_address?.city}{" "}
                {firstItem?.delivery_address?.state}, {firstItem?.delivery_address?.pincode}
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
                <TableCell sx={{ color: "#fff", fontSize: "10px", py: 1, textAlign: "right" }}>
                  <strong>Unit Price</strong>
                </TableCell>
                <TableCell sx={{ color: "#fff", fontSize: "10px", py: 1, textAlign: "right" }}>
                  <strong>Total</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(orderGroup?.items || [orderGroup]).map((item, index) => {
                const unitPrice = item.quantity ? (item.totalAmt / item.quantity).toFixed(2) : item.totalAmt || 0;
                return (
                  <TableRow key={index}>
                    <TableCell sx={{ fontSize: "10px", py: 0.5 }}>{item.quantity || 1}</TableCell>
                    <TableCell sx={{ fontSize: "10px", py: 0.5 }}>{item.product_details?.name}</TableCell>
                    <TableCell sx={{ fontSize: "10px", py: 0.5, textAlign: "right" }}>₹{unitPrice}</TableCell>
                    <TableCell sx={{ fontSize: "10px", py: 0.5, textAlign: "right" }}>₹{item.totalAmt}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Totals Section */}
          <Box sx={{ textAlign: "right", mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: "14px", color: "#1a3c34" }}>
              <strong>Total:</strong> ₹{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Typography>
          </Box>

          {/* Payment and Tracking Status */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontSize: "10px", color: "#555" }}>
              <strong>Payment Status:</strong> {firstItem?.payment_status}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "10px", color: "#555" }}>
              <strong>Tracking Status:</strong> {firstItem?.tracking_status}
            </Typography>
            {firstItem?.trackingId && (
              <Typography variant="body2" sx={{ fontSize: "10px", color: "#555" }}>
                <strong>Tracking ID:</strong> {firstItem?.trackingId}
              </Typography>
            )}
            {firstItem?.isCancelled && (
              <Typography variant="body2" sx={{ fontSize: "10px", color: "#d32f2f" }}>
                <strong>Cancelled:</strong> {firstItem?.cancellationReason} (on{" "}
                {new Date(firstItem?.cancellationDate).toLocaleDateString()})
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