import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { toast } from 'sonner'
import AxiosToastError from '../utils/AxiosToastError'
import { FiX, FiCheck, FiInfo } from "react-icons/fi";
import { useGlobalContext } from '../provider/GlobalProvider'
import { State, City } from 'country-state-city';

const AddAddress = ({ close }) => {
    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            country: 'India'
        }
    })
    const { fetchAddress } = useGlobalContext()
    const [loading, setLoading] = useState(false);

    const states = State.getStatesOfCountry('IN');
    const selectedStateCode = watch('stateCode');
    const [cities, setCities] = useState([]);

    useEffect(() => {
        if (selectedStateCode) {
            const stateCities = City.getCitiesOfState('IN', selectedStateCode);
            setCities(stateCities);
            setValue('state', states.find(s => s.isoCode === selectedStateCode)?.name || '');
        } else {
            setCities([]);
        }
    }, [selectedStateCode, setValue, states]);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.createAddress,
                data: {
                    address_line: data.address_line_1,
                    address_line_2: data.address_line_2,
                    landmark: data.landmark,
                    city: data.city,
                    state: data.state,
                    country: data.country,
                    pincode: data.pincode,
                    mobile: data.mobile,
                    alternative_mobile: data.alternative_mobile
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                close()
                reset()
                fetchAddress()
            } else {
                toast.error(responseData.message || "Failed to save address")
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className='fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4'>
            <div className='bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col'>

                {/* Header */}
                <div className='px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50'>
                    <div>
                        <h2 className='font-bold text-xl text-slate-800'>Shipping Address</h2>
                        <p className='text-xs text-slate-400 mt-0.5'>Please provide your delivery details</p>
                    </div>
                    <button onClick={close} className='p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-all'>
                        <FiX size={22} />
                    </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col flex-grow overflow-hidden'>
                    <div className='p-8 overflow-y-auto custom-scrollbar flex-grow'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5'>
                            {/* Address Line 1 */}
                            <div className='md:col-span-2 space-y-1.5'>
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Address Line 1 <span className="text-red-500">*</span></label>
                                <input
                                    {...register('address_line_1', { required: "Address Line 1 is required" })}
                                    placeholder="House No., Building Name, Street"
                                    className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm font-medium outline-none transition-all focus:ring-4 focus:ring-slate-50 ${
                                        errors.address_line_1 ? "border-red-200 focus:border-red-500" : "border-slate-200 focus:border-slate-400"
                                    }`}
                                />
                                {errors.address_line_1 && (
                                    <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.address_line_1.message}</p>
                                )}
                            </div>

                            {/* Address Line 2 */}
                            <div className='md:col-span-2 space-y-1.5'>
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Address Line 2 (Optional)</label>
                                <input
                                    {...register('address_line_2')}
                                    placeholder="Area, Colony, Road"
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none transition-all focus:ring-4 focus:ring-slate-50 focus:border-slate-400"
                                />
                            </div>

                            {/* Landmark */}
                            <div className='md:col-span-2 space-y-1.5'>
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Landmark (Optional)</label>
                                <div className="relative">
                                    <input
                                        {...register('landmark')}
                                        placeholder="E.g. Near Apollo Hospital"
                                        className="w-full px-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none transition-all focus:ring-4 focus:ring-slate-50 focus:border-slate-400"
                                    />
                                    <FiInfo className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                </div>
                            </div>

                            {/* State Selection */}
                            <div className='space-y-1.5'>
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">State <span className="text-red-500">*</span></label>
                                <select
                                    {...register('stateCode', { required: "State is required" })}
                                    className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm font-medium outline-none transition-all focus:ring-4 focus:ring-slate-50 ${
                                        errors.stateCode ? "border-red-200 focus:border-red-500" : "border-slate-200 focus:border-slate-400"
                                    }`}
                                >
                                    <option value="">Select State</option>
                                    {states.map(state => (
                                        <option key={state.isoCode} value={state.isoCode}>{state.name}</option>
                                    ))}
                                </select>
                                {errors.stateCode && (
                                    <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.stateCode.message}</p>
                                )}
                            </div>

                            {/* City Selection */}
                            <div className='space-y-1.5'>
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">City <span className="text-red-500">*</span></label>
                                <select
                                    {...register('city', { required: "City is required" })}
                                    disabled={!selectedStateCode}
                                    className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm font-medium outline-none transition-all focus:ring-4 focus:ring-slate-50 disabled:bg-slate-50 disabled:text-slate-400 ${
                                        errors.city ? "border-red-200 focus:border-red-500" : "border-slate-200 focus:border-slate-400"
                                    }`}
                                >
                                    <option value="">Select City</option>
                                    {cities.map(city => (
                                        <option key={city.name} value={city.name}>{city.name}</option>
                                    ))}
                                </select>
                                {errors.city && (
                                    <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.city.message}</p>
                                )}
                            </div>

                            {/* Pincode */}
                            <div className='space-y-1.5'>
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Pincode <span className="text-red-500">*</span></label>
                                <input
                                    {...register('pincode', { required: "Pincode is required", pattern: { value: /^[0-9]{6}$/, message: "Invalid pincode" } })}
                                    placeholder="6-digit code"
                                    maxLength={6}
                                    className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm font-medium outline-none transition-all focus:ring-4 focus:ring-slate-50 ${
                                        errors.pincode ? "border-red-200 focus:border-red-500" : "border-slate-200 focus:border-slate-400"
                                    }`}
                                />
                                {errors.pincode && (
                                    <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.pincode.message}</p>
                                )}
                            </div>

                            {/* Country */}
                            <div className='space-y-1.5'>
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Country</label>
                                <input
                                    {...register('country')}
                                    readOnly
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-400 outline-none"
                                />
                            </div>

                            {/* Mobile Number */}
                            <div className='space-y-1.5'>
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Mobile Number <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">+91</span>
                                    <input
                                        {...register('mobile', { required: "Mobile number is required", pattern: { value: /^[0-9]{10}$/, message: "Invalid mobile number" } })}
                                        placeholder="Phone number"
                                        maxLength={10}
                                        className={`w-full pl-12 pr-4 py-2.5 bg-white border rounded-xl text-sm font-medium outline-none transition-all focus:ring-4 focus:ring-slate-50 ${
                                            errors.mobile ? "border-red-200 focus:border-red-500" : "border-slate-200 focus:border-slate-400"
                                        }`}
                                    />
                                </div>
                                {errors.mobile && (
                                    <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.mobile.message}</p>
                                )}
                            </div>

                            {/* Alternative Mobile Number */}
                            <div className='space-y-1.5'>
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Alt. Mobile (Optional)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">+91</span>
                                    <input
                                        {...register('alternative_mobile', { pattern: { value: /^[0-9]{10}$/, message: "Invalid mobile number" } })}
                                        placeholder="Alternative contact"
                                        maxLength={10}
                                        className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none transition-all focus:ring-4 focus:ring-slate-50 focus:border-slate-400"
                                    />
                                </div>
                                {errors.alternative_mobile && (
                                    <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.alternative_mobile.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-5 border-t border-slate-100 bg-gray-50/30 flex gap-4">
                        <button
                            type="button"
                            onClick={close}
                            className="flex-1 px-6 py-3 text-sm font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <FiCheck size={18} />
                                    <span>Save Address</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default AddAddress

