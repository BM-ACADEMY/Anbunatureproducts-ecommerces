import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { toast } from 'sonner'
import AxiosToastError from '../utils/AxiosToastError'
import { FiX, FiCheck, FiAlertCircle } from "react-icons/fi";
import { useGlobalContext } from '../provider/GlobalProvider'

const AddAddress = ({ close }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const { fetchAddress } = useGlobalContext()
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.createAddress,
                data: {
                    address_line: data.addressline,
                    city: data.city,
                    state: data.state,
                    country: data.country,
                    pincode: data.pincode,
                    mobile: data.mobile
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                close()
                reset()
                fetchAddress()
            } else {
                setErrorDialogOpen(true)
                setErrorMessage(responseData.message || "Something went wrong. Please try again.")
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className='bg-slate-900/40 backdrop-blur-[2px] fixed top-0 left-0 right-0 bottom-0 z-[100] flex items-center justify-center p-4 overflow-y-auto custom-scrollbar'>
            <div className='bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200'>
                <div className='px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30'>
                    <h2 className='font-bold text-xl text-gray-800 tracking-tight'>Add New Address</h2>
                    <button onClick={close} className='p-2 hover:bg-rose-50 hover:text-rose-500 text-gray-400 rounded-full transition-all'>
                        <FiX size={20} />
                    </button>
                </div>
                
                <form className='p-8 grid grid-cols-1 md:grid-cols-2 gap-5' onSubmit={handleSubmit(onSubmit)}>
                    {[ 
                        { id: 'addressline', label: 'Address Line', colSpan: 'md:col-span-2' },
                        { id: 'city', label: 'City' },
                        { id: 'state', label: 'State' },
                        { id: 'pincode', label: 'Pincode' },
                        { id: 'country', label: 'Country' },
                        { id: 'mobile', label: 'Mobile No.', colSpan: 'md:col-span-2' }
                    ].map(({ id, label, colSpan }) => (
                        <div key={id} className={`${colSpan || ''} space-y-1`}>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}</label>
                            <input
                                {...register(id, { required: `${label} is required` })}
                                placeholder={`Enter ${label.toLowerCase()}`}
                                className={`w-full px-4 py-3 bg-gray-50 border rounded-2xl text-sm font-medium outline-none transition-all focus:bg-white focus:ring-4 ${
                                    errors[id] ? "border-rose-200 focus:ring-rose-50 focus:border-rose-500" : "border-gray-100 focus:ring-indigo-50 focus:border-indigo-500"
                                }`}
                            />
                            {errors[id] && (
                                <p className="text-[10px] text-rose-500 font-bold mt-1 ml-1">{errors[id].message}</p>
                            )}
                        </div>
                    ))}

                    <div className="md:col-span-2 flex gap-4 mt-4 pt-4 border-t border-gray-50">
                        <button
                            type="button"
                            onClick={close}
                            className="flex-1 px-6 py-3.5 text-sm font-bold text-gray-400 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
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

            {/* Error Modal */}
            {errorDialogOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setErrorDialogOpen(false)} />
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 z-10 animate-in fade-in zoom-in duration-200 text-center">
                        <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mx-auto mb-6">
                            <FiAlertCircle size={32} />
                        </div>
                        <h3 className="text-xl font-extrabold text-gray-900 mb-2">Error Saving</h3>
                        <p className="text-sm font-medium text-gray-400 leading-relaxed mb-8">
                            {errorMessage}
                        </p>
                        <button
                            onClick={() => setErrorDialogOpen(false)}
                            className="w-full py-3.5 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-2xl transition-all"
                        >
                            Check & Retry
                        </button>
                    </div>
                </div>
            )}
        </section>
    )
}

export default AddAddress

