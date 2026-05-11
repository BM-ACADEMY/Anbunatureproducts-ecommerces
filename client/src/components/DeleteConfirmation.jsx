import React from 'react';
import { HiOutlineTrash, HiX } from 'react-icons/hi';

const DeleteConfirmation = ({ open, close, confirm, title, message }) => {
    if (!open) return null;

    return (
        <section className='fixed inset-0 z-[3000] bg-black/40 flex items-center justify-center p-4'>
            {/* Modal Box */}
            <div className='bg-white w-full max-w-md rounded-lg shadow-xl relative animate-in fade-in zoom-in duration-200'>
                
                {/* Close button at the top right */}
                <button 
                    onClick={close}
                    className='absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors'
                >
                    <HiX size={20} />
                </button>

                <div className='p-8 flex flex-col items-center text-center'>
                    {/* Trash Icon */}
                    <div className='text-gray-400 mb-4'>
                        <HiOutlineTrash size={56} strokeWidth={1.5} />
                    </div>

                    {/* Text Content */}
                    <p className='text-lg font-medium text-gray-600 mb-8 px-4'>
                        {message || "Are you sure you want to delete this product?"}
                    </p>

                    {/* Buttons */}
                    <div className='flex gap-3'>
                        <button
                            onClick={close}
                            className='px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all active:bg-gray-100'
                        >
                            No, cancel
                        </button>
                        <button
                            onClick={confirm}
                            className='px-5 py-2.5 text-sm font-medium text-white bg-[#C81E1E] rounded-lg hover:bg-[#A61A1A] transition-all shadow-sm'
                        >
                            Yes, I'm sure
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DeleteConfirmation;