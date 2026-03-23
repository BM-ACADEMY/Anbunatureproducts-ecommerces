import React from 'react'
import { useSelector } from 'react-redux'
import isAdmin from '../utils/isAdmin'
import { FiLock, FiAlertCircle } from "react-icons/fi"

const AdminPermision = ({children}) => {
    const user = useSelector(state => state.user)

    if (isAdmin(user.role)) {
        return <>{children}</>
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 -mt-8">
            <div className="bg-white border border-gray-100 p-10 rounded-3xl shadow-2xl shadow-indigo-50/50 max-w-sm w-full text-center animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mx-auto mb-6">
                    <FiLock size={40} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Access Denied</h2>
                <p className="text-sm font-medium text-gray-400 leading-relaxed mb-8 px-4">
                    You don't have the required administrative permissions to view this section.
                </p>
                <div className="flex items-center justify-center gap-2 text-rose-500 bg-rose-50 py-2.5 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest mx-6">
                    <FiAlertCircle size={14} />
                    <span>Administrator only Access</span>
                </div>
            </div>
        </div>
    )
}

export default AdminPermision

