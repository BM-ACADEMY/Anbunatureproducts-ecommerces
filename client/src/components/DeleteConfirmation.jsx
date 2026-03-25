import React from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const DeleteConfirmation = ({ open, close, confirm, title, message }) => {
    if (!open) return null;

    return (
        <section className='fixed inset-0 z-[3000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4'>
            <div className='bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300'>
                <div className='relative p-8 flex flex-col items-center text-center'>
                    <button 
                        onClick={close}
                        className='absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all'
                    >
                        <FiX size={20} />
                    </button>

                    <div className='w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6'>
                        <FiAlertTriangle size={32} />
                    </div>

                    <h3 className='text-xl font-bold text-slate-800 mb-2'>{title || "Are you sure?"}</h3>
                    <p className='text-sm text-slate-500 leading-relaxed mb-8'>
                        {message || "This action cannot be undone. This will permanently remove the item from your account."}
                    </p>

                    <div className='flex gap-4 w-full'>
                        <button
                            onClick={close}
                            className='flex-1 px-6 py-3.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all active:scale-95'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirm}
                            className='flex-1 px-6 py-3.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200 rounded-2xl transition-all active:scale-95'
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DeleteConfirmation;
