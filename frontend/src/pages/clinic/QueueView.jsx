import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import SimpleTable from '../../components/admin/dashboard/SimpleTable';
import { getQueueById, getQueueTickets } from '../../api/clinicService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  RefreshCw, 
  Users, 
  Clock,
  CheckCircle,
  AlertCircle,
  Phone
} from 'lucide-react';

export default function QueueView() {
  const { queueId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [queue, setQueue] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (queueId) {
      loadQueueData();
    }
  }, [queueId]);

  const loadQueueData = async () => {
    try {
      setLoading(true);
      const [queueData, ticketsData] = await Promise.all([
        getQueueById(queueId),
        getQueueTickets(queueId)
      ]);

      // Verify this queue belongs to the clinic
      if (queueData.clinic_id !== user?.clinic_id) {
        toast.error('Access denied to this queue');
        navigate('/clinic/queues');
        return;
      }

      setQueue(queueData);
      setTickets(ticketsData || []);
    } catch (error) {
      console.error('Error loading queue data:', error);
      toast.error(error.response?.data?.message || 'Failed to load queue data');
      navigate('/clinic/queues');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      waiting: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Waiting' },
      serving: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Serving' },
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' }
    };
    const config = statusConfig[status] || statusConfig.waiting;
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const ticketColumns = [
    {
      accessorKey: 'id',
      header: 'Ticket Number',
      cell: ({ getValue }) => (
        <span className="font-mono text-sm font-semibold text-indigo-600">
          {getValue()}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => getStatusBadge(getValue()),
    },
    {
      accessorKey: 'notification_contact',
      header: 'Contact',
      cell: ({ getValue }) => (
        <span className="text-gray-600">{getValue() || 'N/A'}</span>
      ),
    },
    {
      accessorKey: 'issued_at',
      header: 'Issued At',
      cell: ({ getValue }) => {
        if (!getValue()) return 'N/A';
        try {
          return new Date(getValue()).toLocaleString();
        } catch (e) {
          return 'Invalid Date';
        }
      },
    },
    {
      accessorKey: 'served_at',
      header: 'Served At',
      cell: ({ getValue }) => {
        if (!getValue()) return '-';
        try {
          return new Date(getValue()).toLocaleString();
        } catch (e) {
          return 'Invalid Date';
        }
      },
    },
  ];

  const stats = {
    total: tickets.length,
    waiting: tickets.filter(t => t.status === 'waiting').length,
    serving: tickets.filter(t => t.status === 'serving').length,
    completed: tickets.filter(t => t.status === 'completed').length,
    cancelled: tickets.filter(t => t.status === 'cancelled').length
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading queue data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!queue) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Queue not found</p>
          <Link
            to="/clinic/queues"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Back to Queues
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/clinic/queues"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{queue.queue_name}</h1>
              <p className="text-sm text-gray-600 mt-1">
                Created by: {queue.created_by_name || 'Unknown'} ({queue.created_by_role || 'Unknown'})
              </p>
            </div>
          </div>
          <button
            onClick={loadQueueData}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Queue Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Queue Status</p>
              <p className={`text-lg font-semibold mt-1 ${
                queue.status === 'open' ? 'text-green-600' :
                queue.status === 'paused' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {queue.status.charAt(0).toUpperCase() + queue.status.slice(1)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Max Capacity</p>
              <p className="text-lg font-semibold mt-1 text-gray-900">
                {queue.max_number === 0 ? 'Unlimited' : queue.max_number}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <Users className="w-6 h-6 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Waiting</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.waiting}</p>
              </div>
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Serving</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.serving}</p>
              </div>
              <Phone className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.cancelled}</p>
              </div>
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">All Tickets</h2>
          {tickets.length > 0 ? (
            <SimpleTable data={tickets} columns={ticketColumns} title={null} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No tickets found in this queue</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

