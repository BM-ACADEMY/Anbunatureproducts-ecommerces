import React, { useEffect, useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SummaryApi from '../common/SummaryApi';
import { toast } from 'sonner';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validate form: all fields filled and passwords match
  const isValidValue = data.email && data.newPassword && data.confirmPassword && data.newPassword === data.confirmPassword;

  // Redirect if no valid state or set email from location.state
  useEffect(() => {
    if (!location?.state?.data?.success || !location?.state?.email) {
      navigate('/');
      return;
    }
    setData((prev) => ({
      ...prev,
      email: location.state.email,
    }));
  }, [location, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Password complexity validation
    if (data.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      setIsLoading(false);
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      toast.error('New password and confirm password must match.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.resetPassword,
        data: {
          email: data.email,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        },
      });

      if (response.data.error) {
        toast.error(response.data.message);
        setIsLoading(false);
        return;
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setData({
          email: '',
          newPassword: '',
          confirmPassword: '',
        });
        navigate('/login');
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-[#fcf8ed] p-4">
      <form onSubmit={handleSubmit} className="max-w-96 w-full text-center border border-gray-300/60 rounded-2xl px-8 py-10 bg-white shadow-sm">
        <h1 className="text-gray-900 text-3xl font-medium">Reset Password</h1>
        <p className="text-gray-500 text-sm mt-3 px-2">Set a new password to secure your account and regain access.</p>
        
        {/* New Password Input */}
        <div className="flex items-center mt-10 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden px-4 gap-2 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition-colors">
          <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 4.25V6.8H4.061z" fill="#6B7280"/>
          </svg>
          <input 
            name="newPassword"
            type={showPassword ? "text" : "password"} 
            placeholder="New Password" 
            value={data.newPassword}
            onChange={handleChange}
            className="bg-transparent text-gray-700 placeholder-gray-400 outline-none text-sm w-full h-full flex-1" 
            disabled={isLoading}
            required 
            autoFocus
          />    
          <button
            type='button'
            onClick={() => setShowPassword(prev => !prev)}
            className='text-gray-400 hover:text-gray-600 focus:outline-none'
            tabIndex="-1"
          >
            {showPassword ? <FaRegEye className='h-4 w-4' /> : <FaRegEyeSlash className='h-4 w-4' />}
          </button>             
        </div>

        {/* Confirm Password Input */}
        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden px-4 gap-2 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition-colors">
          <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 4.25V6.8H4.061z" fill="#6B7280"/>
          </svg>
          <input 
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"} 
            placeholder="Confirm Password" 
            value={data.confirmPassword}
            onChange={handleChange}
            className="bg-transparent text-gray-700 placeholder-gray-400 outline-none text-sm w-full h-full flex-1" 
            disabled={isLoading}
            required 
          />    
          <button
            type='button'
            onClick={() => setShowConfirmPassword(prev => !prev)}
            className='text-gray-400 hover:text-gray-600 focus:outline-none'
            tabIndex="-1"
          >
            {showConfirmPassword ? <FaRegEye className='h-4 w-4' /> : <FaRegEyeSlash className='h-4 w-4' />}
          </button>             
        </div>

        <button 
          type="submit" 
          disabled={!isValidValue || isLoading}
          className="mt-8 w-full h-11 rounded-full text-white bg-green-600 hover:bg-green-700 shadow-md shadow-green-100 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none font-medium text-sm flex items-center justify-center"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Change Password'
          )}
        </button>

        <p className="text-gray-500 text-sm mt-8">
          Back to{' '}
          <Link className="text-green-600 hover:text-green-700 font-medium" to="/login">
            Login
          </Link>
        </p>
      </form>
    </section>
  );
};

export default ResetPassword;