import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { getDoctorsByClinic, createDoctor } from '../../api/clinicService';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import { 
  PlusCircle, 
  RefreshCw, 
  Mail, 
  Phone, 
  User,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const ClinicDoctors = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: ''
  });

  useEffect(() => {
    if (user?.clinic_id) {
      loadDoctors();
    }
  }, [user?.clinic_id]);

  const loadDoctors = async () => {
    if (!user?.clinic_id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const doctorsData = await getDoctorsByClinic(user.clinic_id);
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Error loading doctors:', error);
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Name, email, and password are required');
      return;
    }

    if (!user?.clinic_id) {
      toast.error('Clinic ID not found');
      return;
    }

    setCreating(true);
    try {
      await createDoctor(
        formData.name,
        formData.email,
        formData.phone_number || '',
        formData.password,
        user.clinic_id
      );
      toast.success('Doctor created successfully!');
      setShowAddModal(false);
      setFormData({ name: '', email: '', phone_number: '', password: '' });
      await loadDoctors();
    } catch (error) {
      console.error('Error creating doctor:', error);
      toast.error(error.response?.data?.message || 'Failed to create doctor');
    } finally {
      setCreating(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading doctors...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Staff</h1>
            <p className="text-gray-600">Manage your clinic's doctors and specialists</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadDoctors}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add New Doctor
            </button>
          </div>
        </div>

        {doctors.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Doctors Found</h3>
            <p className="text-gray-500 mb-6">
              You haven't added any doctors yet. Add your first doctor to get started.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add First Doctor
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div key={doctor.doctor_id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold">
                      {getInitials(doctor.full_name)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{doctor.full_name}</h3>
                      <p className="text-sm text-gray-600">Doctor ID: {doctor.doctor_id}</p>
                    </div>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full text-xs font-semibold">
                    ACTIVE
                  </span>
                </div>

                <div className="text-gray-700 space-y-2 mb-4">
                  {doctor.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{doctor.email}</span>
                    </div>
                  )}
                  {doctor.phone_number && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{doctor.phone_number}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>Joined: {new Date(doctor.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Doctor Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setFormData({ name: '', email: '', phone_number: '', password: '' });
          }}
          title="Add New Doctor"
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. John Smith"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="doctor@clinic.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                id="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                placeholder="+250788123456"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimum 6 characters"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
                minLength={6}
              />
              <p className="mt-1 text-xs text-gray-500">The doctor will use this password to log in</p>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({ name: '', email: '', phone_number: '', password: '' });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={creating}
              >
                Cancel
              </button>
              <button
                onClick={handleAddDoctor}
                disabled={creating || !formData.name || !formData.email || !formData.password}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {creating ? 'Creating...' : 'Create Doctor'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default ClinicDoctors;
