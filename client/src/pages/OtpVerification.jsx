import React, { useEffect, useRef, useState } from 'react';
// import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TextField, Button } from '@mui/material';

const OtpVerification = () => {
    const [data, setData] = useState(["", "", "", "", "", ""]);
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
            console.log('error', error);
            AxiosToastError(error);
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
        <section className="flex items-center justify-center min-h-[calc(90vh-4rem)] bg-gradient-to-br from-blue-50 to-green-50">
            <div className="bg-white w-full max-w-lg mx-auto rounded-xl shadow-2xl p-8 transition-all duration-300 hover:shadow-3xl">
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">Enter <span className="text-green-600">OTP</span></h1>
                <p className="text-gray-600 mb-6">Enter the 6-digit OTP sent to your email</p>

                <form className="grid gap-6" onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Enter Your OTP</label>
                        <div className="flex items-center gap-2 justify-between mt-3">
                            {data.map((element, index) => (
                                <TextField
                                    key={`otp${index}`}
                                    id={`otp-${index}`}
                                    value={data[index]}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    inputRef={(el) => (inputRef.current[index] = el)}
                                    variant="outlined"
                                    size="small"
                                    inputProps={{
                                        maxLength: 1,
                                        pattern: '[0-9]*',
                                        inputMode: 'numeric',
                                        style: { textAlign: 'center', fontWeight: 600 }
                                    }}
                                    sx={{
                                        width: '3.5rem',
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '0.5rem',
                                            backgroundColor: '#EFF6FF', // Matches bg-blue-50
                                            '&:hover fieldset': {
                                                borderColor: '#93C5FD' // Matches focus:border-primary-200
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#93C5FD'
                                            }
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={!valideValue}
                        variant="contained"
                        color="success"
                        fullWidth
                        sx={{
                            borderRadius: '0.5rem',
                            textTransform: 'none',
                            fontWeight: 600,
                            paddingY: 1.5,
                            backgroundColor: valideValue ? '#16a34a' : '#9ca3af',
                            '&:hover': {
                                backgroundColor: valideValue ? '#15803d' : '#9ca3af'
                            }
                        }}
                    >
                        Verify OTP
                    </Button>
                </form>

                <p className="mt-6 text-center text-gray-600">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="font-semibold text-green-600 hover:text-green-800 transition-colors duration-200 underline underline-offset-2"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default OtpVerification;