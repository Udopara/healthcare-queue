import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';

const ClinicDoctors = () => {
  const doctors = [
    {
      id: 'DOC-001',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      email: 'sjohnson@clinic.com',
      phone: '+1 (555) 123-4567',
      status: 'active',
      avatar: 'DSJ'
    },
    {
      id: 'DOC-002', 
      name: 'Dr. Michael Chen',
      specialty: 'Pediatrics',
      email: 'm.chen@clinic.com',
      phone: '+1 (555) 123-4002',
      status: 'active',
      avatar: 'DMC'
    },
    {
      id: 'DOC-003',
      name: 'Dr. Emily Davis',
      specialty: 'Neurology', 
      email: 'e.davis@clinic.com',
      phone: '+1 (555) 123-4003',
      status: 'active',
      avatar: 'ED'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Staff</h1>
          <p className="text-gray-600">Manage your clinic's doctors and specialists</p>
        </div>

        <div className="space-y-6">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold">
                    {doctor.avatar}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-sm text-gray-600">{doctor.specialty}</p>
                  </div>
                </div>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full text-xs font-semibold">
                  ACTIVE
                </span>
              </div>

              <div className="text-gray-700 space-y-1 mb-4">
                <p className="text-sm font-medium">ID: {doctor.id}</p>
                <p className="text-sm">{doctor.email}</p>
                <p className="text-sm">{doctor.phone}</p>
              </div>

              <div className="flex space-x-4">
                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  Edit
                </button>
                <button className="text-rose-600 hover:text-rose-800 text-sm font-medium">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition">
            Add New Doctor
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClinicDoctors;