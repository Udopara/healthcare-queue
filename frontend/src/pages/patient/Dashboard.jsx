import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { appointments } from "./table";
import { useAuth } from "../../context/AuthContext";
import { Bell, CalendarCheck, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="relative rounded-2xl bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-700 p-6 shadow-xl flex justify-between items-center text-white">
          <div>
            <h1 className="text-3xl font-bold">Patient Dashboard</h1>
            <p className="text-indigo-100 text-base font-medium">
              Welcome back, {user?.fullName} 👋
            </p>
          </div>
          <p className="text-indigo-100 font-medium">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 border-l-indigo-600">
            <h2 className="text-lg font-semibold text-indigo-800 mb-4">Active Queue</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600 font-medium">Queue Position</p>
                <p className="text-5xl font-bold text-indigo-600">15</p>
              </div>
              <div className="flex justify-between text-gray-600">
                <div>
                  <p className="font-medium">Department</p>
                  <p className="font-semibold text-gray-800">Radiology</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Est. Wait</p>
                  <p className="font-semibold text-gray-800">~15 mins</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1 mt-4">
                <div className="bg-indigo-500 h-1 rounded-full w-3/5"></div>
              </div>
              <p className="text-gray-500 text-sm mt-2">Ticket ID A-91240</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 border-l-indigo-600 flex flex-col justify-between">
            <h2 className="text-lg font-semibold text-indigo-800 mb-4">Quick Actions</h2>
            <div className=" flex flex-col items-center space-y-3 w-full">
              <Link to="/patient/join" className="py-1.5 bg-indigo-600 text-white w-40 text-center border hover:border-indigo-600 hover:text-indigo-600 font-medium rounded-lg hover:bg-gray-100 transition-all">Join New Queue</Link>
              <Link className="py-2 bg-red-500 text-white w-40 text-center border hover:border-red-600 hover:text-red-600 font-medium rounded-lg hover:bg-gray-100 transition-all">Cancel Queue</Link>
              <Link className="py-2 w-40 text-center border border-gray-300 font-medium rounded-lg hover:bg-gray-100 transition-all">View All Tickets</Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 border-l-indigo-600">
            <h2 className="text-lg font-semibold text-indigo-800 mb-4">Notifications</h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-indigo-500 mt-0.5" />
                <div>
                  <p>Your turn is coming soon (Queue #3)</p>
                  <span className="text-sm text-gray-400">2 hours ago</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CalendarCheck className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p>Appointment confirmed for 12:00 PM</p>
                  <span className="text-sm text-gray-400">4 hours ago</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                <div>
                  <p>Visit completed successfully</p>
                  <span className="text-sm text-gray-400">1 day ago</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 border-l-indigo-600">
          <div className="flex items-baseline gap-3">
            <Bell className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-indigo-600 mb-4">Upcoming Appointments</h2>
          </div>
          <table className="min-w-full">
            <thead>
              <tr className="border-b text-gray-700">
                <th className="text-left px-3 py-2">Ticket ID</th>
                <th className="text-left px-3 py-2">Department</th>
                <th className="text-left px-3 py-2">Status</th>
                <th className="text-left px-3 py-2">Time</th>
                <th className="text-left px-3 py-2">Day/Year</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((app, index) => {
                let statusColor = ""
                if (app.status === "Completed") statusColor ="text-green-600"
                  else if (app.status === "Serving") statusColor = "text-yellow-600"
                  else statusColor = "text-red-600";

                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-slate-500">{app.ticketId}</td>
                    <td className="px-3 py-2 text-slate-500">{app.department}</td>
                    <td className={`px-3 py-2 font-medium ${statusColor}`}>{app.status}</td>
                    <td className="px-3 py-2 text-slate-500">{app.time}</td>
                    <td className="px-3 py-2 text-slate-500">{app.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
