import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const OtpVerification = () => {
    const [data, setData] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const inputRef = useRef([]);
    const location = useLocation();

    useEffect(() => {
        if (!location?.state?.email) {
            navigate("/forgot-password");
        }
    }, [navigate, location]);

    const valideValue = data.every(el => el);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await Axios({
                ...SummaryApi.forgot_password_otp_verification,
                data: {
                    otp: data.join(""),
                    email: location?.state?.email
                }
            });

            if (response.data.error) {
                toast.error(response.data.message);
                return;
            }

            if (response.data.success) {
                toast.success(response.data.message);
                setData(["", "", "", "", "", ""]);
                navigate("/reset-password", {
                    state: {
                        data: response.data,
                        email: location?.state?.email
                    }
                });
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (index, value) => {
        if (/^\d?$/.test(value)) { // Allow only a single digit or empty
            const newData = [...data];
            newData[index] = value;
            setData(newData);

            // Focus next input if a digit is entered and not the last field
            if (value && index < 5) {
                inputRef.current[index + 1].focus();
            }
            // Focus previous input if value is cleared and not the first field
            if (!value && index > 0) {
                inputRef.current[index - 1].focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !data[index] && index > 0) {
            inputRef.current[index - 1].focus();
        }
    };

    return (
        <section className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-[#fcf8ed] p-4">
            <form onSubmit={handleSubmit} className="max-w-96 w-full text-center border border-gray-300/60 rounded-2xl px-8 py-10 bg-white shadow-sm">
                <h1 className="text-gray-900 text-3xl font-medium">Verify OTP</h1>
                <p className="text-gray-500 text-sm mt-3 px-2">Enter the 6-digit code sent to your email address.</p>
                
                <div className="flex items-center justify-between gap-2 mt-10 mb-8">
                    {data.map((element, index) => (
                        <input
                            key={`otp${index}`}
                            type="text"
                            maxLength="1"
                            value={element}
                            ref={(el) => (inputRef.current[index] = el)}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-11 h-12 text-center text-xl font-semibold text-gray-700 bg-white border border-gray-300/80 rounded-xl focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all"
                            disabled={isLoading}
                            required
                            autoFocus={index === 0}
                        />
                    ))}
                </div>

                <button 
                    type="submit" 
                    disabled={!valideValue || isLoading}
                    className="w-full h-11 rounded-full text-white bg-green-600 hover:bg-green-700 shadow-md shadow-green-100 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none font-medium text-sm flex items-center justify-center"
                >
                    {isLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        'Verify OTP'
                    )}
                </button>

                <p className="text-gray-500 text-sm mt-8">
                    Didn't receive code?{' '}
                    <button type="button" className="text-green-600 hover:text-green-700 font-medium">
                        Resend
                    </button>
                </p>

                <div className="mt-4">
                    <Link className="text-xs text-gray-400 hover:text-gray-600 font-medium" to="/forgot-password">
                        Back to Forgot Password
                    </Link>
                </div>
            </form>
        </section>
    );
};

export default OtpVerification;