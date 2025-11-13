import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import SimpleTable from "../../components/admin/dashboard/SimpleTable";
import { fetchTickets, createTicket, deleteTicket } from "../../api/doctorService";

export default function DoctorAppointments() {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    patient_name: "",
    appointment_time: "",
    status: "Scheduled",
    notes: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await fetchTickets();
        setAppointments(data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAppointments();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteTicket(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Error deleting appointment:", err);
    }
  };

  const handleCreate = async () => {
    const { patient_name, appointment_time } = newAppointment;

    // Validation
    if (!patient_name.trim() || !appointment_time) {
      setError("Patient name and appointment time are required.");
      return;
    }

    setError("");

    try {
      const created = await createTicket(newAppointment);
      setAppointments((prev) => [...prev, created]);
      setNewAppointment({
        patient_name: "",
        appointment_time: "",
        status: "Scheduled",
        notes: "",
      });
    } catch (err) {
      console.error("Error creating appointment:", err);
      setError("Failed to create appointment. Please try again.");
    }
  };

  const columns = useMemo(
    () => [
      { accessorKey: "patient_name", header: "Patient Name" },
      { accessorKey: "appointment_time", header: "Appointment Time" },
      { accessorKey: "status", header: "Status" },
      { accessorKey: "notes", header: "Notes" },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button
            onClick={() => handleDelete(row.original.id)}
            className="text-red-600 hover:underline"
          >
            Delete
          </button>
        ),
      },
    ],
    []
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 border-indigo-600"></div>
          <p className="text-gray-600 text-center">Loading appointments...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <h1 className="text-2xl font-bold">Appointments</h1>

        {/* Create Appointment Form */}
        <div className="flex flex-col md:flex-row gap-2 mb-4 items-center">
          <input
            type="text"
            placeholder="Patient Name"
            value={newAppointment.patient_name}
            onChange={(e) =>
              setNewAppointment({ ...newAppointment, patient_name: e.target.value })
            }
            className="border rounded px-3 py-2 flex-1"
          />
          <input
            type="datetime-local"
            value={newAppointment.appointment_time}
            onChange={(e) =>
              setNewAppointment({ ...newAppointment, appointment_time: e.target.value })
            }
            className="border rounded px-3 py-2 flex-1"
          />
          <select
            value={newAppointment.status}
            onChange={(e) =>
              setNewAppointment({ ...newAppointment, status: e.target.value })
            }
            className="border rounded px-3 py-2"
          >
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <input
            type="text"
            placeholder="Notes"
            value={newAppointment.notes}
            onChange={(e) =>
              setNewAppointment({ ...newAppointment, notes: e.target.value })
            }
            className="border rounded px-3 py-2 flex-1"
          />
          <button
            onClick={handleCreate}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Add Appointment
          </button>
        </div>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        {/* Appointments Table */}
        <SimpleTable
          data={appointments}
          columns={columns}
          title="Your Appointments"
        />
      </div>
    </DashboardLayout>
  );
}
