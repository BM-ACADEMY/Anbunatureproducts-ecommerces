import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectDB.js';
import userRouter from './route/user.route.js';
import categoryRouter from './route/category.route.js';
import uploadRouter from './route/upload.router.js';
import subCategoryRouter from './route/subCategory.route.js';
import productRouter from './route/product.route.js';
import cartRouter from './route/cart.route.js';
import addressRouter from './route/address.route.js';
import orderRouter from './route/order.route.js';
import emailRouter from './route/email.route.js';

const app = express();

// CORS Configuration (Allow Cookies, Tokens, Sessions)
app.use(cors({
origin: [process.env.FRONTEND_URL, process.env.PRODUCTION_URL],
credentials: true,
methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
const allowedOrigins = [process.env.FRONTEND_URL, process.env.PRODUCTION_URL];
const origin = req.headers.origin;

if (allowedOrigins.includes(origin)) {
   res.header("Access-Control-Allow-Origin", origin);
}

res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
next();
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(helmet({
crossOriginResourcePolicy: false
}));

const PORT = process.env.PORT || 8080;

// Test Route
app.get("/", (request, response) => {
response.json({
   message: "Server is running on port " + PORT
});
});

// API Routes
app.use('/api/user', userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/file", uploadRouter);
app.use("/api/subcategory", subCategoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use('/api/order', orderRouter);
app.use('/api/email', emailRouter);

// Connect to Database
connectDB().then(() => {
app.listen(PORT, () => {
   console.log("✅ Server is running on port", PORT);
});
}).catch(err => {
console.error("❌ Database connection failed", err);
});