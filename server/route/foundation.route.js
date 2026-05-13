import { Router } from "express";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/Admin.js";
import { getFoundationController, updateFoundationController } from "../controllers/foundation.controller.js";

const foundationRouter = Router();

foundationRouter.get("/get", getFoundationController);
foundationRouter.post("/update", auth, admin, updateFoundationController);

export default foundationRouter;
