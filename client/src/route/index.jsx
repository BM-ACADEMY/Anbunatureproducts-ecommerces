// route/index.jsx
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerification from "../pages/OtpVerification";
import ResetPassword from "../pages/ResetPassword";
import UserMenuMobile from "../pages/UserMenuMobile";
import Dashboard from "../layouts/Dashboard";
import Profile from "../pages/Profile";
import MyOrders from "../pages/MyOrders";
import OrderDetails from "../pages/OrderDetails";
import CategoryPage from "../pages/CategoryPage";
import SubCategoryPage from "../pages/SubCategoryPage";
import ProductAdmin from "../pages/ProductAdmin";
import AdminPermision from "../layouts/AdminPermision";
import ProductListPage from "../pages/ProductListPage";
import ProductDisplayPage from "../pages/ProductDisplayPage";
import CheckoutPage from "../pages/CheckoutPage";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";
import AllOrders from "../pages/AllOrders";
import About from "../pages/About";
import Manufacturing from "../pages/Manufacturing";
import Contact from "../pages/Contact";
import Processing from "../pages/Processing";
import DashboardOverview from "../pages/DashboardOverview";
import BannerAdmin from "../pages/BannerAdmin";
import AllProducts from "../pages/AllProducts";
import CartPage from "../pages/CartPage";
import WriteReview from "../pages/WriteReview";
import AdminSiteReviews from "../pages/AdminSiteReviews";
// import Overview from "../pages/Overview";

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
        path: "manufacturing",
        element: <Manufacturing />,
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
        element: <Dashboard />,
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