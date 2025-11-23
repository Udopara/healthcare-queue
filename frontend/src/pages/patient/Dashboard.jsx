import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import KPICard from "../../components/admin/dashboard/KPICard";
import ProfessionalLineChart from "../../components/admin/dashboard/ProfessionalLineChart";
import SimpleDonutChart from "../../components/admin/dashboard/SimpleDonutChart";
import SimpleTable from "../../components/admin/dashboard/SimpleTable";
import { getMyTickets, fetchAvailableQueues, getQueueTickets } from "../../api/patientService";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Phone,
} from "lucide-react";
import toast from "react-hot-toast";

const PRIMARY_COLOR = "#6366f1";

export default function PatientDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTickets: 0,
    waitingTickets: 0,
    servingTickets: 0,
    completedTickets: 0,
  });
  const [tickets, setTickets] = useState([]);
  const [availableQueues, setAvailableQueues] = useState(0);
  const [queueTickets, setQueueTickets] = useState({}); // Store all tickets for each queue to calculate position

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ticketsData, queuesData] = await Promise.all([
        getMyTickets(),
        fetchAvailableQueues().catch(() => []),
      ]);

      setTickets(ticketsData);
      setAvailableQueues(queuesData.filter((q) => q.status === "open").length);

      // Fetch all tickets for each queue to calculate positions
      const queueIds = [...new Set(ticketsData.map(t => t.queue_id))];
      const ticketsForQueues = await Promise.all(
        queueIds.map(id => 
          getQueueTickets(id).catch(err => {
            console.warn(`Failed to fetch tickets for queue ${id}:`, err);
            return [];
          })
        )
      );

      const queueTicketsMap = {};
      ticketsForQueues.forEach((tickets, index) => {
        queueTicketsMap[queueIds[index]] = tickets;
      });
      setQueueTickets(queueTicketsMap);

      // Calculate statistics
      const waitingTickets = ticketsData.filter((t) => t.status === "waiting").length;
      const servingTickets = ticketsData.filter((t) => t.status === "serving").length;
      const completedTickets = ticketsData.filter((t) => t.status === "completed").length;

      setStats({
        totalTickets: ticketsData.length,
        waitingTickets,
        servingTickets,
        completedTickets,
      });
    } catch (error) {
      console.error("Error loading dashboard:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Time series data for last 7 days
  const ticketHistoryData = useMemo(() => {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const ticketsForDay = tickets.filter((ticket) => {
        if (!ticket.issued_at) return false;

        try {
          const ticketDate = new Date(ticket.issued_at);
          if (isNaN(ticketDate.getTime())) return false;
          ticketDate.setHours(0, 0, 0, 0);
          return ticketDate >= date && ticketDate < nextDay;
        } catch (e) {
          return false;
        }
      });

      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      const dayNumber = date.getDate();
      const monthName = date.toLocaleDateString("en-US", { month: "short" });
      days.push({
        date: `${dayName} ${dayNumber} ${monthName}`,
        tickets: ticketsForDay.length,
      });
    }

    return days;
  }, [tickets]);

  // Ticket status distribution
  const statusDistribution = useMemo(() => {
    const statusCounts = {
      waiting: 0,
      serving: 0,
      completed: 0,
      cancelled: 0,
    };

    tickets.forEach((ticket) => {
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
  }, [tickets]);

  // Calculate position in queue
  const getPosition = (ticket) => {
    if (ticket.status === "completed") {
      return { display: "Completed", value: null };
    }
    if (ticket.status === "cancelled") {
      return { display: "-", value: null };
    }
    if (ticket.status === "serving") {
      return { display: "Currently Serving", value: 0 };
    }

    // For waiting tickets, calculate position
    const allTickets = queueTickets[ticket.queue_id] || [];
    // Get active tickets (waiting and serving) sorted by id (which is ticket_id)
    const activeTickets = allTickets
      .filter((t) => t.status === "waiting" || t.status === "serving")
      .sort((a, b) => {
        // Sort by id (which is ticket_id, contains sequence number)
        const aId = a.id || a.ticket_id || "";
        const bId = b.id || b.ticket_id || "";
        return aId.localeCompare(bId);
      });

    // Match by id (backend returns id instead of ticket_id)
    const ticketId = ticket.id || ticket.ticket_id;
    const index = activeTickets.findIndex((t) => (t.id || t.ticket_id) === ticketId);
    // Add 1 to convert from 0-based index to 1-based position
    const position = index >= 0 ? index + 1 : null;
    return { display: position ? `#${position}` : "-", value: position };
  };

  // Recent tickets for table
  const recentTickets = useMemo(() => {
    return tickets
      .sort((a, b) => {
        const dateA = new Date(a.issued_at || 0);
        const dateB = new Date(b.issued_at || 0);
        return dateB - dateA;
      })
      .slice(0, 5);
  }, [tickets, queueTickets]);

  const ticketColumns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Ticket Number",
        cell: ({ row }) => {
          // Backend returns 'id' which is the ticket_id
          const ticketId = row.original.id || row.original.ticket_id;
          return (
            <span className="font-mono text-sm font-semibold text-indigo-600">
              {ticketId}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue();
          const configs = {
            waiting: {
              bg: "bg-yellow-100",
              text: "text-yellow-800",
              label: "Waiting",
            },
            serving: {
              bg: "bg-blue-100",
              text: "text-blue-800",
              label: "Serving",
            },
            completed: {
              bg: "bg-green-100",
              text: "text-green-800",
              label: "Completed",
            },
            cancelled: {
              bg: "bg-red-100",
              text: "text-red-800",
              label: "Cancelled",
            },
          };
          const config = configs[status] || configs.waiting;
          return (
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
            >
              {config.label}
            </span>
          );
        },
      },
      {
        accessorKey: "position",
        header: "Position",
        cell: ({ row }) => {
          const position = getPosition(row.original);
          if (position.value === null) {
            return <span className="text-gray-400">{position.display}</span>;
          }
          if (position.value === 0) {
            return (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                <Phone className="w-3.5 h-3.5" />
                {position.display}
              </span>
            );
          }
          return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
              <Clock className="w-3.5 h-3.5" />
              {position.display}
            </span>
          );
        },
      },
      {
        accessorKey: "issued_at",
        header: "Joined At",
        cell: ({ getValue }) => {
          const date = getValue();
          if (!date) return "-";
          try {
            return new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
          } catch (e) {
            return "-";
          }
        },
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Link
            to="/patient/my-queues"
            className="text-indigo-600 hover:text-indigo-900 font-medium text-sm"
          >
            View Details
          </Link>
        ),
      },
    ],
    [queueTickets]
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
              Patient Dashboard
            </h1>
            <p className="text-indigo-100 text-base font-medium">
              Overview of your queue tickets and activity
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Tickets"
            value={stats.totalTickets}
            icon={Calendar}
            change={`${stats.totalTickets > 0 ? "+" : ""}${stats.totalTickets}`}
            changeType="increase"
          />
          <KPICard
            title="Waiting"
            value={stats.waitingTickets}
            icon={Clock}
            change={`${stats.waitingTickets > 0 ? "Active" : "None"}`}
            changeType={stats.waitingTickets > 0 ? "increase" : "decrease"}
          />
          <KPICard
            title="Serving"
            value={stats.servingTickets}
            icon={TrendingUp}
            change={`${stats.servingTickets > 0 ? "Active" : "None"}`}
            changeType={stats.servingTickets > 0 ? "increase" : "decrease"}
          />
          <KPICard
            title="Completed"
            value={stats.completedTickets}
            icon={CheckCircle}
            change={`${stats.completedTickets > 0 ? "+" : ""}${stats.completedTickets}`}
            changeType="increase"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/patient/browse"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Browse Queues
                </h3>
                <p className="text-sm text-gray-600">
                  {availableQueues} queue{availableQueues !== 1 ? "s" : ""} available
                </p>
              </div>
              <div className="bg-indigo-100 rounded-lg p-3 group-hover:bg-indigo-200 transition-colors">
                <ArrowRight className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </Link>

          <Link
            to="/patient/my-queues"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  My Queues
                </h3>
                <p className="text-sm text-gray-600">
                  View all your joined queues
                </p>
              </div>
              <div className="bg-green-100 rounded-lg p-3 group-hover:bg-green-200 transition-colors">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Link>
        </div>

        {/* Charts - Stacked vertically for better width */}
        <div className="space-y-6">
          <ProfessionalLineChart
            data={ticketHistoryData}
            title="Tickets Joined (Last 7 Days)"
            dataKey="tickets"
            color={PRIMARY_COLOR}
          />
          {statusDistribution.length > 0 && (
            <SimpleDonutChart
              data={statusDistribution}
              title="Ticket Status Distribution"
            />
          )}
        </div>

        {/* Recent Tickets Table */}
        {recentTickets.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Tickets
              </h2>
              <Link
                to="/patient/my-queues"
                className="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
              >
                View All
              </Link>
            </div>
            <SimpleTable data={recentTickets} columns={ticketColumns} title={null} />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Tickets Yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start by browsing and joining available queues
              </p>
              <Link
                to="/patient/browse"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Browse Queues
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
