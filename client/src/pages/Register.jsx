import React, { useState } from 'react';
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, CircularProgress } from '@mui/material';

const Register = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        otp: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [userId, setUserId] = useState(null);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        // For OTP, ensure only numeric input and max 6 digits
        if (name === 'otp') {
            if (/^\d{0,6}$/.test(value)) {
                setData((prev) => ({ ...prev, [name]: value }));
            }
        } else {
            setData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const isSendOtpValid = data.name && data.email && data.password && data.confirmPassword && data.password === data.confirmPassword;
    const validateValue = isOtpSent
        ? data.otp.length === 6 && data.name && data.email && data.password && data.confirmPassword
        : data.name && data.email && data.password && data.confirmPassword;

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (data.password !== data.confirmPassword) {
            toast.error("Password and confirm password must be the same");
            setIsLoading(false);
            return;
        }

        try {
            const response = await Axios({
                ...SummaryApi.register,
                data: { name: data.name, email: data.email, password: data.password }
            });

            if (response.data.error) {
                toast.error(response.data.message);
                setIsLoading(false);
                return;
            }

            if (response.data.success) {
                toast.success(response.data.message);
                setUserId(response.data.data.userId);
                setIsOtpSent(true);
            } else {
                toast.error("Unexpected response from server");
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!userId || !data.otp) {
            toast.error("User ID or OTP is missing");
            setIsLoading(false);
            return;
        }

        try {
            const response = await Axios({
                ...SummaryApi.verify_otp,
                data: { userId, otp: data.otp }
            });

            if (response.data.error) {
                toast.error(response.data.message);
                setIsLoading(false);
                return;
            }

            if (response.data.success) {
                toast.success(response.data.message);
                setData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    otp: ""
                });
                setIsOtpSent(false);
                setUserId(null);
                navigate("/login");
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="flex items-center justify-center min-h-[calc(90vh-4rem)] bg-gradient-to-br from-blue-50 to-green-50">

            <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to <span className="text-green-600">Anbu Natural</span></h1>
                        <p className="text-gray-600">Create your account to get started</p>
                    </div>

                    <form className="space-y-6" onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp}>
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <TextField
                                id="name"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                autoFocus
                                disabled={isOtpSent || isLoading}
                                fullWidth
                                variant="outlined"
                                size="small"
                                InputProps={{
                                    className: 'rounded-lg'
                                }}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <TextField
                                id="email"
                                name="email"
                                type="email"
                                value={data.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                disabled={isOtpSent || isLoading}
                                fullWidth
                                variant="outlined"
                                size="small"
                                InputProps={{
                                    className: 'rounded-lg'
                                }}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <TextField
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={data.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    disabled={isOtpSent || isLoading}
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                        className: 'rounded-lg pr-10'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <FaRegEye className="h-5 w-5" /> : <FaRegEyeSlash className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <div className="relative">
                                <TextField
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={data.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    disabled={isOtpSent || isLoading}
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                        className: 'rounded-lg pr-10'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(prev => !prev)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? <FaRegEye className="h-5 w-5" /> : <FaRegEyeSlash className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {isOtpSent && (
                            <div className="space-y-2 animate-fade-in">
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">OTP</label>
                                <TextField
                                    id="otp"
                                    name="otp"
                                    value={data.otp}
                                    onChange={handleChange}
                                    placeholder="Enter 6-digit OTP"
                                    disabled={isLoading}
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    inputProps={{
                                        maxLength: 6,
                                        pattern: '[0-9]*',
                                        inputMode: 'numeric'
                                    }}
                                    autoFocus
                                    helperText="Enter the 6-digit OTP sent to your email"
                                    FormHelperTextProps={{
                                        className: 'text-xs text-gray-500 mt-1'
                                    }}
                                    InputProps={{
                                        className: 'rounded-lg'
                                    }}
                                />
                            </div>
                        )}

                        <div className="flex justify-end pt-4">
                            {isOtpSent ? (
                                <Button
                                    type="submit"
                                    disabled={!validateValue || isLoading}
                                    variant="contained"
                                    color="success"
                                    className="w-40"
                                    sx={{
                                        borderRadius: '0.5rem',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        paddingY: 1.5,
                                        backgroundColor: validateValue && !isLoading ? '#16a34a' : '#9ca3af',
                                        '&:hover': {
                                            backgroundColor: validateValue && !isLoading ? '#15803d' : '#9ca3af'
                                        }
                                    }}
                                    startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
                                >
                                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={!isSendOtpValid || isLoading}
                                    variant="contained"
                                    color="primary"
                                    className="w-40"
                                    sx={{
                                        borderRadius: '0.5rem',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        paddingY: 1.5,
                                        backgroundColor: isSendOtpValid && !isLoading ? '#2563eb' : '#9ca3af',
                                        '&:hover': {
                                            backgroundColor: isSendOtpValid && !isLoading ? '#1d4ed8' : '#9ca3af'
                                        }
                                    }}
                                    startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
                                >
                                    {isLoading ? 'Sending...' : 'Send OTP'}
                                </Button>
                            )}
                        </div>
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

export default Register;