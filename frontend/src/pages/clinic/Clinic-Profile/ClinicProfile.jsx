import React, { useState } from 'react';

const ClinicProfile = ({ clinicData, setClinicData }) => {
  const [isEditing, setIsEditing] = useState(false);
  // The formData now includes address, hours, and services automatically
  const [formData, setFormData] = useState({
    ...clinicData,
    address: clinicData.address || '123 Medical Center Drive, City, State 12345',
    hours: clinicData.hours || 'Mon-Fri 9:00 AM - 5:00 PM',
    services: clinicData.services || 'General Medicine, Pediatrics, Cardiology'
  });

  const handleSave = () => {
    setClinicData(formData);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white rounded-lg border border-blue-200 p-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
        <h2 className="text-2xl font-bold text-blue-900 mb-4 sm:mb-0 flex items-center space-x-3">
          <span className="text-3xl">🏥</span>
          <span>Clinic Profile</span>
        </h2>

        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className={`px-6 py-3 rounded-lg text-base font-semibold transition-all duration-200 border ${
            isEditing
              ? 'bg-green-600 hover:bg-green-700 text-white border-green-700'
              : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-700'
          }`}
        >
          {isEditing ? '💾 Save Changes' : '✏️ Edit Profile'}
        </button>
      </div>

      {/* Form Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Clinic Name */}
        <div>
          <label className="block text-blue-800 font-semibold mb-2 text-lg">
            Clinic Name
          </label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-blue-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="Enter clinic name"
            />
          ) : (
            <div className="p-3 bg-blue-50 rounded-lg text-blue-900 font-medium border border-blue-200">
              {clinicData.name}
            </div>
          )}
        </div>

        {/* Clinic ID */}
        <div>
          <label className="block text-blue-800 font-semibold mb-2 text-lg">
            Clinic ID
          </label>
          <div className="p-3 bg-blue-100 rounded-lg font-mono text-blue-900 border border-blue-300">
            {clinicData.id}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-blue-800 font-semibold mb-2 text-lg">
            Email Address
          </label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-blue-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="Enter email address"
            />
          ) : (
            <div className="p-3 bg-blue-50 rounded-lg text-blue-900 font-medium border border-blue-200">
              {clinicData.email}
            </div>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-blue-800 font-semibold mb-2 text-lg">
            Phone Number
          </label>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border border-blue-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="Enter phone number"
            />
          ) : (
            <div className="p-3 bg-blue-50 rounded-lg text-blue-900 font-medium border border-blue-200">
              {clinicData.phone}
            </div>
          )}
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-blue-800 font-semibold mb-2 text-lg">
            Address
          </label>
          {isEditing ? (
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 border border-blue-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="Enter clinic address"
            />
          ) : (
            <div className="p-3 bg-blue-50 rounded-lg text-blue-900 font-medium border border-blue-200">
              {formData.address}
            </div>
          )}
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="mt-8 pt-6 border-t border-blue-200">
        <h3 className="text-xl font-semibold text-blue-900 mb-4">Additional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hours of Operation */}
          <div>
            <label className="block text-blue-800 font-semibold mb-2">
              Hours of Operation
            </label>
            {isEditing ? (
              <input
                type="text"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                className="w-full p-3 border border-blue-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="e.g., Mon-Fri 9AM-5PM"
              />
            ) : (
              <div className="p-3 bg-blue-50 rounded-lg text-blue-900 border border-blue-200">
                {formData.hours}
              </div>
            )}
          </div>

          {/* Services Offered */}
          <div>
            <label className="block text-blue-800 font-semibold mb-2">
              Services Offered
            </label>
            {isEditing ? (
              <input
                type="text"
                name="services"
                value={formData.services}
                onChange={handleChange}
                className="w-full p-3 border border-blue-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="e.g., General Medicine, Pediatrics"
              />
            ) : (
              <div className="p-3 bg-blue-50 rounded-lg text-blue-900 border border-blue-200">
                {formData.services}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicProfile;