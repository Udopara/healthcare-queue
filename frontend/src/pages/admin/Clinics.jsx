import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Modal from '../../components/ui/Modal'
import { 
  Building2, 
  Plus, 
  Edit2, 
  Mail, 
  Phone, 
  Loader2, 
  Search,
  CheckCircle2,
  AlertCircle,
  Trash2
} from 'lucide-react'
import { getAllClinics, updateClinic, deleteClinic } from '../../services/adminService'
import toast from 'react-hot-toast'

export default function AdminClinics() {
  const [clinics, setClinics] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingClinic, setEditingClinic] = useState(null)
  const [deletingClinic, setDeletingClinic] = useState(null)
  const [formData, setFormData] = useState({
    clinic_name: '',
    email: '',
    phone_number: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadClinics()
  }, [])

  const loadClinics = async () => {
    try {
      setLoading(true)
      const data = await getAllClinics()
      setClinics(data)
    } catch (error) {
      toast.error('Failed to load clinics. Please try again.')
      console.error('Error loading clinics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (clinic = null) => {
    if (clinic) {
      setEditingClinic(clinic)
      setFormData({
        clinic_name: clinic.clinic_name || '',
        email: clinic.email || '',
        phone_number: clinic.phone_number || ''
      })
    } else {
      setEditingClinic(null)
      setFormData({
        clinic_name: '',
        email: '',
        phone_number: ''
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingClinic(null)
    setFormData({
      clinic_name: '',
      email: '',
      phone_number: ''
    })
  }

  const handleOpenDeleteModal = (clinic) => {
    setDeletingClinic(clinic)
    setShowDeleteModal(true)
  }

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
    setDeletingClinic(null)
  }

  const handleDelete = async () => {
    if (!deletingClinic) return

    setDeleting(true)
    try {
      await deleteClinic(deletingClinic.id)
      toast.success('Clinic deleted successfully!')
      handleCloseDeleteModal()
      // Reload clinics after a short delay
      setTimeout(() => {
        loadClinics()
      }, 500)
    } catch (error) {
      toast.error(error.message || 'Failed to delete clinic. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    // Validation
    if (!formData.clinic_name.trim()) {
      toast.error('Clinic name is required')
      setSubmitting(false)
      return
    }

    if (!formData.email.trim()) {
      toast.error('Email is required')
      setSubmitting(false)
      return
    }

    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email address')
      setSubmitting(false)
      return
    }

    if (!formData.phone_number.trim()) {
      toast.error('Phone number is required')
      setSubmitting(false)
      return
    }

    try {
      if (editingClinic) {
        // Update existing clinic
        await updateClinic(editingClinic.id, {
          clinic_name: formData.clinic_name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone_number: formData.phone_number.trim()
        })
        toast.success('Clinic updated successfully!')
      } else {
        // TODO: Implement create API call when backend endpoint is available
        toast.success('Clinic created successfully!')
      }
      
      handleCloseModal()
      // Reload clinics after a short delay
      setTimeout(() => {
        loadClinics()
      }, 500)
    } catch (error) {
      toast.error(error.message || 'Failed to save clinic. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredClinics = clinics.filter(clinic =>
    clinic.clinic_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinic.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinic.phone_number?.includes(searchTerm)
  )

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading clinics...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clinic Management</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage all healthcare clinics in the system
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Clinic
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building2 className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clinics</p>
                <p className="text-2xl font-bold text-gray-900">{clinics.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Clinics</p>
                <p className="text-2xl font-bold text-gray-900">{clinics.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Filtered Results</p>
                <p className="text-2xl font-bold text-gray-900">{filteredClinics.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search clinics by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
        </div>

        {/* Clinics Grid */}
        {filteredClinics.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No clinics found' : 'No clinics yet'}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Get started by adding your first clinic'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => handleOpenModal()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New Clinic
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClinics.map((clinic) => (
              <div
                key={clinic.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-indigo-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {clinic.clinic_name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">ID: {clinic.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenModal(clinic)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit clinic"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(clinic)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete clinic"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-gray-600 truncate">{clinic.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-gray-600">{clinic.phone_number}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={editingClinic ? 'Edit Clinic' : 'Add New Clinic'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="clinic_name" className="block text-sm font-medium text-gray-700 mb-2">
                Clinic Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="clinic_name"
                name="clinic_name"
                required
                value={formData.clinic_name}
                onChange={(e) => setFormData({ ...formData, clinic_name: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Enter clinic name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="clinic@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                required
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="+1234567890"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Saving...
                  </>
                ) : (
                  editingClinic ? 'Update Clinic' : 'Create Clinic'
                )}
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={handleCloseDeleteModal}
          title="Delete Clinic"
        >
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Are you sure you want to delete this clinic?
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  This will permanently delete <strong>{deletingClinic?.clinic_name}</strong>.
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Clinic Name:</strong> {deletingClinic?.clinic_name}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                <strong>Email:</strong> {deletingClinic?.email}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleCloseDeleteModal}
                disabled={deleting}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
              >
                {deleting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Clinic
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
