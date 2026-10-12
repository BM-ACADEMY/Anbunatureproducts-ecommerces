import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
// Reload configuration
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/connectDB.js";

import userRouter from "./route/user.route.js";
import categoryRouter from "./route/category.route.js";
import uploadRouter from "./route/upload.router.js";
import subCategoryRouter from "./route/subCategory.route.js";
import productRouter from "./route/product.route.js";
import cartRouter from "./route/cart.route.js";
import addressRouter from "./route/address.route.js";
import orderRouter from "./route/order.route.js";
import emailRouter from "./route/email.route.js";
import bannerRouter from "./route/banner.route.js";
import siteReviewRouter from "./route/siteReview.route.js";
import announcementRouter from "./route/announcement.route.js";
import foundationRouter from "./route/foundation.route.js";
import settingsRouter from "./route/settings.route.js";
import couponRouter from "./route/coupon.route.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ CORS setup
const defaultAllowedOrigins = [
  "https://anbunatural.com",
  "https://www.anbunatural.com",
  "http://anbunatural.com",
  "http://www.anbunatural.com",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:8090",
];

const envAllowedOrigins = [
  process.env.FRONTEND_URL?.trim().replace(/\/$/, ""),
  process.env.PRODUCTION_URL?.trim().replace(/\/$/, ""),
].filter(Boolean);

const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...envAllowedOrigins]));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., Postman/Mobile apps/Server-to-server)
      if (!origin) return callback(null, true);

      // Allow any localhost origin during development
      if (origin.startsWith("http://localhost:") || origin.startsWith("https://localhost:")) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.trim().replace(/\/$/, "");
      if (
        allowedOrigins.includes(normalizedOrigin) ||
        normalizedOrigin.endsWith(".anbunatural.com") ||
        normalizedOrigin === "https://anbunatural.com"
      ) {
        callback(null, true);
      } else {
        console.warn(`⚠️ Blocked by CORS origin: ${origin}`);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type", 
      "Authorization", 
      "X-Requested-With", 
      "Accept", 
      "Origin",
      "Access-Control-Allow-Headers",
      "Access-Control-Request-Method",
      "Access-Control-Request-Headers"
    ],
  })
);

// Pre-flight handling
app.options("*", cors());

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet({ 
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: { policy: "unsafe-none" },
  contentSecurityPolicy: false, // Fix font/Stripe loading issues
}));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 8080;

// Test route
app.get("/", (req, res) => {
  res.json({ message: `✅ Server running on ${PORT}` });
});

// Routes
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/file", uploadRouter);
app.use("/api/subcategory", subCategoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);
app.use("/api/email", emailRouter);
app.use("/api/banner", bannerRouter);
app.use("/api/site-review", siteReviewRouter);
app.use("/api/announcement", announcementRouter);
app.use("/api/foundation", foundationRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/coupon", couponRouter);


// Connect DB + Start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("🚀 Server running on port", PORT);
    });
  })
  .catch((err) => console.error("❌ DB connection failed", err));