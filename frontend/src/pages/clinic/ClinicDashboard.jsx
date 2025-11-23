import React, { useState, useEffect, useMemo } from 'react';
import SimpleTable from '../../components/admin/dashboard/SimpleTable';
import KPICard from '../../components/admin/dashboard/KPICard';
import DashboardLayout from '../../layouts/DashboardLayout';
import { ListChecks, CheckCircle2, Users, Clock3, Stethoscope, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchQueues, getDoctorsByClinic, getQueueTickets } from '../../api/clinicService';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ClinicDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [queues, setQueues] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [allTickets, setAllTickets] = useState([]);
  const [stats, setStats] = useState({
    activeQueues: 0,
    totalDoctors: 0,
    ticketsServed: 0,
    patientsWaiting: 0,
    avgWaitTime: 0
  });

  useEffect(() => {
    if (user?.clinic_id) {
      loadData();
    }
  }, [user?.clinic_id]);

  const loadData = async () => {
    if (!user?.clinic_id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [queuesData, doctorsData] = await Promise.all([
        fetchQueues(user.clinic_id),
        getDoctorsByClinic(user.clinic_id)
      ]);

      setQueues(queuesData);
      setDoctors(doctorsData);

      // Fetch all tickets for all queues
      const ticketsPromises = queuesData.map(queue =>
        getQueueTickets(queue.queue_id).catch(err => {
          console.warn(`Failed to fetch tickets for queue ${queue.queue_id}:`, err);
          return [];
        })
      );
      const ticketsArrays = await Promise.all(ticketsPromises);
      const allTicketsData = ticketsArrays.flat();
      setAllTickets(allTicketsData);

      // Calculate statistics
      const activeQueues = queuesData.filter(q => q.status === 'open' || q.status === 'paused').length;
      const ticketsServed = allTicketsData.filter(t => t.status === 'completed').length;
      const patientsWaiting = allTicketsData.filter(t => t.status === 'waiting' || t.status === 'serving').length;

      // Calculate average wait time (for completed tickets)
      const completedTickets = allTicketsData.filter(t => t.status === 'completed' && t.issued_at && t.served_at);
      let avgWaitTime = 0;
      if (completedTickets.length > 0) {
        const totalWaitTime = completedTickets.reduce((sum, ticket) => {
          try {
            const issued = new Date(ticket.issued_at);
            const served = new Date(ticket.served_at);
            if (!isNaN(issued.getTime()) && !isNaN(served.getTime())) {
              return sum + (served - issued);
            }
          } catch (e) {
            return sum;
          }
          return sum;
        }, 0);
        avgWaitTime = Math.round(totalWaitTime / completedTickets.length / 60000); // Convert to minutes
      }

      setStats({
        activeQueues,
        totalDoctors: doctorsData.length,
        ticketsServed,
        patientsWaiting,
        avgWaitTime
      });
    } catch (error) {
      console.error('Error loading clinic dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Doctor distribution by queue activity
  const doctorDistribution = useMemo(() => {
    const doctorQueueCounts = {};
    queues.forEach(queue => {
      if (queue.doctor_id) {
        doctorQueueCounts[queue.doctor_id] = (doctorQueueCounts[queue.doctor_id] || 0) + 1;
      }
    });

    return doctors.map(doctor => {
      const queueCount = doctorQueueCounts[doctor.doctor_id] || 0;
      const totalQueues = queues.length;
      const percentage = totalQueues > 0 ? Math.round((queueCount / totalQueues) * 100) : 0;
      return {
        name: doctor.full_name,
        percentage,
        count: queueCount
      };
    }).slice(0, 5); // Top 5 doctors
  }, [doctors, queues]);

  // KPI cards configuration using shared admin KPICard styling
  const kpiCards = [
    {
      title: 'Total Doctors',
      value: stats.totalDoctors,
      change: undefined,
      changeType: undefined,
      icon: Stethoscope,
    },
    {
      title: 'Active Queues',
      value: stats.activeQueues,
      change: undefined,
      changeType: undefined,
      icon: ListChecks,
    },
    {
      title: 'Tickets Served',
      value: stats.ticketsServed,
      change: undefined,
      changeType: undefined,
      icon: CheckCircle2,
    },
    {
      title: 'Patients Waiting',
      value: stats.patientsWaiting,
      change: undefined,
      changeType: undefined,
      icon: Users,
    },
  ];

  // Recent queues table columns
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
        cell: ({ getValue }) => {
          const status = getValue();
          const statusConfig = {
            open: { bg: 'bg-green-100', text: 'text-green-800', label: 'Open' },
            paused: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Paused' },
            closed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Closed' }
          };
          const config = statusConfig[status] || statusConfig.closed;
          return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
              {config.label}
            </span>
          );
        },
      },
      {
        accessorKey: 'ticket_count',
        header: 'Tickets',
        cell: ({ row }) => {
          const queueId = row.original.queue_id;
          const queueTickets = allTickets.filter(t => t.queue_id === queueId);
          const waiting = queueTickets.filter(t => t.status === 'waiting').length;
          const serving = queueTickets.filter(t => t.status === 'serving').length;
          const completed = queueTickets.filter(t => t.status === 'completed').length;
          return (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Total: {queueTickets.length}</span>
              {waiting > 0 && <span className="text-yellow-600">W: {waiting}</span>}
              {serving > 0 && <span className="text-blue-600">S: {serving}</span>}
              {completed > 0 && <span className="text-green-600">C: {completed}</span>}
            </div>
          );
        },
      },
    ],
    [allTickets]
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-72">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const clinicInitials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'CL';

  return (
    <DashboardLayout>
      <div className="space-y-8">
      {/* Page header */}
      <div className="bg-white border border-gray-100 rounded-2xl px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Clinic Dashboard</h1>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span className="font-mono font-semibold text-indigo-700">Clinic ID: {user?.clinic_id || 'N/A'}</span>
            <span className="hidden md:inline text-gray-300">•</span>
            <span>{user?.email || 'N/A'}</span>
            {user?.phone_number && (
              <>
                <span className="hidden md:inline text-gray-300">•</span>
                <span>{user.phone_number}</span>
              </>
            )}
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
            {clinicInitials}
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-700">Active</span>
          </div>
        </div>
      </div>

      {/* KPI Cards (admin style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card) => (
          <KPICard
            key={card.title}
            title={card.title}
            value={card.value}
            change={card.change}
            changeType={card.changeType}
            icon={card.icon}
          />
        ))}
      </div>

      {/* Doctor Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Doctor Queue Activity</h2>
          {doctorDistribution.length > 0 ? (
            <div className="space-y-4">
              {doctorDistribution.map((doctor, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-gray-800">{doctor.name}</span>
                    <span className="text-gray-500">
                      {doctor.percentage}% • {doctor.count} queue{doctor.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      style={{ width: `${doctor.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No doctor activity data available</p>
          )}
        </div>

        {/* Queue Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Queue Summary</h2>
            <p className="text-sm text-gray-600 mb-4">
              Overview of all queues in your clinic.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Active queues</dt>
              <dd className="text-xl font-semibold text-gray-900">{stats.activeQueues}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Total queues</dt>
              <dd className="text-xl font-semibold text-gray-900">{queues.length}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Tickets served</dt>
              <dd className="text-xl font-semibold text-gray-900">{stats.ticketsServed}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Patients waiting</dt>
              <dd className="text-xl font-semibold text-gray-900">{stats.patientsWaiting}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Recent Queues Section */}
      <section className="mt-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Recent Queues</h2>
            <p className="text-sm text-gray-600">View and monitor queues created by your doctors.</p>
          </div>
          <Link
            to="/clinic/queues"
            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm"
          >
            View All Queues
          </Link>
        </div>

        {queues.length > 0 ? (
          <SimpleTable 
            data={queues.slice(0, 5)} 
            columns={queueColumns} 
            title={null} 
          />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <p className="text-gray-500 mb-4">No queues found. Doctors can create queues from their panel.</p>
            <Link
              to="/clinic/doctors"
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              View Doctors
            </Link>
          </div>
        )}
      </section>
      </div>
    </DashboardLayout>
  );
};

export default ClinicDashboard;