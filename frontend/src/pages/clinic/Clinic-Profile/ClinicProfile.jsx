import React, { useState } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';

const DEFAULT_CLINIC_DATA = {
  name: 'City Medical Center',
  id: 'CLIN-789123',
  email: 'admin@citymedical.com',
  phone: '+1 (555) 123-4567',
  address: '123 Medical Center Drive, City, State 12345',
  hours: 'Mon-Fri 9:00 AM - 5:00 PM',
  services: 'General Medicine, Pediatrics, Cardiology'
};

const ClinicProfile = ({ clinicData: initialClinicData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialClinicData || DEFAULT_CLINIC_DATA);

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <span className="text-3xl">🏥</span> Clinic Profile
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                ID: <span className="font-mono font-semibold text-indigo-700">{formData.id}</span>
              </p>
            </div>
            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition ${
                isEditing
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Clinic Name */}
        <div>
          <label className="block text-gray-800 font-semibold mb-2 text-lg">
            Clinic Name
          </label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              placeholder="Enter clinic name"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium border border-gray-200">
              {formData.name}
            </div>
          )}
        </div>

        {/* Clinic ID */}
        <div>
          <label className="block text-gray-800 font-semibold mb-2 text-lg">
            Clinic ID
          </label>
          <div className="p-3 bg-gray-100 rounded-lg font-mono text-gray-900 border border-gray-200">
            {formData.id}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-800 font-semibold mb-2 text-lg">
            Email Address
          </label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              placeholder="Enter email address"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium border border-gray-200">
              {formData.email}
            </div>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-800 font-semibold mb-2 text-lg">
            Phone Number
          </label>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              placeholder="Enter phone number"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium border border-gray-200">
              {formData.phone}
            </div>
          )}
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-gray-800 font-semibold mb-2 text-lg">
            Address
          </label>
          {isEditing ? (
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              placeholder="Enter clinic address"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium border border-gray-200">
              {formData.address}
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Additional Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hours of Operation */}
          <div>
            <label className="block text-gray-800 font-semibold mb-2">
              Hours of Operation
            </label>
            {isEditing ? (
              <input
                type="text"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="e.g., Mon-Fri 9AM-5PM"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg text-gray-900 border border-gray-200">
                {formData.hours}
              </div>
            )}
          </div>

          {/* Services Offered */}
          <div>
            <label className="block text-gray-800 font-semibold mb-2">
              Services Offered
            </label>
            {isEditing ? (
              <input
                type="text"
                name="services"
                value={formData.services}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="e.g., General Medicine, Pediatrics"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg text-gray-900 border border-gray-200">
                {formData.services}
              </div>
            )}
          </div>
          </div>
      </div>
    </DashboardLayout>
  );
};

export default ClinicProfile;