import React, { useState, useEffect, useMemo } from 'react';
import SimpleTable from '../../components/admin/dashboard/SimpleTable';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { fetchQueues, getQueueTickets } from '../../api/clinicService';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Search, 
  RefreshCw, 
  Eye, 
  ListChecks, 
  Users, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Queues = () => {
  const { user } = useAuth();
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [queueStats, setQueueStats] = useState({});

  useEffect(() => {
    if (user?.clinic_id) {
      loadQueues();
    }
  }, [user?.clinic_id]);

  const loadQueues = async () => {
    if (!user?.clinic_id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const queuesData = await fetchQueues(user.clinic_id);
      setQueues(queuesData);

      // Fetch ticket counts for each queue
      const statsPromises = queuesData.map(async (queue) => {
        try {
          const tickets = await getQueueTickets(queue.queue_id);
          const waiting = tickets.filter(t => t.status === 'waiting').length;
          const serving = tickets.filter(t => t.status === 'serving').length;
          const completed = tickets.filter(t => t.status === 'completed').length;
          const total = tickets.length;
          return { queue_id: queue.queue_id, waiting, serving, completed, total };
        } catch (err) {
          console.warn(`Failed to fetch tickets for queue ${queue.queue_id}:`, err);
          return { queue_id: queue.queue_id, waiting: 0, serving: 0, completed: 0, total: 0 };
        }
      });

      const statsArray = await Promise.all(statsPromises);
      const statsMap = {};
      statsArray.forEach(stat => {
        statsMap[stat.queue_id] = stat;
      });
      setQueueStats(statsMap);
    } catch (error) {
      console.error('Error loading queues:', error);
      toast.error('Failed to load queues');
    } finally {
      setLoading(false);
    }
  };

  const filteredQueues = queues.filter(queue => {
    const matchesSearch = searchTerm === '' || 
                          queue.queue_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          queue.created_by_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || queue.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const overallStats = useMemo(() => {
    const activeQueues = queues.filter(q => q.status === 'open' || q.status === 'paused').length;
    const totalWaiting = Object.values(queueStats).reduce((sum, stat) => sum + stat.waiting, 0);
    const totalServing = Object.values(queueStats).reduce((sum, stat) => sum + stat.serving, 0);
    const totalCompleted = Object.values(queueStats).reduce((sum, stat) => sum + stat.completed, 0);
    return { activeQueues, totalWaiting, totalServing, totalCompleted };
  }, [queues, queueStats]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Open' },
      paused: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, label: 'Paused' },
      closed: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertCircle, label: 'Closed' }
    };
    const config = statusConfig[status] || statusConfig.closed;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const queueColumns = useMemo(
    () => [
      {
        accessorKey: 'queue_name',
        header: 'Queue Name',
        cell: ({ row, getValue }) => (
          <Link
            to={`/clinic/queues/${row.original.queue_id}`}
            className="font-semibold text-indigo-600 hover:text-indigo-800"
          >
            {getValue()}
          </Link>
        ),
      },
      {
        accessorKey: 'created_by_name',
        header: 'Created By',
        cell: ({ getValue, row }) => {
          const role = row.original.created_by_role;
          const name = getValue() || 'Unknown';
          const roleColors = {
            doctor: 'bg-blue-100 text-blue-800',
            clinic: 'bg-purple-100 text-purple-800'
          };
          return (
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{name}</span>
              {role && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${roleColors[role] || 'bg-gray-100 text-gray-800'}`}>
                  {role}
                </span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => getStatusBadge(getValue()),
      },
      {
        accessorKey: 'tickets',
        header: 'Tickets',
        cell: ({ row }) => {
          const stats = queueStats[row.original.queue_id] || { waiting: 0, serving: 0, completed: 0, total: 0 };
          return (
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-gray-600">Total:</span>
                <span className="font-semibold text-gray-900">{stats.total}</span>
              </div>
              {stats.waiting > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-yellow-600">W:</span>
                  <span className="font-semibold text-yellow-700">{stats.waiting}</span>
                </div>
              )}
              {stats.serving > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-blue-600">S:</span>
                  <span className="font-semibold text-blue-700">{stats.serving}</span>
                </div>
              )}
              {stats.completed > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-green-600">C:</span>
                  <span className="font-semibold text-green-700">{stats.completed}</span>
                </div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Link
            to={`/clinic/queues/${row.original.queue_id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            View
          </Link>
        ),
      },
    ],
    [queueStats]
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading queues...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Queue Management</h1>
            <p className="text-sm text-gray-600 mt-1">View and monitor all queues in your clinic</p>
          </div>
          <button
            onClick={loadQueues}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Queues</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{overallStats.activeQueues}</p>
              </div>
              <div className="bg-indigo-100 rounded-lg p-3">
                <ListChecks className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Waiting</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{overallStats.totalWaiting}</p>
              </div>
              <div className="bg-yellow-100 rounded-lg p-3">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Serving</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{overallStats.totalServing}</p>
              </div>
              <div className="bg-blue-100 rounded-lg p-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{overallStats.totalCompleted}</p>
              </div>
              <div className="bg-green-100 rounded-lg p-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by queue name or doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-auto border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="paused">Paused</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Queues Table */}
        {filteredQueues.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Queues Found</h3>
            <p className="text-gray-500">
              {queues.length === 0 
                ? "No queues have been created yet. Doctors can create queues from their panel."
                : "Try adjusting your search or filters."}
            </p>
          </div>
        ) : (
          <SimpleTable data={filteredQueues} columns={queueColumns} title={null} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Queues;
