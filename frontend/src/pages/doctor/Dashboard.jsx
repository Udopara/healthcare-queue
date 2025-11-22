import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import KPICard from "../../components/admin/dashboard/KPICard";
import ProfessionalLineChart from "../../components/admin/dashboard/ProfessionalLineChart";
import ChartBarChart from "../../components/admin/dashboard/ChartBarChart";
import SimpleDonutChart from "../../components/admin/dashboard/SimpleDonutChart";
import SimpleTable from "../../components/admin/dashboard/SimpleTable";
import { Users, ListChecks, Activity, Calendar } from "lucide-react";
import { fetchPatients, fetchQueues, fetchTickets } from "../../api/doctorService";

const PRIMARY_COLOR = "#6366f1";
const SECONDARY_COLOR = "#10b981";

export default function DoctorDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeQueues: 0,
    totalAppointments: 0,
    dailyOperations: 0,
  });
  const [patients, setPatients] = useState([]);
  const [queues, setQueues] = useState([]);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const patientsData = await fetchPatients();
        const queuesData = await fetchQueues();

        const ticketsData = await Promise.all(
          queuesData.map((q) => fetchTickets(q.queue_id))
        ).then((arrays) => arrays.flat());

        setPatients(patientsData);
        setQueues(queuesData);
        setTickets(ticketsData);

        setStats({
          totalPatients: patientsData.length,
          activeQueues: queuesData.length,
          totalAppointments: ticketsData.length,
          dailyOperations: patientsData.length + ticketsData.length,
        });
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const patientGrowthData = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        date: `Day ${i + 1}`,
        patients: Math.floor(10 + Math.random() * 20),
      })),
    []
  );

  const appointmentDistribution = useMemo(
    () => [
      { name: "Consultations", value: Math.floor(tickets.length * 0.6) },
      { name: "Follow-ups", value: Math.floor(tickets.length * 0.3) },
      { name: "Emergency", value: Math.floor(tickets.length * 0.1) },
    ],
    [tickets]
  );

  const doctorPerformance = useMemo(
    () =>
      queues.map((q) => ({
        doctor_name: `Queue ${q.queue_name}`,
        appointments: tickets.filter((t) => t.queue_id === q.queue_id).length,
        status: q.status === "open" ? "Active" : "Idle",
        notes: `Max ${q.max_number} patients`,
      })),
    [queues, tickets]
  );

  const appointmentColumns = useMemo(
    () => [
      { accessorKey: "doctor_name", header: "Queue" },
      { accessorKey: "appointments", header: "Appointments" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const val = getValue();
          const color = val === "Active" ? PRIMARY_COLOR : SECONDARY_COLOR;
          return <span className="font-medium" style={{ color }}>{val}</span>;
        },
      },
      { accessorKey: "notes", header: "Notes" },
    ],
    []
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

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Header */}
        <div className="relative rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 p-8 shadow-lg overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[length:32px_32px]" />
          <div className="relative">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Doctor Dashboard
            </h1>
            <p className="text-indigo-100 text-base font-medium">
              Overview of your patients, queues, and appointments
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard title="Total Patients" value={stats.totalPatients} icon={Users} />
          <KPICard title="Active Queues" value={stats.activeQueues} icon={ListChecks} />
          <KPICard title="Appointments" value={stats.totalAppointments} icon={Calendar} />
          <KPICard title="Daily Operations" value={stats.dailyOperations} icon={Activity} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProfessionalLineChart
            data={patientGrowthData}
            title="Patient Consultations Over Time"
            dataKey="patients"
            color={PRIMARY_COLOR}
          />
          <SimpleDonutChart
            data={appointmentDistribution}
            title="Appointments by Type"
          />
        </div>

        <ChartBarChart
          data={doctorPerformance}
          title="Queue Performance Overview"
          dataKey="appointments"
          nameKey="doctor_name"
          color={PRIMARY_COLOR}
        />

        {/* Table */}
        <SimpleTable
          data={doctorPerformance}
          columns={appointmentColumns}
          title="Your Queues & Appointments"
        />
      </div>
    </DashboardLayout>
  );
}
