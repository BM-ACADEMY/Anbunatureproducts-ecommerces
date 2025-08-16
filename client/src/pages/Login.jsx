import React, { useState } from 'react';
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        });
    };

    const valideValue = Object.values(data).every(el => el);

    const handleSubmit = async(e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await Axios({
                ...SummaryApi.login,
                data: data
            });
            
            if(response.data.error){
                toast.error(response.data.message);
                setIsLoading(false);
                return;
            }

            if(response.data.success){
                toast.success(response.data.message);
                localStorage.setItem('accesstoken', response.data.data.accesstoken);
                localStorage.setItem('refreshToken', response.data.data.refreshToken);

                const userDetails = await fetchUserDetails();
                dispatch(setUserDetails(userDetails.data));

                setData({
                    email: "",
                    password: "",
                });
                navigate("/");
            }

        } catch (error) {
            AxiosToastError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className='flex items-center justify-center min-h-[calc(90vh-4rem)] bg-gradient-to-br from-blue-50 to-green-50'>
            <div className='bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl'>
                <div className='p-8'>
                    <div className='text-center mb-8'>
                        <h1 className='text-3xl font-bold text-gray-800 mb-2'>Welcome back to <span className='text-green-600'>Anbu Natural</span></h1>
                        <p className='text-gray-600'>Login to access your account</p>
                    </div>

                    <form className='space-y-6' onSubmit={handleSubmit}>
                        <div className='space-y-2'>
                            <label htmlFor='email' className='block text-sm font-medium text-gray-700'>Email</label>
                            <input
                                type='email'
                                id='email'
                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200'
                                name='email'
                                value={data.email}
                                onChange={handleChange}
                                placeholder='Enter your email'
                                disabled={isLoading}
                            />
                        </div>

                        <div className='space-y-2'>
                            <label htmlFor='password' className='block text-sm font-medium text-gray-700'>Password</label>
                            <div className='relative'>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id='password'
                                    className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 pr-10'
                                    name='password'
                                    value={data.password}
                                    onChange={handleChange}
                                    placeholder='Enter your password'
                                    disabled={isLoading}
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowPassword(preve => !preve)}
                                    className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700'
                                >
                                    {showPassword ? <FaRegEye className='h-5 w-5' /> : <FaRegEyeSlash className='h-5 w-5' />}
                                </button>
                            </div>
                            <div className='flex justify-end'>
                                <Link 
                                    to="/forgot-password" 
                                    className='text-sm text-green-600 hover:text-green-800 transition-colors duration-200 hover:underline'
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <div className='pt-4'>
                            <button
                                type='submit'
                                disabled={!valideValue || isLoading}
                                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${valideValue && !isLoading ? 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg' : 'bg-gray-400 cursor-not-allowed'} flex items-center justify-center`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Logging in...
                                    </>
                                ) : 'Login'}
                            </button>
                        </div>
                    </form>

                    <div className='mt-6 text-center'>
                        <p className='text-gray-600'>
                            Don't have an account?{' '}
                            <Link 
                                to="/register" 
                                className='font-semibold text-green-600 hover:text-green-800 transition-colors duration-200 underline underline-offset-2'
                            >
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;