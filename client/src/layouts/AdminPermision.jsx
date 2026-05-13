import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import isAdmin from '../utils/isAdmin'

const AdminPermision = ({ children }) => {
    const user = useSelector(state => state.user)

    if (user.loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-sm font-medium text-gray-400 animate-pulse">Verifying permissions...</p>
            </div>
        )
    }

    if (isAdmin(user.role)) {
        return <>{children}</>
    }

    return <Navigate to="/" replace />
}

export default AdminPermision

