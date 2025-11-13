import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import KPICard from '../../components/admin/dashboard/KPICard';
import StatCard from '../../components/admin/dashboard/StatCard';
import ProfessionalLineChart from '../../components/admin/dashboard/ProfessionalLineChart';
import ChartBarChart from '../../components/admin/dashboard/ChartBarChart';
import SimpleDonutChart from '../../components/admin/dashboard/SimpleDonutChart';
import SimpleTable from '../../components/admin/dashboard/SimpleTable';
import { 
  Users, 
  ListChecks, 
  Activity, 
  Stethoscope, 
  Calendar 
} from 'lucide-react';


const PRIMARY_COLOR = "#6366f1"; // Indigo
const SECONDARY_COLOR = "#10b981"; // Emerald
const ACCENT_COLOR = "#8b5cf6"; // Purple

export default function DoctorDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [patientGrowthData, setPatientGrowthData] = useState([]);
  const [appointmentDistributionData, setAppointmentDistributionData] = useState([]);
  const [queueActivityData, setQueueActivityData] = useState([]);
  const [doctorPerformance, setDoctorPerformance] = useState([]);

  useEffect(() => {
    const loadDummyData = () => {
      setStats({
        totalPatients: 12,
        activeQueues: 3,
        totalAppointments: 8,
        dailyOperations: 18
      });
      setPatientGrowthData(generatePatientGrowthTimeSeries(30));
      setAppointmentDistributionData(generateAppointmentDistributionData());
      setQueueActivityData(generateQueueActivityTimeSeries(30));
      setDoctorPerformance(generateDoctorPerformanceData());
      setLoading(false);
    };

    setTimeout(loadDummyData, 500);
  }, []);

  const appointmentColumns = useMemo(() => [
    {
      accessorKey: 'patient_name',
      header: 'Patient Name',
      cell: ({ getValue }) => <span className="font-medium text-gray-900">{getValue()}</span>
    },
    {
      accessorKey: 'appointment_time',
      header: 'Time',
      cell: ({ getValue }) => <span className="text-gray-600">{getValue()}</span>
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        let color = getValue() === 'Active' ? PRIMARY_COLOR : SECONDARY_COLOR;
        return <span className="font-medium" style={{ color }}>{getValue()}</span>;
      }
    },
    {
      accessorKey: 'notes',
      header: 'Notes',
      cell: ({ getValue }) => <span className="text-gray-600">{getValue()}</span>
    }
  ], []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: PRIMARY_COLOR }}></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="relative rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 p-8 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }}></div>
          </div>
          <div className="relative">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
              Doctor Dashboard
            </h1>
            <p className="text-indigo-100 text-base font-medium">
              Overview of your patients, queues, and appointments
            </p>
          </div>
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full opacity-20 blur-3xl"></div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard title="Total Patients" value={stats.totalPatients} change="+5%" changeType="increase" icon={Users} />
          <KPICard title="Active Queues" value={stats.activeQueues} change="+2%" changeType="increase" icon={ListChecks} />
          <KPICard title="Total Appointments" value={stats.totalAppointments} change="+10%" changeType="increase" icon={Calendar} />
          <KPICard title="Daily Operations" value={stats.dailyOperations} change="+8%" changeType="increase" icon={Activity} />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Queues Today" value={stats.activeQueues} subtitle="Current active queues" icon={ListChecks} />
          <StatCard title="Appointments Today" value={stats.totalAppointments} subtitle="Scheduled appointments" icon={Calendar} />
          <StatCard title="Daily Operations" value={stats.dailyOperations} subtitle="Patients handled today" icon={Activity} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProfessionalLineChart data={patientGrowthData} title="Patient Consultations Over Time" dataKey="patients" color={PRIMARY_COLOR} />
          <SimpleDonutChart data={appointmentDistributionData} title="Appointments by Type" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <ChartBarChart data={doctorPerformance} title="Doctor Performance Overview" dataKey="appointments" nameKey="doctor_name" color={PRIMARY_COLOR} />
        </div>

        {/* Appointments Table */}
        <SimpleTable data={doctorPerformance} columns={appointmentColumns} title="Your Appointments & Queues" />
      </div>
    </DashboardLayout>
  );
}
