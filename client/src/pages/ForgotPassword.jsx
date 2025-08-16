import React, { useState } from 'react';
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [data, setData] = useState({
        email: "",
    });
    const navigate = useNavigate();

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
        try {
            const response = await Axios({
                ...SummaryApi.forgot_password,
                data: data
            });
            
            if(response.data.error){
                toast.error(response.data.message);
            }

            if(response.data.success){
                toast.success(response.data.message);
                navigate("/verification-otp", {
                    state: data
                });
                setData({
                    email: "",
                });
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    return (
        <section className="flex items-center justify-center min-h-[calc(90vh-4rem)] bg-gradient-to-br from-blue-50 to-green-50">
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Forgot <span className="text-green-600">Password</span></h1>
                        <p className="text-gray-600 mt-2">Enter your email to receive a password reset OTP</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!valideValue}
                            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${
                                valideValue 
                                    ? 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg' 
                                    : 'bg-gray-400 cursor-not-allowed'
                            }`}
                        >
                            Send OTP
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Remember your password?{' '}
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

export default ForgotPassword;