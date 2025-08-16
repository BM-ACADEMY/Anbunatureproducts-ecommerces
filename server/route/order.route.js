import { Router } from "express";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/Admin.js";
import {
  CashOnDeliveryOrderController,
  getOrderDetailsController,
  paymentController,
  webhookStripe,
  getAllOrdersController,
  cancelOrderController,
  deleteOrderController,
  updateTrackingStatusController,
  getOrderStatsController,
} from "../controllers/order.controller.js";
import upload from "../middleware/multer.js"; // Import Multer middleware

const orderRouter = Router();

// orderRouter.post("/cash-on-delivery", auth, upload.single("customImage"), CashOnDeliveryOrderController);
orderRouter.post("/cash-on-delivery", auth, CashOnDeliveryOrderController);

orderRouter.post("/checkout", auth, paymentController);
orderRouter.post("/webhook", webhookStripe);
orderRouter.get("/order-list", auth, getOrderDetailsController);
orderRouter.get("/all-orders", auth, admin, getAllOrdersController);
orderRouter.post("/cancel-order", auth, cancelOrderController);
orderRouter.delete("/delete-order/:orderId", auth, admin, deleteOrderController);
orderRouter.put("/update-tracking", auth, admin, updateTrackingStatusController);
orderRouter.get("/stats", auth, admin, getOrderStatsController);

export default orderRouter;