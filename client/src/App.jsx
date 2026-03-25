import { Outlet, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import fetchUserDetails from './utils/fetchUserDetails';
import { setUserDetails } from './store/userSlice';
import { setAllCategory, setAllSubCategory, setLoadingCategory } from './store/productSlice';
import { useDispatch } from 'react-redux';
import Axios from './utils/Axios';
import SummaryApi from './common/SummaryApi';
import { handleAddItemCart } from './store/cartProduct';
import GlobalProvider from './provider/GlobalProvider';
import { FaCartShopping } from "react-icons/fa6";
// import WhatsappFloatButton from './components/WhatsappFloatButton';
// import CartMobileLink from './components/CartMobile';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  const fetchUser = async () => {
    const userData = await fetchUserDetails();
    dispatch(setUserDetails(userData.data));
  };

  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true));
      const response = await Axios({
        ...SummaryApi.getCategory,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(setAllCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name))));
      }
    } catch (error) {
      // Handle error if needed
    } finally {
      dispatch(setLoadingCategory(false));
    }
  };

  const fetchSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getSubCategory,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(setAllSubCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name))));
      }
    } catch (error) {
      // Handle error if needed
    }
  };

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    fetchUser();
    fetchCategory();
    fetchSubCategory();
  }, []);

  const isDashboardPage = location.pathname.startsWith("/dashboard");
  const isSearchPage = location.pathname === "/search";
  const hideHeaderFooter = isDashboardPage || isSearchPage;

  return (
    <GlobalProvider>
      {!hideHeaderFooter && <Header />}
      <main>
        <Outlet />
      </main>
      {!hideHeaderFooter && <Footer />}
      <Toaster position="top-right" duration={1000} />
      {/* <WhatsappFloatButton/> */}
    </GlobalProvider>
  );
}


export default App;