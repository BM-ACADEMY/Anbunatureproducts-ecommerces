import { Router } from "express";
import { 
    submitSiteReview, 
    getVerifiedSiteReviews, 
    getAllSiteReviews, 
    verifySiteReview, 
    deleteSiteReview 
} from "../controllers/siteReview.controller.js";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/Admin.js";

const siteReviewRouter = Router();

// Public routes
siteReviewRouter.post("/submit", submitSiteReview);
siteReviewRouter.get("/get-verified", getVerifiedSiteReviews);

// Admin routes
siteReviewRouter.get("/admin/all", auth, admin, getAllSiteReviews);
siteReviewRouter.patch("/admin/verify/:id", auth, admin, verifySiteReview);
siteReviewRouter.delete("/admin/delete/:id", auth, admin, deleteSiteReview);

export default siteReviewRouter;
