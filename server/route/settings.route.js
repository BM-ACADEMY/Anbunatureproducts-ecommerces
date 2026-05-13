import { Router } from "express";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import { getSettings, updateSettings } from "../controllers/settings.controller.js";

const settingsRouter = Router();

settingsRouter.get("/get", getSettings);
settingsRouter.post("/update", auth, admin, updateSettings);

export default settingsRouter;
