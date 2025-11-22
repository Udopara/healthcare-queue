import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import SimpleTable from "../../components/admin/dashboard/SimpleTable";
import { fetchQueues, createQueue } from "../../api/doctorService";

export default function DoctorQueues() {
  const [queues, setQueues] = useState([]);
  const [newQueue, setNewQueue] = useState({
    queue_name: "",
    max_number: "",
    clinic_id: "",
    status: "open",
  });
  const [loading, setLoading] = useState(true);

  const columns = useMemo(
    () => [
      { accessorKey: "queue_name", header: "Queue Name" },
      { accessorKey: "max_number", header: "Max Patients" },
      { accessorKey: "status", header: "Status" },
      { accessorKey: "clinic_id", header: "Clinic ID" },
      { accessorKey: "created_at", header: "Created At" },
    ],
    []
  );

  useEffect(() => {
    const loadQueues = async () => {
      try {
        const data = await fetchQueues();
        setQueues(data);
      } catch (error) {
        console.error("Error fetching queues:", error);
      } finally {
        setLoading(false);
      }
    };
    loadQueues();
  }, []);

  const handleAddQueue = async () => {
    if (!newQueue.queue_name || !newQueue.max_number || !newQueue.clinic_id)
      return alert("Please fill in all fields.");

    try {
      const created = await createQueue(newQueue);
      setQueues((prev) => [...prev, created]);
      setNewQueue({ queue_name: "", max_number: "", clinic_id: "", status: "open" });
    } catch (error) {
      console.error("Error creating queue:", error);
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
      <div className="space-y-6 max-w-3xl">
        <h1 className="text-2xl font-bold">Queues</h1>

        {/* Queue Form */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <input
            type="text"
            placeholder="Queue name"
            value={newQueue.queue_name}
            onChange={(e) => setNewQueue({ ...newQueue, queue_name: e.target.value })}
            className="border rounded px-3 py-2"
          />

          <input
            type="number"
            placeholder="Max patients"
            value={newQueue.max_number}
            onChange={(e) => setNewQueue({ ...newQueue, max_number: e.target.value })}
            className="border rounded px-3 py-2"
          />

          <input
            type="number"
            placeholder="Clinic ID"
            value={newQueue.clinic_id}
            onChange={(e) => setNewQueue({ ...newQueue, clinic_id: e.target.value })}
            className="border rounded px-3 py-2"
          />

          <select
            value={newQueue.status}
            onChange={(e) => setNewQueue({ ...newQueue, status: e.target.value })}
            className="border rounded px-3 py-2"
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <button
          onClick={handleAddQueue}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Create Queue
        </button>

        <SimpleTable data={queues} columns={columns} title="Your Queues" />
      </div>
    </DashboardLayout>
  );
}
