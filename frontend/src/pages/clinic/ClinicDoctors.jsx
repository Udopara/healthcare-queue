import React from 'react';

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
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Medical Staff</h1>
          <p className="text-blue-700 text-lg">Manage your clinic's doctors and specialists</p>
        </div>

        <hr className="border-blue-200 my-6" />

        {/* Doctor List */}
        <div className="space-y-6">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="bg-white border border-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{doctor.avatar}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-900">{doctor.name}</h3>
                    <p className="text-blue-700 font-medium">{doctor.specialty}</p>
                  </div>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  ACTIVE
                </span>
              </div>

              <div className="text-blue-800 space-y-1 mb-4">
                <p className="text-sm">ID: {doctor.id}</p>
                <p className="text-sm">{doctor.email}</p>
                <p className="text-sm">{doctor.phone}</p>
              </div>

              <hr className="border-blue-200 my-4" />

              <div className="flex space-x-4">
                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-800 font-medium text-sm">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Doctor Button */}
        <div className="mt-8">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Add New Doctor
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicDoctors;