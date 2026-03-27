import React, { useState } from 'react';
import { toast } from 'sonner';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [data, setData] = useState({
        email: "",
    });
    const [isLoading, setIsLoading] = useState(false);
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
        setIsLoading(true);
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
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-[#fcf8ed] p-4">
            <form onSubmit={handleSubmit} className="max-w-96 w-full text-center border border-gray-300/60 rounded-2xl px-8 py-10 bg-white shadow-sm">
                <h1 className="text-gray-900 text-3xl font-medium">Forgot Password</h1>
                <p className="text-gray-500 text-sm mt-3 px-2">Enter your email address and we'll send you an OTP to reset your password.</p>
                
                <div className="flex items-center w-full mt-10 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden px-4 gap-2 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition-colors">
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
                        autoFocus
                    />                 
                </div>

                <button 
                    type="submit" 
                    disabled={!valideValue || isLoading}
                    className="mt-8 w-full h-11 rounded-full text-white bg-green-600 hover:bg-green-700 shadow-md shadow-green-100 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none font-medium text-sm flex items-center justify-center"
                >
                    {isLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        'Send OTP'
                    )}
                </button>

                <p className="text-gray-500 text-sm mt-8">
                    Remember your password?{' '}
                    <Link className="text-green-600 hover:text-green-700 font-medium" to="/login">
                        Login
                    </Link>
                </p>
            </form>
        </section>
    );
};

export default ForgotPassword;