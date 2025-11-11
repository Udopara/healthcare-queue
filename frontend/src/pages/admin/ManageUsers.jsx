import React, { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Modal from '../../components/ui/Modal'
import {
  Users,
  ShieldCheck,
  Search,
  Mail,
  Phone,
  Filter,
  Calendar,
  RefreshCw,
  UserPlus,
  User,
  Loader2,
  PencilLine,
  ChevronDown
} from 'lucide-react'
import { getAllUsers, updateUser } from '../../services/adminService'
import toast from 'react-hot-toast'

const ROLE_FILTERS = [
  { value: 'all', label: 'All Users' },
  { value: 'admin', label: 'Admins' },
  { value: 'clinic', label: 'Clinics' },
  { value: 'doctor', label: 'Doctors' },
  { value: 'patient', label: 'Patients' }
]

const ROLE_BADGE_STYLES = {
  admin: 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200',
  clinic: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
  doctor: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
  patient: 'bg-sky-100 text-sky-700 ring-1 ring-sky-200',
  default: 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'
}

const ROLE_ICON = {
  admin: ShieldCheck,
  clinic: BuildingIcon,
  doctor: UserPlus,
  patient: Users,
  default: User
}

function BuildingIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 21h18" />
      <path d="M5 21V5a2 2 0 0 1 2-2h6l6 6v12" />
      <path d="M9 21v-6h6v6" />
      <path d="M9 9h.01" />
      <path d="M13 9h.01" />
      <path d="M9 13h.01" />
      <path d="M13 13h.01" />
    </svg>
  )
}

const SORT_OPTIONS = [
  { value: 'recent', label: 'Newest first' },
  { value: 'name', label: 'Name A → Z' },
  { value: 'role', label: 'Role' }
]

const PAGE_SIZE = 8
const ROLE_OPTIONS = ROLE_FILTERS.filter((filter) => filter.value !== 'all')
const PHONE_REGEX = /^\+?[0-9()[\]\s.-]{7,20}$/

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString))
  } catch {
    return dateString
  }
}

const formatRole = (role) => {
  if (!role || role === 'default') {
    return 'Unknown'
  }
  return role.charAt(0).toUpperCase() + role.slice(1)
}

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [refreshing, setRefreshing] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    role: 'patient'
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name || '',
        phone_number: editingUser.phone_number || '',
        role: editingUser.role || 'patient'
      })
    } else {
      setFormData({
        name: '',
        phone_number: '',
        role: 'patient'
      })
    }
  }, [editingUser])

  const loadUsers = async (showToast = false) => {
    try {
      setLoading(true)
      const data = await getAllUsers()
      setUsers(Array.isArray(data) ? data : [])
      if (showToast) {
        toast.success('User directory updated')
      }
    } catch (error) {
      toast.error('Unable to load users. Please try again.')
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadUsers(true)
  }

  const handleOpenEditModal = (user) => {
    setEditingUser(user)
    setShowEditModal(true)
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setEditingUser(null)
  }

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmitEdit = async (event) => {
    event.preventDefault()
    if (!editingUser) return

    const trimmedName = formData.name.trim()
    const trimmedPhone = formData.phone_number.trim()
    const trimmedRole = formData.role.trim()

    if (!trimmedName) {
      toast.error('Name is required')
      return
    }

    if (trimmedName.length < 2) {
      toast.error('Name must be at least 2 characters')
      return
    }

    if (!trimmedPhone) {
      toast.error('Phone number is required')
      return
    }

    if (!PHONE_REGEX.test(trimmedPhone)) {
      toast.error('Please enter a valid phone number')
      return
    }

    if (!trimmedRole) {
      toast.error('Role is required')
      return
    }

    setSaving(true)
    try {
      const response = await updateUser(editingUser.id, {
        name: trimmedName,
        phone_number: trimmedPhone,
        role: trimmedRole
      })

      const updatedUser = response?.user
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUser.id
            ? {
                ...user,
                ...updatedUser,
                name: trimmedName,
                phone_number: trimmedPhone,
                role: trimmedRole
              }
            : user
        )
      )
      toast.success('User updated successfully')
      handleCloseEditModal()
    } catch (error) {
      toast.error(error.message || 'Failed to update user')
    } finally {
      setSaving(false)
    }
  }

  const summary = useMemo(() => {
    const total = users.length

    const counts = users.reduce(
      (acc, user) => {
        const role = user.role || 'unknown'
        acc[role] = (acc[role] || 0) + 1
        return acc
      },
      { admin: 0, clinic: 0, doctor: 0, patient: 0 }
    )

    return {
      total,
      ...counts
    }
  }, [users])

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return users.filter((user) => {
      const roleMatches = roleFilter === 'all' || user.role === roleFilter

      if (!term) {
        return roleMatches
      }

      const haystack = [
        user.name,
        user.email,
        user.phone_number,
        user.role,
        user.linked_entity_id
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return roleMatches && haystack.includes(term)
    })
  }, [users, roleFilter, searchTerm])

  const sortedUsers = useMemo(() => {
    const sorted = [...filteredUsers]
    switch (sortBy) {
      case 'name':
        sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        break
      case 'role':
        sorted.sort((a, b) => (a.role || '').localeCompare(b.role || ''))
        break
      case 'recent':
      default:
        sorted.sort(
          (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
        )
        break
    }
    return sorted
  }, [filteredUsers, sortBy])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, roleFilter, sortBy])

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(sortedUsers.length / PAGE_SIZE))
    if (currentPage > maxPage) {
      setCurrentPage(maxPage)
    }
  }, [sortedUsers, currentPage])

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return sortedUsers.slice(start, start + PAGE_SIZE)
  }, [sortedUsers, currentPage])

  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / PAGE_SIZE))

  const renderRoleBadge = (role = 'default') => {
    const style = ROLE_BADGE_STYLES[role] || ROLE_BADGE_STYLES.default
    const Icon = ROLE_ICON[role] || ROLE_ICON.default
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${style}`}
      >
        <Icon className="h-3.5 w-3.5" />
        {formatRole(role)}
      </span>
    )
  }

  const renderLoadingState = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm animate-pulse"
          >
            <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
            <div className="h-8 w-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="h-10 bg-gray-100 rounded mb-4" />
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="h-16 bg-gray-100 rounded mb-3 last:mb-0"
          />
        ))}
      </div>
    </div>
  )

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1 text-sm font-medium text-indigo-700">
              <ShieldCheck className="h-4 w-4" />
              Secure admin access
            </div>
            <h1 className="mt-3 text-3xl font-bold text-gray-900">
              User Directory
            </h1>
            <p className="mt-2 max-w-xl text-sm text-gray-600">
              Review every stakeholder connected to MediQueue. Filter by role,
              search globally, and get an instant sense of platform activity.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
              />
              Refresh
            </button>
            <span className="hidden lg:inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              <Users className="h-4 w-4" />
              {summary.total} users
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[
            {
              label: 'Total Users',
              value: summary.total,
              icon: Users,
              gradient: 'from-indigo-500 to-indigo-600'
            },
            {
              label: 'Administrators',
              value: summary.admin,
              icon: ShieldCheck,
              gradient: 'from-rose-500 to-rose-600'
            },
            {
              label: 'Clinic Accounts',
              value: summary.clinic,
              icon: ROLE_ICON.clinic,
              gradient: 'from-emerald-500 to-emerald-600'
            },
            {
              label: 'Doctors',
              value: summary.doctor,
              icon: UserPlus,
              gradient: 'from-amber-500 to-amber-600'
            }
          ].map(({ label, value, icon: Icon, gradient }) => (
            <div
              key={label}
              className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${gradient}`}
              />
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-500">
                      {label}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {value ?? 0}
                    </p>
                  </div>
                  <div className="rounded-xl bg-gray-100 p-3 text-gray-600">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search name, email, phone, or role…"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-2 text-sm text-gray-700 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div className="flex items-center gap-2 sm:w-auto">
                <Filter className="hidden h-4 w-4 text-gray-400 sm:inline" />
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {ROLE_FILTERS.map((filter) => {
                const active = roleFilter === filter.value
                return (
                  <button
                    key={filter.value}
                    onClick={() => setRoleFilter(filter.value)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition border cursor-pointer ${
                      active
                        ? 'border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-200 hover:text-indigo-700'
                    }`}
                  >
                    {filter.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {loading ? (
          renderLoadingState()
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="border-b border-gray-100 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Directory
                  </h2>
                  <p className="text-sm text-gray-500">
                    Showing{' '}
                    <span className="font-semibold text-gray-700">
                      {sortedUsers.length}
                    </span>{' '}
                    of <span className="font-semibold">{users.length}</span>{' '}
                    records
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  Updated {formatDate(new Date())}
                </div>
              </div>
            </div>

            <div className="overflow-hidden">
              {sortedUsers.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-400">
                    <Users className="h-8 w-8" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-gray-900">
                    No users match your filters
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Try broadening your search or selecting a different role.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {paginatedUsers.map((user) => (
                    <div
                      key={`${user.id}-${user.email}`}
                      className="px-5 py-4 transition hover:bg-gray-50/70"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-start gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                            <Users className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-base font-semibold text-gray-900">
                                {user.name || 'Unnamed User'}
                              </h3>
                              {renderRoleBadge(user.role)}
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-600">
                              <span className="inline-flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5 text-gray-400" />
                                {user.email || '—'}
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <Phone className="h-3.5 w-3.5 text-gray-400" />
                                {user.phone_number || '—'}
                              </span>
                              {user.linked_entity_id && (
                                <span className="inline-flex items-center gap-1.5">
                                  <UserPlus className="h-3.5 w-3.5 text-gray-400" />
                                  Linked ID: {user.linked_entity_id}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-2 text-xs text-gray-500">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(user)}
                            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 cursor-pointer"
                          >
                            <PencilLine className="h-3.5 w-3.5" />
                            Edit user
                          </button>
                          <span>
                            Added{' '}
                            <span className="font-medium text-gray-700 text-sm">
                              {formatDate(user.created_at)}
                            </span>
                          </span>
                          <span className="rounded-full bg-gray-50 px-2.5 py-1 text-[11px] uppercase tracking-wide text-gray-500">
                            #{user.id?.toString().padStart(3, '0') ?? '—'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {totalPages > 1 && (
              <div className="flex flex-col gap-3 border-t border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-gray-500">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-indigo-200 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                  >
                    Previous
                  </button>
                  <div className="hidden sm:flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, index) => {
                      const page = index + 1
                      const isActive = page === currentPage
                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`h-8 w-8 rounded-full text-xs font-semibold transition cursor-pointer ${
                            isActive
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-indigo-200 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Modal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        title={editingUser ? `Edit ${editingUser.name || 'user'}` : 'Edit user'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmitEdit} className="space-y-5">
          <div className="grid gap-4">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Full name
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Enter user name"
                  className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm text-gray-700 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Email (read only)
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={editingUser?.email || ''}
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 pl-9 pr-3 py-2 text-sm text-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Phone number
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleFormChange}
                  placeholder="+250123456789"
                  className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm text-gray-700 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Role
              </label>
              <div className="relative">
                <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white pl-9 pr-8 py-2 text-sm text-gray-700 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCloseEditModal}
              disabled={saving}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg border border-transparent bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving
                </>
              ) : (
                'Save changes'
              )}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}


