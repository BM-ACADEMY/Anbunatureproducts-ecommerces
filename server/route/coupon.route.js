import { Router } from "express";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import {
  getActiveCouponsController,
  getAllCouponsAdminController,
  createCouponController,
  updateCouponController,
  deleteCouponController,
} from "../controllers/coupon.controller.js";

const couponRouter = Router();

// Public: get active coupons for checkout options & homepage marquee
couponRouter.get("/active", getActiveCouponsController);

// Admin routes
couponRouter.get("/admin/all", auth, admin, getAllCouponsAdminController);
couponRouter.post("/admin/create", auth, admin, createCouponController);
couponRouter.put("/admin/update", auth, admin, updateCouponController);
couponRouter.delete("/admin/delete", auth, admin, deleteCouponController);

export default couponRouter;
