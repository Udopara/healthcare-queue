import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import SimpleTable from '../../components/admin/dashboard/SimpleTable';


export default function DoctorReports() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const loadReports = () => {
      
      setLoading(false);
    };
    setTimeout(loadReports, 500);
  }, []);

  const columns = useMemo(() => [
    { accessorKey: 'patient_name', header: 'Patient Name' },
    { accessorKey: 'appointment_time', header: 'Appointment Time' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'notes', header: 'Notes' },
  ], []);

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 border-indigo-600"></div>
        <p className="text-gray-600 text-center">Loading reports...</p>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-4">Reports</h1>
        <SimpleTable data={reports} columns={columns} title="Patient & Appointment Reports" />
      </div>
    </DashboardLayout>
  );
}
