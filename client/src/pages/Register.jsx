import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import fetchUserDetails from '../utils/fetchUserDetails';
import { toast } from 'sonner';
import { GoogleLogin } from '@react-oauth/google';
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";

const Register = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
        otp: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [userId, setUserId] = useState(null);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleGoogleSuccess = async (credentialResponse) => {
        setIsLoading(true);
        try {
            const response = await Axios({
                ...SummaryApi.googleLogin,
                data: { token: credentialResponse.credential }
            });

            if (response.data.error) {
                toast.error(response.data.message);
                setIsLoading(false);
                return;
            }

            if (response.data.success) {
                toast.success(response.data.message);
                localStorage.setItem('accesstoken', response.data.data.accesstoken);
                localStorage.setItem('refreshToken', response.data.data.refreshToken);

                const userDetails = await fetchUserDetails();
                dispatch(setUserDetails(userDetails.data));

                navigate("/");
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'otp') {
            if (/^\d{0,6}$/.test(value)) {
                setData((prev) => ({ ...prev, [name]: value }));
            }
        } else {
            setData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const isSendOtpValid = data.email && data.password;
    const validateValue = isOtpSent
        ? data.otp.length === 6 && data.email && data.password
        : data.email && data.password;

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await Axios({
                ...SummaryApi.register,
                data: { email: data.email, password: data.password }
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
                    email: "",
                    password: "",
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
        <section className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 p-4">
            <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp} className="max-w-96 w-full text-center border border-gray-300/60 rounded-2xl px-8 py-10 bg-white shadow-sm">
                <h1 className="text-gray-900 text-3xl font-medium">
                    {isOtpSent ? "Verify OTP" : "Sign up"}
                </h1>
                <p className="text-gray-500 text-sm mt-2">
                    {isOtpSent ? "Enter the 6-digit OTP sent to your email" : "Create an account to continue"}
                </p>
                
                {!isOtpSent && (
                    <>
                        <div className="flex items-center w-full mt-10 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden px-4 gap-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-colors">
                            <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z" fill="#6B7280"/>
                            </svg>
                            <input 
                                name="email"
                                type="email" 
                                placeholder="Email id" 
                                value={data.email}
                                onChange={handleChange}
                                className="bg-transparent text-gray-700 placeholder-gray-400 outline-none text-sm w-full h-full" 
                                disabled={isLoading}
                                required 
                            />                 
                        </div>

                        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden px-4 gap-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-colors">
                            <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="#6B7280"/>
                            </svg>
                            <input 
                                name="password"
                                type={showPassword ? "text" : "password"} 
                                placeholder="Password" 
                                value={data.password}
                                onChange={handleChange}
                                className="bg-transparent text-gray-700 placeholder-gray-400 outline-none text-sm w-full h-full flex-1" 
                                disabled={isLoading}
                                required 
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
                    </>
                )}

                {isOtpSent && (
                    <div className="flex items-center w-full mt-10 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden px-4 gap-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.06 19.43 4 16.05 4 12C4 7.95 7.06 4.57 11 4.07V19.93ZM13 4.07C16.94 4.57 20 7.95 20 12C20 16.05 16.94 19.43 13 19.93V4.07Z" fill="#6B7280"/>
                        </svg>
                        <input 
                            name="otp"
                            type="text" 
                            placeholder="6-digit OTP" 
                            value={data.otp}
                            onChange={handleChange}
                            className="bg-transparent text-center tracking-widest text-gray-700 placeholder-gray-400 outline-none text-sm w-full h-full" 
                            disabled={isLoading}
                            maxLength={6}
                            required 
                            autoFocus
                        />                 
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={isOtpSent ? (!validateValue || isLoading) : (!isSendOtpValid || isLoading)}
                    className="mt-8 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity disabled:bg-gray-400 disabled:cursor-not-allowed font-medium text-sm flex items-center justify-center"
                >
                    {isLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        isOtpSent ? 'Verify OTP' : 'Send OTP'
                    )}
                </button>
                
                {!isOtpSent && (
                    <>
                        <div className="flex items-center justify-center my-6 space-x-3">
                            <div className="border-t border-gray-200 flex-grow"></div>
                            <span className="text-xs text-gray-400 font-medium">OR</span>
                            <div className="border-t border-gray-200 flex-grow"></div>
                        </div>

                        <div className="flex justify-center w-full">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => toast.error('Google Sign Up Failed')}
                                theme="outline"
                                size="large"
                                text="signup_with"
                                width="100%"
                                shape="pill"
                            />
                        </div>
                    </>
                )}

                <p className="text-gray-500 text-sm mt-6">
                    Already have an account?{' '}
                    <Link className="text-indigo-500 hover:text-indigo-600 font-medium" to="/login">
                        Login
                    </Link>
                </p>
            </form>
        </section>
    );
};

export default Register;