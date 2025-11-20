import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';

export default function DoctorSettings() {
  const [settings, setSettings] = useState({
    notifications: true,
    email: 'doctor@example.com',
    phone: '123-456-7890'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    console.log('Saved settings', settings);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input type="email" name="email" value={settings.email} onChange={handleChange} className="w-full border rounded px-3 py-2"/>
          </div>
          <div>
            <label className="block font-medium mb-1">Phone</label>
            <input type="text" name="phone" value={settings.phone} onChange={handleChange} className="w-full border rounded px-3 py-2"/>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" name="notifications" checked={settings.notifications} onChange={handleChange} />
            <label>Enable Notifications</label>
          </div>
          <button onClick={handleSave} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Save Settings</button>
        </div>
      </div>
    </DashboardLayout>
  );
}
