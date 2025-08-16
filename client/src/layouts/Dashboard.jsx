import React from 'react'
import UserMenu from '../components/UserMenu'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {


  return (
    <section className='bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen'>
      <div className='container mx-auto p-4 lg:p-6 grid lg:grid-cols-[280px,1fr] gap-6'>
        
        {/* Left Sidebar */}
        <div className='hidden lg:block'>
          <div className='bg-white rounded-2xl  p-4 sticky top-6 h-[calc(100vh-48px)] overflow-y-auto transition-all duration-300 shadow-xl'> 
            <UserMenu />
          </div>
        </div>

        {/* Right Content Area */}
        <div className='bg-white rounded-2xl  p-6 transition-all duration-300 shadow-xl'>
          <div className='min-h-[75vh]'>
            <Outlet />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Dashboard
