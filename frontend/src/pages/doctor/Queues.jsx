import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import SimpleTable from "../../components/admin/dashboard/SimpleTable";
import { fetchQueues, createQueue } from "../../api/doctorService";

export default function DoctorQueues() {
  const [queues, setQueues] = useState([]);
  const [newQueue, setNewQueue] = useState("");
  const [loading, setLoading] = useState(true);

  const columns = useMemo(() => [
    { accessorKey: "queue_name", header: "Queue Name" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "clinic_id", header: "Clinic ID" },
    { accessorKey: "created_at", header: "Created At" },
  ], []);

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
    if (!newQueue) return;
    try {
      const created = await createQueue(newQueue);
      setQueues((prev) => [...prev, created]);
      setNewQueue("");
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
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            placeholder="New queue name"
            value={newQueue}
            onChange={(e) => setNewQueue(e.target.value)}
            className="border rounded px-3 py-2 flex-1"
          />
          <button
            onClick={handleAddQueue}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Create Queue
          </button>
        </div>
        <SimpleTable data={queues} columns={columns} title="Your Queues" />
      </div>
    </DashboardLayout>
  );
}
