import React, { useState, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import SimpleTable from '../../components/admin/dashboard/SimpleTable';

export default function DoctorQueues() {
  const [queues, setQueues] = useState([
    { id: 1, queueName: 'Morning Consultation', totalPatients: 5, status: 'Active' },
    { id: 2, queueName: 'Afternoon Follow-up', totalPatients: 3, status: 'Scheduled' }
  ]);
  const [newQueue, setNewQueue] = useState('');

  const columns = useMemo(() => [
    { accessorKey: 'queueName', header: 'Queue Name' },
    { accessorKey: 'totalPatients', header: 'Total Patients' },
    { accessorKey: 'status', header: 'Status' }
  ], []);

  const handleAddQueue = () => {
    if (!newQueue) return;
    setQueues(prev => [...prev, { id: prev.length + 1, queueName: newQueue, totalPatients: 0, status: 'Scheduled' }]);
    setNewQueue('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <h1 className="text-2xl font-bold">Queues</h1>
        <div className="flex space-x-2 mb-4">
          <input type="text" placeholder="New queue name" value={newQueue} onChange={e => setNewQueue(e.target.value)} className="border rounded px-3 py-2 flex-1"/>
          <button onClick={handleAddQueue} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Create Queue</button>
        </div>
        <SimpleTable data={queues} columns={columns} title="Your Queues" />
      </div>
    </DashboardLayout>
  );
}
