import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { fetchAvailableQueues, getMyTickets } from "../../api/patientService";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Search,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Filter,
} from "lucide-react";

export default function BrowseQueue() {
  const [queues, setQueues] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [queuesData, ticketsData] = await Promise.all([
        fetchAvailableQueues(),
        getMyTickets().catch(() => []), // Don't fail if tickets can't be loaded
      ]);
      setQueues(queuesData);
      setMyTickets(ticketsData);
    } catch (error) {
      console.error("Error loading queues:", error);
      toast.error("Failed to load queues");
    } finally {
      setLoading(false);
    }
  };

  // Get queues that patient has already joined
  const joinedQueueIds = useMemo(
    () => new Set(myTickets.map((t) => t.queue_id)),
    [myTickets]
  );

  // Filter queues
  const filteredQueues = useMemo(() => {
    return queues.filter((queue) => {
      // Status filter
      if (statusFilter !== "all" && queue.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          queue.queue_name?.toLowerCase().includes(searchLower) ||
          queue.created_by_name?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [queues, searchTerm, statusFilter]);

  const getStatusBadge = (status) => {
    const configs = {
      open: {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-200",
        label: "Open",
      },
      paused: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-200",
        label: "Paused",
      },
      closed: {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-200",
        label: "Closed",
      },
    };

    const config = configs[status] || configs.closed;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}
      >
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-72">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading available queues...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Browse Queues</h1>
          <p className="text-gray-600 mt-1">
            Find and join available queues from clinics
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search queues by name or clinic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="paused">Paused</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Queues Grid */}
        {filteredQueues.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Queues Found
              </h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "No queues are available at the moment"}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQueues.map((queue) => {
              const isJoined = joinedQueueIds.has(queue.queue_id);
              const canJoin = queue.status === "open" && !isJoined;

              return (
                <div
                  key={queue.queue_id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {queue.queue_name}
                      </h3>
                      {queue.created_by_name && (
                        <p className="text-sm text-gray-600">
                          {queue.created_by_name}
                          {queue.created_by_role && (
                            <span className="ml-2 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">
                              {queue.created_by_role}
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                    {getStatusBadge(queue.status)}
                  </div>

                  <div className="space-y-2 mb-4">
                    {queue.max_number > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>Max capacity: {queue.max_number}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    {isJoined ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Already Joined</span>
                      </div>
                    ) : canJoin ? (
                      <Link
                        to={`/patient/join?queue_id=${queue.queue_id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                      >
                        Join Queue
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <span className="text-sm text-gray-500">
                        {queue.status === "closed"
                          ? "Queue is closed"
                          : queue.status === "paused"
                          ? "Queue is paused"
                          : "Cannot join"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
