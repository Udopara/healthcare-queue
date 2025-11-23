import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import SimpleTable from "../../components/admin/dashboard/SimpleTable";
import { fetchQueues, createQueue } from "../../api/doctorService";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Eye } from "lucide-react";

export default function DoctorQueues() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [queues, setQueues] = useState([]);
  const [newQueue, setNewQueue] = useState("");
  const [maxNumber, setMaxNumber] = useState("");
  const [loading, setLoading] = useState(true);

  const columns = useMemo(() => [
    { 
      accessorKey: "queue_name", 
      header: "Queue Name",
      cell: ({ row }) => {
        const queueName = row.original.queue_name;
        const queueId = row.original.queue_id;
        return (
          <button
            onClick={() => navigate(`/doctor/queues/${queueId}`)}
            className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors"
          >
            {queueName}
          </button>
        );
      }
    },
    { 
      accessorKey: "status", 
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue();
        const statusConfig = {
          open: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', label: 'Open' },
          paused: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', label: 'Paused' },
          closed: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', label: 'Closed' }
        };
        const config = statusConfig[status] || statusConfig.open;
        return (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
            {config.label}
          </span>
        );
      }
    },
    { 
      accessorKey: "created_by_name", 
      header: "Created By",
      cell: ({ row }) => {
        const creatorName = row.original.created_by_name || "Unknown";
        const creatorRole = row.original.created_by_role || "unknown";
        
        // Color coding based on role - using main indigo theme
        const roleColors = {
          doctor: "bg-indigo-100 text-indigo-800 border-indigo-200",
          clinic: "bg-indigo-50 text-indigo-700 border-indigo-100",
          unknown: "bg-gray-100 text-gray-800 border-gray-200"
        };
        
        const roleLabels = {
          doctor: "Doctor",
          clinic: "Clinic",
          unknown: "Unknown"
        };
        
        const colorClass = roleColors[creatorRole] || roleColors.unknown;
        const roleLabel = roleLabels[creatorRole] || "Unknown";
        
        return (
          <div className="flex flex-col gap-1.5">
            <span className="font-medium text-gray-900">{creatorName}</span>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${colorClass}`}>
              {roleLabel}
            </span>
          </div>
        );
      }
    },
    { 
      accessorKey: "queue_id", 
      header: "Actions",
      cell: ({ row }) => {
        const queueId = row.original.queue_id;
        return (
          <button
            onClick={() => navigate(`/doctor/queues/${queueId}`)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            Monitor
          </button>
        );
      }
    },
  ], [navigate]);

  useEffect(() => {
    const loadQueues = async () => {
      if (!user?.clinic_id) {
        setLoading(false);
        return;
      }

      try {
        // Fetch queues filtered by clinic_id
        const data = await fetchQueues(user.clinic_id);
        setQueues(data);
      } catch (error) {
        console.error("Error fetching queues:", error);
        toast.error("Failed to load queues");
      } finally {
        setLoading(false);
      }
    };
    loadQueues();
  }, [user?.clinic_id]);

  const handleAddQueue = async () => {
    if (!newQueue.trim()) {
      toast.error("Queue name is required");
      return;
    }

    if (!user?.clinic_id) {
      toast.error("Unable to determine clinic. Please contact support.");
      return;
    }

    // For doctors, linked_entity_id is the doctor_id
    const doctorId = user.role === "doctor" ? user.linked_entity_id : null;

    try {
      const maxNum = maxNumber ? parseInt(maxNumber, 10) : 0;
      const created = await createQueue(newQueue.trim(), user.clinic_id, maxNum, doctorId);
      setQueues((prev) => [...prev, created]);
      setNewQueue("");
      setMaxNumber("");
      toast.success("Queue created successfully!");
    } catch (error) {
      console.error("Error creating queue:", error);
      toast.error(error.response?.data?.message || "Failed to create queue");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-gray-600">Loading queues...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Queue Management</h1>
          <p className="text-sm text-gray-600 mt-1">Create and manage queues for your clinic</p>
        </div>

        {/* Create Queue Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Queue</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="queueName" className="block text-sm font-medium text-gray-700 mb-2">
                Queue Name <span className="text-red-500">*</span>
              </label>
              <input
                id="queueName"
                type="text"
                placeholder="e.g., General Consultation, Emergency"
                value={newQueue}
                onChange={(e) => setNewQueue(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                onKeyPress={(e) => e.key === "Enter" && handleAddQueue()}
              />
            </div>
            <div>
              <label htmlFor="maxNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Capacity (Optional)
              </label>
              <input
                id="maxNumber"
                type="number"
                placeholder="0 = unlimited"
                value={maxNumber}
                onChange={(e) => setMaxNumber(e.target.value)}
                min="0"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty or set to 0 for unlimited capacity</p>
            </div>
            <button
              onClick={handleAddQueue}
              disabled={loading || !newQueue.trim()}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? "Creating..." : "Create Queue"}
            </button>
          </div>
        </div>

        {/* Queues List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Queues</h2>
          {queues.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No queues created yet. Create your first queue above.</p>
            </div>
          ) : (
            <SimpleTable data={queues} columns={columns} title={null} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
