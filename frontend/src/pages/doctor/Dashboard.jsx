import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import KPICard from "../../components/admin/dashboard/KPICard";
import ProfessionalLineChart from "../../components/admin/dashboard/ProfessionalLineChart";
import ChartBarChart from "../../components/admin/dashboard/ChartBarChart";
import SimpleDonutChart from "../../components/admin/dashboard/SimpleDonutChart";
import SimpleTable from "../../components/admin/dashboard/SimpleTable";
import {
  ListChecks,
  Calendar,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { fetchQueues, getQueueTickets } from "../../api/doctorService";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const PRIMARY_COLOR = "#6366f1";
const SECONDARY_COLOR = "#10b981";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTickets: 0,
    activeQueues: 0,
    waitingPatients: 0,
    completedToday: 0,
  });
  const [queues, setQueues] = useState([]);
  const [allTickets, setAllTickets] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.clinic_id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch queues for this doctor's clinic
        const queuesData = await fetchQueues(user.clinic_id);
        
        // Filter queues created by this doctor
        // Handle type mismatches (string vs number)
        const doctorQueues = queuesData.filter((q) => {
          const queueDoctorId = q.doctor_id != null ? Number(q.doctor_id) : null;
          const userDoctorId = user.linked_entity_id != null ? Number(user.linked_entity_id) : null;
          return queueDoctorId === userDoctorId && queueDoctorId !== null;
        });
        
        setQueues(doctorQueues);

        // Fetch tickets for all doctor's queues
        const ticketsPromises = doctorQueues.map((queue) =>
          getQueueTickets(queue.queue_id).catch((err) => {
            console.warn(`Failed to fetch tickets for queue ${queue.queue_id}:`, err);
            return [];
          })
        );

        const ticketsArrays = await Promise.all(ticketsPromises);
        const allTicketsData = ticketsArrays.flat();
        setAllTickets(allTicketsData);

        // Calculate statistics from real data
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const completedToday = allTicketsData.filter((ticket) => {
          if (ticket.status !== "completed" || !ticket.served_at) return false;
          try {
            const servedDate = new Date(ticket.served_at);
            if (isNaN(servedDate.getTime())) return false;
            servedDate.setHours(0, 0, 0, 0);
            return servedDate.getTime() === today.getTime();
          } catch (e) {
            return false;
          }
        }).length;

        const waitingPatients = allTicketsData.filter(
          (t) => t.status === "waiting" || t.status === "serving"
        ).length;

        const activeQueues = doctorQueues.filter(
          (q) => q.status === "open" || q.status === "paused"
        ).length;

        setStats({
          totalTickets: allTicketsData.length,
          activeQueues: activeQueues,
          waitingPatients: waitingPatients,
          completedToday: completedToday,
        });
      } catch (err) {
        console.error("Error loading dashboard:", err);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  // Time series data for last 7 days
  const patientGrowthData = useMemo(() => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const ticketsForDay = allTickets.filter((ticket) => {
        if (!ticket.issued_at) return false;
        
        // Handle date parsing - check if it's a valid date
        let ticketDate;
        try {
          ticketDate = new Date(ticket.issued_at);
          // Check if date is valid
          if (isNaN(ticketDate.getTime())) {
            return false;
          }
        } catch (e) {
          // Invalid date format, skip this ticket
          return false;
        }
        
        ticketDate.setHours(0, 0, 0, 0);
        return ticketDate >= date && ticketDate < nextDay;
      });

      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      const dayNumber = date.getDate();
      const monthName = date.toLocaleDateString("en-US", { month: "short" });
      days.push({
        date: `${dayName} ${dayNumber} ${monthName}`,
        patients: ticketsForDay.length,
      });
    }
    
    return days;
  }, [allTickets]);

  // Ticket status distribution
  const appointmentDistribution = useMemo(() => {
    const statusCounts = {
      waiting: 0,
      serving: 0,
      completed: 0,
      cancelled: 0,
    };

    allTickets.forEach((ticket) => {
      const status = ticket.status || "waiting";
      if (statusCounts.hasOwnProperty(status)) {
        statusCounts[status]++;
      }
    });

    return [
      { name: "Waiting", value: statusCounts.waiting },
      { name: "Serving", value: statusCounts.serving },
      { name: "Completed", value: statusCounts.completed },
      { name: "Cancelled", value: statusCounts.cancelled },
    ].filter((item) => item.value > 0);
  }, [allTickets]);

  // Queue performance data
  const doctorPerformance = useMemo(() => {
    return queues.map((queue) => {
      const queueTickets = allTickets.filter(
        (t) => t.queue_id === queue.queue_id
      );
      const waitingCount = queueTickets.filter((t) => t.status === "waiting").length;
      const servingCount = queueTickets.filter((t) => t.status === "serving").length;
      const completedCount = queueTickets.filter((t) => t.status === "completed").length;

      return {
        queue_id: queue.queue_id,
        queue_name: queue.queue_name,
        totalTickets: queueTickets.length,
        waiting: waitingCount,
        serving: servingCount,
        completed: completedCount,
        status: queue.status || "closed",
      };
    });
  }, [queues, allTickets]);

  const appointmentColumns = useMemo(
    () => [
      {
        accessorKey: "queue_name",
        header: "Queue Name",
        cell: ({ row }) => (
          <Link
            to={`/doctor/queues/${row.original.queue_id}`}
            className="text-indigo-600 hover:text-indigo-900 font-medium hover:underline"
          >
            {row.original.queue_name}
          </Link>
        ),
      },
      {
        accessorKey: "totalTickets",
        header: "Total Tickets",
        cell: ({ getValue }) => (
          <span className="font-semibold text-gray-900">{getValue()}</span>
        ),
      },
      {
        accessorKey: "waiting",
        header: "Waiting",
        cell: ({ getValue }) => {
          const val = getValue();
          return (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
              {val}
            </span>
          );
        },
      },
      {
        accessorKey: "serving",
        header: "Serving",
        cell: ({ getValue }) => {
          const val = getValue();
          return (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              {val}
            </span>
          );
        },
      },
      {
        accessorKey: "completed",
        header: "Completed",
        cell: ({ getValue }) => {
          const val = getValue();
          return (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
              {val}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Queue Status",
        cell: ({ getValue }) => {
          const val = getValue();
          const statusConfig = {
            open: { bg: "bg-green-100", text: "text-green-800", label: "Open" },
            paused: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Paused" },
            closed: { bg: "bg-red-100", text: "text-red-800", label: "Closed" },
          };
          const config = statusConfig[val] || statusConfig.closed;
          return (
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
            >
              {config.label}
            </span>
          );
        },
      },
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
          <KPICard 
            title="Total Tickets" 
            value={stats.totalTickets} 
            icon={Calendar}
            change={`${stats.totalTickets > 0 ? '+' : ''}${stats.totalTickets}`}
            changeType="increase"
          />
          <KPICard 
            title="Active Queues" 
            value={stats.activeQueues} 
            icon={ListChecks}
            change={`${stats.activeQueues}/${queues.length}`}
            changeType="increase"
          />
          <KPICard 
            title="Waiting Patients" 
            value={stats.waitingPatients} 
            icon={Clock}
            change={`${stats.waitingPatients > 0 ? 'Active' : 'None'}`}
            changeType={stats.waitingPatients > 0 ? "increase" : "decrease"}
          />
          <KPICard 
            title="Completed Today" 
            value={stats.completedToday} 
            icon={CheckCircle}
            change={`${stats.completedToday > 0 ? '+' : ''}${stats.completedToday}`}
            changeType="increase"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProfessionalLineChart
            data={patientGrowthData}
            title="Tickets Issued (Last 7 Days)"
            dataKey="patients"
            color={PRIMARY_COLOR}
          />
          <SimpleDonutChart
            data={appointmentDistribution}
            title="Ticket Status Distribution"
          />
        </div>

        {doctorPerformance.length > 0 && (
          <ChartBarChart
            data={doctorPerformance}
            title="Queue Performance Overview"
            dataKey="totalTickets"
            nameKey="queue_name"
            color={PRIMARY_COLOR}
          />
        )}

        {/* Table */}
        {doctorPerformance.length > 0 ? (
          <SimpleTable
            data={doctorPerformance}
            columns={appointmentColumns}
            title="Your Queues & Tickets"
          />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center py-12">
              <ListChecks className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Queues Yet</h3>
              <p className="text-gray-500 mb-6">
                Create your first queue to start managing patient tickets
              </p>
              <Link
                to="/doctor/queues"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Create Queue
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
