import { Router } from "express";
import { getAnnouncementController, updateAnnouncementController } from "../controllers/announcement.controller.js";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/Admin.js";

const announcementRouter = Router();

announcementRouter.get("/get", getAnnouncementController);
announcementRouter.put("/update", auth, admin, updateAnnouncementController);

export default announcementRouter;
