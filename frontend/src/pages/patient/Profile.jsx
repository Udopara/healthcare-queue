import React from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import {useAuth} from '../../context/AuthContext'

export default function PatientProfile() {

  const { user } = useAuth()
  return (
    <DashboardLayout>
      
      <div className='space-y-10'>
        <div>
          <h1>Profile</h1>
        </div>
        
        <div className='flex flex-col justify-between space-y-5 border border-gray-300 border-l border-l-indigo-600 rounded-3xl md:w-5/6 lg:w-3/4  p-5 shadow-xl'>
          <div className='grid grid-rows-1 grid-cols-2'>
            <img src="https://t3.ftcdn.net/jpg/02/79/78/48/360_F_279784836_4eKMjfIfDtaICKmaSBAyft2Y43u5V76Q.jpg" alt="" className='ring-1 ring-indigo-600 w-35 h-35 mb-4 rounded-full object-cover' />
            <div className='space-y-2'>
              <p className=' text-2xl'>{user?.fullName}</p>
              <p className='text-slate-500'>big.dev@gmail.com</p>
              <p className='text-slate-500'>{user?.phoneNumber}</p>
              <p className='text-slate-500'>Role: {user?.role}</p>
            </div>
          </div>
          <button className='text-white bg-indigo-600 w-30 h-9 rounded-3xl hover:cursor-pointer ring hover:ring-indigo-600 hover:text-indigo-600 hover:bg-white'>Edit Profile</button>
        </div>

        <div className='space-y-4'>
          <h1>Account Settings</h1>
          <div className='rounded-3xl border border-gray-300 border-l border-l-indigo-600 w-full h-80 p-5 shadow-xl'>
          </div>
        </div>
      </div>

    </DashboardLayout>
  )
}

