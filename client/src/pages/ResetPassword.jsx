import React, { useEffect, useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import { TextField, Button, CircularProgress } from '@mui/material';

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
          confirmPassword: data.confirmPassword, // Added confirmPassword
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
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Reset Your Password</h1>
            <p className="text-gray-600">Enter a new password for your account</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative">
                <TextField
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={data.newPassword}
                  onChange={handleChange}
                  placeholder="Enter your new password"
                  disabled={isLoading}
                  fullWidth
                  variant="outlined"
                  size="small"
                  inputProps={{
                    minLength: 8,
                  }}
                  InputProps={{
                    className: 'rounded-lg pr-10',
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#EFF6FF', // bg-blue-50
                      '&:hover fieldset': {
                        borderColor: '#93C5FD', // focus:border-primary-200
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#93C5FD',
                      },
                    },
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaRegEye className="h-5 w-5" /> : <FaRegEyeSlash className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <TextField
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={data.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                  fullWidth
                  variant="outlined"
                  size="small"
                  inputProps={{
                    minLength: 8,
                  }}
                  InputProps={{
                    className: 'rounded-lg pr-10',
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#EFF6FF', // bg-blue-50
                      '&:hover fieldset': {
                        borderColor: '#93C5FD', // focus:border-primary-200
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#93C5FD',
                      },
                    },
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <FaRegEye className="h-5 w-5" /> : <FaRegEyeSlash className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={!isValidValue || isLoading}
              variant="contained"
              color="success"
              fullWidth
              sx={{
                borderRadius: '0.5rem',
                textTransform: 'none',
                fontWeight: 600,
                paddingY: 1.5,
                backgroundColor: isValidValue && !isLoading ? '#16a34a' : '#9ca3af',
                '&:hover': {
                  backgroundColor: isValidValue && !isLoading ? '#15803d' : '#9ca3af',
                },
              }}
              startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
            >
              {isLoading ? 'Changing...' : 'Change Password'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-green-600 hover:text-green-800 transition-colors duration-200 underline underline-offset-2"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;