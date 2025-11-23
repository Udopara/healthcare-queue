import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import SimpleTable from "../../components/admin/dashboard/SimpleTable";
import { getMyTickets, cancelTicket, getQueueById, getQueueTickets } from "../../api/patientService";
import toast from "react-hot-toast";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  X, 
  CheckCircle, 
  AlertCircle,
  Phone,
  RefreshCw
} from "lucide-react";
import Modal from "../../components/ui/Modal";

export default function MyQueues() {
  const [tickets, setTickets] = useState([]);
  const [queues, setQueues] = useState({}); // Store queue details by queue_id
  const [queueTickets, setQueueTickets] = useState({}); // Store all tickets for each queue to calculate position
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const ticketsData = await getMyTickets();
      setTickets(ticketsData);

      // Fetch queue details and all tickets for each queue (to calculate position)
      const queueIds = [...new Set(ticketsData.map(t => t.queue_id))];
      const [queueData, ticketsForQueues] = await Promise.all([
        Promise.all(
          queueIds.map(id => 
            getQueueById(id).catch(err => {
              console.warn(`Failed to fetch queue ${id}:`, err);
              return null;
            })
          )
        ),
        Promise.all(
          queueIds.map(id => 
            getQueueTickets(id).catch(err => {
              console.warn(`Failed to fetch tickets for queue ${id}:`, err);
              return [];
            })
          )
        )
      ]);

      const queuesMap = {};
      const queueTicketsMap = {};
      queueData.forEach((queue, index) => {
        if (queue) {
          queuesMap[queueIds[index]] = queue;
        }
      });
      ticketsForQueues.forEach((tickets, index) => {
        queueTicketsMap[queueIds[index]] = tickets;
      });

      setQueues(queuesMap);
      setQueueTickets(queueTicketsMap);
    } catch (error) {
      console.error("Error loading tickets:", error);
      toast.error("Failed to load your queues");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (ticket) => {
    if (ticket.status === "completed") {
      toast.error("Cannot cancel a completed ticket");
      return;
    }
    setSelectedTicket(ticket);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedTicket) return;

    try {
      setCancellingId(selectedTicket.id);
      await cancelTicket(selectedTicket.id);
      toast.success("Queue cancelled successfully");
      setShowCancelModal(false);
      setSelectedTicket(null);
      await loadTickets();
    } catch (error) {
      console.error("Error cancelling ticket:", error);
      toast.error(error.response?.data?.message || "Failed to cancel queue");
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

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
    // Get active tickets (waiting and serving) sorted by id/ticket_id
    const activeTickets = allTickets
      .filter((t) => t.status === "waiting" || t.status === "serving")
      .sort((a, b) => {
        // Sort by id or ticket_id (which contains sequence number)
        const aId = a.id || a.ticket_id || "";
        const bId = b.id || b.ticket_id || "";
        return aId.localeCompare(bId);
      });

    // Match by id (patient tickets use 'id') or ticket_id (queue tickets might use 'ticket_id')
    const ticketId = ticket.id || ticket.ticket_id;
    const index = activeTickets.findIndex((t) => (t.id || t.ticket_id) === ticketId);
    // Add 1 to convert from 0-based index to 1-based position for professional display
    const position = index >= 0 ? index + 1 : null;
    return { display: position ? `#${position}` : "-", value: position };
  };

  const getStatusBadge = (status) => {
    const configs = {
      waiting: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-200",
        label: "Waiting",
        icon: Clock,
      },
      serving: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-200",
        label: "Serving",
        icon: Phone,
      },
      completed: {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-200",
        label: "Completed",
        icon: CheckCircle,
      },
      cancelled: {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-200",
        label: "Cancelled",
        icon: X,
      },
    };

    const config = configs[status] || configs.waiting;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "queue_name",
        header: "Queue Name",
        cell: ({ row }) => {
          const queue = queues[row.original.queue_id];
          return (
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900">
                {queue?.queue_name || `Queue #${row.original.queue_id}`}
              </span>
              {queue?.status && (
                <span
                  className={`text-xs mt-1 ${
                    queue.status === "open"
                      ? "text-green-600"
                      : queue.status === "paused"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {queue.status.charAt(0).toUpperCase() + queue.status.slice(1)}
                </span>
              )}
            </div>
          );
        },
      },
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
        cell: ({ getValue }) => getStatusBadge(getValue()),
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
        cell: ({ getValue }) => (
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            {formatDate(getValue())}
          </div>
        ),
      },
      {
        accessorKey: "served_at",
        header: "Served At",
        cell: ({ getValue, row }) => {
          if (row.original.status === "completed" && getValue()) {
            return (
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-600" />
                {formatDate(getValue())}
              </div>
            );
          }
          return <span className="text-gray-400">-</span>;
        },
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const ticket = row.original;
          const canCancel = ticket.status === "waiting" || ticket.status === "serving";

          return (
            <div className="flex items-center gap-2">
              {canCancel && (
                <button
                  onClick={() => handleCancelClick(ticket)}
                  disabled={cancellingId === ticket.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [queues, queueTickets, cancellingId]
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-72">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your queues...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">My Queues</h1>
            <p className="text-gray-600 mt-1">
              View and manage all queues you've joined
            </p>
          </div>
          <button
            onClick={loadTickets}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{tickets.length}</p>
              </div>
              <div className="bg-indigo-100 rounded-lg p-3">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Waiting</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {tickets.filter(t => t.status === "waiting").length}
                </p>
              </div>
              <div className="bg-yellow-100 rounded-lg p-3">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Serving</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {tickets.filter(t => t.status === "serving").length}
                </p>
              </div>
              <div className="bg-blue-100 rounded-lg p-3">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {tickets.filter(t => t.status === "completed").length}
                </p>
              </div>
              <div className="bg-green-100 rounded-lg p-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        {tickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Queues Joined
              </h3>
              <p className="text-gray-500 mb-6">
                You haven't joined any queues yet. Browse available queues to get started.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <SimpleTable data={tickets} columns={columns} title={null} />
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        <Modal
          isOpen={showCancelModal}
          onClose={() => {
            setShowCancelModal(false);
            setSelectedTicket(null);
          }}
          title="Cancel Queue"
        >
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <p className="text-gray-700">
              Are you sure you want to cancel this queue? This action cannot be undone.
            </p>
          </div>
          {selectedTicket && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Ticket:</span> {selectedTicket.ticket_id}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Queue:</span>{" "}
                {queues[selectedTicket.queue_id]?.queue_name || `Queue #${selectedTicket.queue_id}`}
              </p>
            </div>
          )}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => {
                setShowCancelModal(false);
                setSelectedTicket(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Keep Queue
            </button>
            <button
              onClick={handleCancelConfirm}
              disabled={cancellingId !== null}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {cancellingId ? "Cancelling..." : "Yes, Cancel Queue"}
            </button>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
