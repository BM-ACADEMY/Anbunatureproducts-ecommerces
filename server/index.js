import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
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

const app = express();

// ✅ CORS setup
const allowedOrigins = [
  process.env.FRONTEND_URL.replace(/\/$/, ""), // Remove trailing slash
  process.env.PRODUCTION_URL.replace(/\/$/, ""), // Remove trailing slash
].filter(Boolean); // Remove any undefined/null values

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("🔍 Request Origin:", origin); // Debug log
      // Allow requests with no origin (e.g., Postman or server-to-server requests)
      if (!origin) return callback(null, true);
      // Check if the origin is in allowedOrigins or matches without trailing slash
      if (
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes(origin.replace(/\/$/, ""))
      ) {
        callback(null, true);
      } else {
        callback(new Error(`❌ Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle preflight requests
app.options("*", cors());

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet({ crossOriginResourcePolicy: false }));

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

// Connect DB + Start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("🚀 Server running on port", PORT);
    });
  })
  .catch((err) => console.error("❌ DB connection failed", err));