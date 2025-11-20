import React, { useState, useEffect, useMemo } from 'react';
import SimpleTable from '../../components/admin/dashboard/SimpleTable';
import KPICard from '../../components/admin/dashboard/KPICard';
import DashboardLayout from '../../layouts/DashboardLayout';
import { ListChecks, CheckCircle2, Users, Clock3 } from 'lucide-react';

const ClinicDashboard = () => {
  const clinicData = {
    id: 'CLIN-789123',
    name: 'City Medical Center',
    email: 'admin@citymedical.com',
    phone: '+1 (555) 123-4567'
  };

  // NEW: State management for interactive queue
  const [queueData, setQueueData] = useState({
    activeQueues: 1,
    ticketsServed: 8,
    patientsWaiting: 2,
    avgWaitTime: 18
  });

  const [currentQueue, setCurrentQueue] = useState([
    { id: 1, name: 'John Smith', ticketNumber: 'A-101', phone: '+1234567890', time: '09:30 AM', status: 'called' },
    { id: 2, name: 'Sarah Johnson', ticketNumber: 'A-102', phone: '+1234567891', time: '09:45 AM', status: 'waiting' },
    { id: 3, name: 'Michael Brown', ticketNumber: 'A-103', phone: '+1234567892', time: '10:00 AM', status: 'waiting' }
  ]);

  // NEW: Interactive functions
  const callNextPatient = () => {
    if (currentQueue.length === 0) return;

    const nextPatient = currentQueue.find(patient => patient.status === 'waiting');
    if (!nextPatient) return;

    setCurrentQueue(prev => 
      prev.map(patient => 
        patient.id === nextPatient.id 
          ? { ...patient, status: 'called' }
          : patient
      )
    );
  };

  const markAsServed = (patientId) => {
    setCurrentQueue(prev => prev.filter(patient => patient.id !== patientId));
    setQueueData(prev => ({
      ...prev,
      ticketsServed: prev.ticketsServed + 1,
      patientsWaiting: Math.max(0, prev.patientsWaiting - 1)
    }));
  };

  const addNewPatient = () => {
    const names = ['Emily Davis', 'Robert Wilson', 'Lisa Anderson', 'David Miller'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const newTicketNumber = `A-${Math.floor(Math.random() * 90) + 10}`;
    const newPhone = `+1${Math.floor(Math.random() * 900000000) + 100000000}`;
    
    const newPatient = {
      id: Date.now(),
      name: randomName,
      ticketNumber: newTicketNumber,
      phone: newPhone,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'waiting'
    };

    setCurrentQueue(prev => [...prev, newPatient]);
    setQueueData(prev => ({
      ...prev,
      patientsWaiting: prev.patientsWaiting + 1
    }));
  };

  // NEW: Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setQueueData(prev => ({
        ...prev,
        avgWaitTime: Math.max(5, prev.avgWaitTime + Math.floor(Math.random() * 3) - 1)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // NEW: Update waiting count when queue changes
  useEffect(() => {
    const waitingCount = currentQueue.filter(patient => patient.status === 'waiting').length;
    setQueueData(prev => ({
      ...prev,
      patientsWaiting: waitingCount
    }));
  }, [currentQueue]);

  const employeeData = [
    { department: 'Emergency', percentage: 50, count: 250 },
    { department: 'Neurology', percentage: 70, count: 350 },
    { department: 'Cardiology', percentage: 65, count: 325 },
    { department: 'Gynecology', percentage: 80, count: 400 },
    { department: 'Urology', percentage: 45, count: 225 }
  ];

  // KPI cards configuration using shared admin KPICard styling
  const kpiCards = [
    {
      title: 'Active Queues',
      value: queueData.activeQueues,
      change: '+1',
      changeType: 'increase',
      icon: ListChecks,
    },
    {
      title: 'Tickets Served',
      value: queueData.ticketsServed,
      change: '+8',
      changeType: 'increase',
      icon: CheckCircle2,
    },
    {
      title: 'Patients Waiting',
      value: queueData.patientsWaiting,
      change: '-3',
      changeType: 'decrease',
      icon: Users,
    },
    {
      title: 'Avg Wait Time',
      value: `${queueData.avgWaitTime}m`,
      change: '-5m',
      changeType: 'decrease',
      icon: Clock3,
    },
  ];

  const queueColumns = useMemo(
    () => [
      {
        accessorKey: 'ticketNumber',
        header: 'Ticket No.',
        cell: ({ getValue }) => (
          <span className="font-semibold text-indigo-600">{getValue()}</span>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Patient Name',
        cell: ({ row, getValue }) => {
          const name = getValue();
          const initials = name
            .split(' ')
            .map((n) => n[0])
            .join('');

          return (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-700">
                {initials}
              </div>
              <span className="font-medium text-gray-900">{row.original.name}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ getValue }) => (
          <span className="text-gray-600">{getValue()}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
          const status = getValue();
          const isCalled = status === 'called';
          return (
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                isCalled
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : 'bg-amber-50 text-amber-700 border border-amber-100'
              }`}
            >
              {isCalled ? 'Called' : 'Waiting'}
            </span>
          );
        },
      },
      {
        accessorKey: 'time',
        header: 'Time',
        cell: ({ getValue }) => (
          <span className="text-gray-600">{getValue()}</span>
        ),
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        sortable: false,
        cell: ({ row }) => {
          const patient = row.original;
          const isCalled = patient.status === 'called';
          return (
            <div className="flex gap-2">
              {isCalled ? (
                <button
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition"
                  onClick={() => markAsServed(patient.id)}
                >
                  Served
                </button>
              ) : (
                <button
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-500 cursor-not-allowed"
                  disabled
                >
                  Call Next
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [markAsServed]
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
      {/* Page header */}
      <div className="bg-white border border-gray-100 rounded-2xl px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Viora Medical Dashboard</h1>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span className="font-mono font-semibold text-indigo-700">{clinicData.id}</span>
            <span className="hidden md:inline text-gray-300">•</span>
            <span>{clinicData.email}</span>
            <span className="hidden md:inline text-gray-300">•</span>
            <span>{clinicData.phone}</span>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
            AZ
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-700">Available for work</span>
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

      {/* Employee distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Employee Distribution</h2>
          <div className="space-y-4">
            {employeeData.map((emp) => (
              <div key={emp.department}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-gray-800">{emp.department}</span>
                  <span className="text-gray-500">
                    {emp.percentage}% • {emp.count} employees
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    style={{ width: `${emp.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Queue summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Today&apos;s Queue Summary</h2>
            <p className="text-sm text-gray-600 mb-4">
              High-level overview of queue performance in your clinic.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Active queues</dt>
              <dd className="text-xl font-semibold text-gray-900">{queueData.activeQueues}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Tickets served</dt>
              <dd className="text-xl font-semibold text-gray-900">{queueData.ticketsServed}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Patients waiting</dt>
              <dd className="text-xl font-semibold text-gray-900">{queueData.patientsWaiting}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Avg wait time</dt>
              <dd className="text-xl font-semibold text-gray-900">{queueData.avgWaitTime}m</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Queue Management Section */}
      <section className="mt-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Queue Management</h2>
            <p className="text-sm text-gray-600">Manage today&apos;s patient queue in real time.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={addNewPatient}
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition shadow-sm"
            >
              + Add Patient
            </button>
            <button
              onClick={callNextPatient}
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-sm"
              disabled={!currentQueue.some((patient) => patient.status === 'waiting')}
            >
              📞 Call Next Patient
            </button>
          </div>
        </div>

        <SimpleTable data={currentQueue} columns={queueColumns} title="Today's Queue" />
      </section>
      </div>
    </DashboardLayout>
  );
};

export default ClinicDashboard;