// route/index.jsx
import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import App from "../App";

const Home = lazy(() => import("../pages/Home"));
const SearchPage = lazy(() => import("../pages/SearchPage"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const OtpVerification = lazy(() => import("../pages/OtpVerification"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const UserMenuMobile = lazy(() => import("../pages/UserMenuMobile"));
const Dashboard = lazy(() => import("../layouts/Dashboard"));
const Profile = lazy(() => import("../pages/Profile"));
const MyOrders = lazy(() => import("../pages/MyOrders"));
const OrderDetails = lazy(() => import("../pages/OrderDetails"));
const CategoryPage = lazy(() => import("../pages/CategoryPage"));
const SubCategoryPage = lazy(() => import("../pages/SubCategoryPage"));
const ProductAdmin = lazy(() => import("../pages/ProductAdmin"));
const AdminPermision = lazy(() => import("../layouts/AdminPermision"));
const ProductListPage = lazy(() => import("../pages/ProductListPage"));
const ProductDisplayPage = lazy(() => import("../pages/ProductDisplayPage"));
const CheckoutPage = lazy(() => import("../pages/CheckoutPage"));
const Success = lazy(() => import("../pages/Success"));
const Cancel = lazy(() => import("../pages/Cancel"));
const AllOrders = lazy(() => import("../pages/AllOrders"));
const About = lazy(() => import("../pages/About"));
const Contact = lazy(() => import("../pages/Contact"));
const Processing = lazy(() => import("../pages/Processing"));
const DashboardOverview = lazy(() => import("../pages/DashboardOverview"));
const BannerAdmin = lazy(() => import("../pages/BannerAdmin"));
const AllProducts = lazy(() => import("../pages/AllProducts"));
const CartPage = lazy(() => import("../pages/CartPage"));
const WriteReview = lazy(() => import("../pages/WriteReview"));
const AdminSiteReviews = lazy(() => import("../pages/AdminSiteReviews"));
const AnnouncementAdmin = lazy(() => import("../pages/AnnouncementAdmin"));
const AdminProductReviews = lazy(() => import("../pages/AdminProductReviews"));
const AllUsers = lazy(() => import("../pages/AllUsers"));
const UserHistory = lazy(() => import("../pages/UserHistory"));
const FoundationAdmin = lazy(() => import("../pages/FoundationAdmin"));
const GeneralSettingsAdmin = lazy(() => import("../pages/GeneralSettingsAdmin"));
const TermsAndConditions = lazy(() => import("../pages/TermsAndConditions"));
const ShippingPolicy = lazy(() => import("../pages/ShippingPolicy"));
const ReturnRefundPolicy = lazy(() => import("../pages/ReturnRefundPolicy"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
const PaymentPolicy = lazy(() => import("../pages/PaymentPolicy"));
const DisclaimerPage = lazy(() => import("../pages/DisclaimerPage"));
const DonationPolicy = lazy(() => import("../pages/DonationPolicy"));


const router = createBrowserRouter([

  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "processing",
        element: <Processing />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "all-products",
        element: <AllProducts />,
      },
      {
        path: "write-review",
        element: <WriteReview />,
      },
      {
        path: "terms-and-conditions",
        element: <TermsAndConditions />,
      },
      {
        path: "shipping-policy",
        element: <ShippingPolicy />,
      },
      {
        path: "return-refund-policy",
        element: <ReturnRefundPolicy />,
      },
      {
        path: "privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "payment-policy",
        element: <PaymentPolicy />,
      },
      {
        path: "disclaimer",
        element: <DisclaimerPage />,
      },
      {
        path: "donation-policy",
        element: <DonationPolicy />,
      },


      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verification-otp",
        element: <OtpVerification />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "user",
        children: [
          {
            path: "",
            element: <UserMenuMobile />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "myorders",
            element: <MyOrders />,
          },
        ]
      },
      {
        path: "dashboard",
        element: (
          <AdminPermision>
            <Dashboard />
          </AdminPermision>
        ),
        children: [
          {
            index: true,
            element: (
              <AdminPermision>
                <DashboardOverview />
              </AdminPermision>
            ),
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "myorders",
            element: <MyOrders />,
          },
          {
            path: "category",
            element: (
              <AdminPermision>
                <CategoryPage />
              </AdminPermision>
            ),
          },
          {
            path: "subcategory",
            element: (
              <AdminPermision>
                <SubCategoryPage />
              </AdminPermision>
            ),
          },
          {
            path: "product",
            element: (
              <AdminPermision>
                <ProductAdmin />
              </AdminPermision>
            ),
          },
          {
            path: "allorders",
            element: (
              <AdminPermision>
                <AllOrders />
              </AdminPermision>
            ),
          },
          {
            path: "banner",
            element: (
              <AdminPermision>
                <BannerAdmin />
              </AdminPermision>
            ),
          },
          {
            path: "site-reviews",
            element: (
              <AdminPermision>
                <AdminSiteReviews />
              </AdminPermision>
            ),
          },
          {
            path: "announcement",
            element: (
              <AdminPermision>
                <AnnouncementAdmin />
              </AdminPermision>
            ),
          },
          {
            path: "product-reviews",
            element: (
              <AdminPermision>
                <AdminProductReviews />
              </AdminPermision>
            ),
          },
          {
            path: "users",
            element: (
              <AdminPermision>
                <AllUsers />
              </AdminPermision>
            ),
          },
          {
            path: "user-history/:userId",
            element: (
              <AdminPermision>
                <UserHistory />
              </AdminPermision>
            ),
          },
          {
            path: "foundation",
            element: (
              <AdminPermision>
                <FoundationAdmin />
              </AdminPermision>
            ),
          },
          {
            path: "settings",
            element: (
              <AdminPermision>
                <GeneralSettingsAdmin />
              </AdminPermision>
            ),
          },

          
          // {
          //   path: "overview",
          //   element: (
          //     <AdminPermision>
          //       <Overview />
          //     </AdminPermision>
          //   ),
          // },
        ],
      },
      {
        path: ":category",
        children: [
          {
            index: true,
            element: <ProductListPage />,
          },
          {
            path: ":subCategory",
            element: <ProductListPage />,
          },
        ],
      },
      {
        path: "product/:product",
        element: <ProductDisplayPage />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "success",
        element: <Success />,
      },
      {
        path: "cancel",
        element: <Cancel />,
      },
      {
        path: "order-details/:groupId",
        element: <OrderDetails />,
      },
    ],
  },
]);

export default router;