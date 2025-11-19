import React, {useState, useEffect} from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BrowseDoctors() {

  const [doctors, setDoctors] = useState([])
  const [searchDepartment, setSearchDepartment] = useState("")

  useEffect(() => {
    fetch("http://localhost:3000/api/doctors")
      .then((res) => res.json())
      .then((data) => setDoctors(data))
      .catch((err) => console.error("Failed to fetch doctors:", err));
  }, []);

  const deptSearch = doctors.filter((dept) => dept.department.toLowerCase().includes(searchDepartment.toLowerCase()));

  return (
    <DashboardLayout>

      <div className='space-y-20'>

        <div className='relative'>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
          type="text"
          placeholder='Search Department....'
          value={searchDepartment}
          onChange={(event) => setSearchDepartment(event.target.value)}
          className='border rounded-4xl border-indigo-600 w-96 h-8 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 focus:border-0 placeholder-slate-400' />
        </div>

        <div className='space-y-10'>
          <h1 className='text-2xl font-bold text-indigo-600'>Doctors:</h1>

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 space-y-6'>
            {deptSearch.length > 0 ? (
              deptSearch.map((doc, id) => {
                let availabilityColor = "";
                if (doc.availability === "Available") availabilityColor = "text-green-600";
                else if (doc.availability === "Busy") availabilityColor = "text-amber-600";
                else if (doc.availability === "Offline") availabilityColor = "text-red-600";
                
                return (
                <div key={doc.doctor_id} className='sm:w-36 md:w-64 lg:w-56 flex flex-col justify-between  h-72 border border-gray-300 border-l border-l-indigo-600 rounded-2xl p-5 shadow-xl hover:cursor-pointer'>
                  <div>
                    <img src={doc.img_src} alt="" className='w-25 h-25 mb-4 rounded-full border border-indigo-600 object-cover'/>
                    <p className='font-semibold'>{doc.full_name}</p>
                    <p className='text-indigo-600 font-semibold'>{doc.department}</p>
                    <p className='font-normal'>Id: {doc.doctor_id}</p>
                    <p>Status: <span className={`font-semibold ${availabilityColor}`}>{doc.availability}</span></p>
                  </div>
                  <Link to="/patient/join" className='bg-indigo-600 text-white w-24 pl-2.5 h-6 rounded-2xl hover:cursor-pointer'>Book now</Link>
                  
                </div>
                );
              })
            ) : (<p className='text-2xl font-light'>No Doctors found</p>)}
          </div>
          
        </div>
        
      </div>

    </DashboardLayout>
  )
}

