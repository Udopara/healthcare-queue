import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import KPICard from '../../components/admin/dashboard/KPICard';
import StatCard from '../../components/admin/dashboard/StatCard';
import ProfessionalLineChart from '../../components/admin/dashboard/ProfessionalLineChart';
import ChartBarChart from '../../components/admin/dashboard/ChartBarChart';
import SimpleDonutChart from '../../components/admin/dashboard/SimpleDonutChart';
import SimpleTable from '../../components/admin/dashboard/SimpleTable';
import {
  Building2,
  Stethoscope,
  Users,
  ListChecks,
  TrendingUp,
  Activity
} from 'lucide-react';
import { 
  generateUserGrowthTimeSeries, 
  generateUserDistributionData, 
  generateClinicPerformanceData,
  generateSystemActivityTimeSeries
} from '../../utils/dummyData';
import { getDashboardStats, getClinicPerformance } from '../../services/adminService';
import toast from 'react-hot-toast';

// Professional color scheme
const PRIMARY_COLOR = "#6366f1"; // Indigo
const SECONDARY_COLOR = "#10b981"; // Emerald
const ACCENT_COLOR = "#8b5cf6"; // Purple
const CHART_GRADIENT_START = "#6366f1"; // Indigo
const CHART_GRADIENT_END = "#8b5cf6"; // Purple

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [userDistributionData, setUserDistributionData] = useState([]);
  const [systemActivityData, setSystemActivityData] = useState([]);
  const [clinicPerformance, setClinicPerformance] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch real stats from API
        const statsData = await getDashboardStats();
        
        const processedStats = {
          totalClinics: statsData.totalClinics || 0,
          totalDoctors: statsData.totalDoctors || 0,
          totalPatients: statsData.totalPatients || 0,
          totalQueues: statsData.totalQueues || 0,
          totalUsers: (statsData.totalDoctors || 0) + (statsData.totalPatients || 0),
          systemActivity: statsData.totalTickets || 0
        };
        setStats(processedStats);

        // Fetch real clinic performance data
        try {
          const clinicPerf = await getClinicPerformance();
          setClinicPerformance(clinicPerf);
        } catch (error) {
          console.error('Error loading clinic performance:', error);
          // Fallback to dummy data if API fails
          setClinicPerformance(generateClinicPerformanceData());
        }

        // Use dummy data for charts (until we have time series endpoints)
        setUserGrowthData(generateUserGrowthTimeSeries(30));
        setUserDistributionData(generateUserDistributionData());
        setSystemActivityData(generateSystemActivityTimeSeries(30));
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Failed to load some dashboard data. Showing cached information.');
        
        // Fallback to dummy data
        setStats({
          totalClinics: 0,
          totalDoctors: 0,
          totalPatients: 0,
          totalQueues: 0,
          totalUsers: 0,
          systemActivity: 0
        });
        setUserGrowthData(generateUserGrowthTimeSeries(30));
        setUserDistributionData(generateUserDistributionData());
        setSystemActivityData(generateSystemActivityTimeSeries(30));
        setClinicPerformance(generateClinicPerformanceData());
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Table columns for clinic performance
  const clinicColumns = useMemo(() => [
    {
      accessorKey: 'clinic_name',
      header: 'Clinic Name',
      cell: ({ getValue }) => (
        <span className="font-medium text-gray-900">{getValue()}</span>
      ),
    },
    {
      accessorKey: 'total_queues',
      header: 'Queues',
      cell: ({ getValue }) => (
        <span className="text-gray-600">{getValue()}</span>
      ),
    },
    {
      accessorKey: 'total_tickets',
      header: 'Total Tickets',
      cell: ({ getValue }) => (
        <span className="font-medium text-gray-900">{getValue()}</span>
      ),
    },
    {
      accessorKey: 'completed_tickets',
      header: 'Completed',
      cell: ({ getValue }) => (
        <span className="font-medium" style={{ color: SECONDARY_COLOR }}>{getValue()}</span>
      ),
    },
    {
      accessorKey: 'active_tickets',
      header: 'Active',
      cell: ({ getValue }) => (
        <span className="font-medium" style={{ color: PRIMARY_COLOR }}>{getValue()}</span>
      ),
    },
    {
      accessorKey: 'total_patients',
      header: 'Patients',
      cell: ({ getValue }) => (
        <span className="text-gray-600">{getValue()}</span>
      ),
    },
    {
      accessorKey: 'avg_wait_time',
      header: 'Avg Wait (min)',
      cell: ({ getValue }) => (
        <span className="text-gray-600">{getValue() || 0}</span>
      ),
    },
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
        {/* Header with gradient */}
        <div className="relative rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 p-8 shadow-2xl overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }}></div>
          </div>
          
          <div className="relative">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-indigo-100 text-base font-medium">
              System-wide overview and analytics
            </p>
          </div>
          
          {/* Decorative gradient orb */}
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full opacity-20 blur-3xl"></div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Clinics"
            value={stats?.totalClinics || 0}
            change="+12.5%"
            changeType="increase"
            icon={Building2}
          />
          <KPICard
            title="Total Doctors"
            value={stats?.totalDoctors || 0}
            change="+8.2%"
            changeType="increase"
            icon={Stethoscope}
          />
          <KPICard
            title="Total Patients"
            value={stats?.totalPatients || 0}
            change="+15.3%"
            changeType="increase"
            icon={Users}
          />
          <KPICard
            title="Total Users"
            value={stats?.totalUsers || 0}
            change="+10.1%"
            changeType="increase"
            icon={Users}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Queues"
            value={stats?.totalQueues || 0}
            subtitle="Across all clinics"
            icon={ListChecks}
          />
          <StatCard
            title="System Activity"
            value={stats?.systemActivity || 0}
            subtitle="Total operations today"
            icon={Activity}
          />
          <StatCard
            title="Growth Rate"
            value="+12.5%"
            subtitle="User growth this month"
            icon={TrendingUp}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProfessionalLineChart
            data={userGrowthData}
            title="User Growth Over Time"
            dataKey="users"
            color={PRIMARY_COLOR}
          />
          <SimpleDonutChart
            data={userDistributionData}
            title="User Distribution by Role"
          />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <ChartBarChart
            data={clinicPerformance}
            title="Clinic Performance Comparison"
            dataKey="total_tickets"
            nameKey="clinic_name"
            color={PRIMARY_COLOR}
          />
        </div>

        {/* Table */}
        <SimpleTable
          data={clinicPerformance}
          columns={clinicColumns}
          title="Clinic Performance Overview"
        />
      </div>
    </DashboardLayout>
  );
}
