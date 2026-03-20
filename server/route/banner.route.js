import { Router } from "express";
import { addBannerController, deleteBannerController, getBannersController, updateBannerController } from "../controllers/banner.controller.js";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

const bannerRouter = Router();

bannerRouter.post("/add", auth, admin, addBannerController);
bannerRouter.get("/get", getBannersController);
bannerRouter.post("/delete", auth, admin, deleteBannerController);
bannerRouter.post("/update", auth, admin, updateBannerController);

export default bannerRouter;
