import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getQueueById, joinQueue, getMyTickets } from "../../api/patientService";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Phone,
  Calendar,
  Users,
  Clock,
} from "lucide-react";

export default function JoinQueue() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const queueId = searchParams.get("queue_id");

  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [notificationContact, setNotificationContact] = useState("");
  const [alreadyJoined, setAlreadyJoined] = useState(false);

  useEffect(() => {
    if (!queueId) {
      toast.error("No queue specified");
      navigate("/patient/browse");
      return;
    }

    loadQueueData();
  }, [queueId]);

  const loadQueueData = async () => {
    try {
      setLoading(true);
      const [queueData, myTickets] = await Promise.all([
        getQueueById(queueId),
        getMyTickets().catch(() => []),
      ]);

      setQueue(queueData);

      // Check if patient already has a ticket for this queue
      const hasTicket = myTickets.some(
        (t) => t.queue_id === parseInt(queueId) && t.status !== "cancelled"
      );
      setAlreadyJoined(hasTicket);

      // Pre-fill notification contact with user's email or phone
      if (user?.email) {
        setNotificationContact(user.email);
      } else if (user?.phone_number) {
        setNotificationContact(user.phone_number);
      }
    } catch (error) {
      console.error("Error loading queue:", error);
      toast.error(error.response?.data?.message || "Failed to load queue details");
      navigate("/patient/browse");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();

    if (!notificationContact.trim()) {
      toast.error("Please provide a notification contact (email or phone)");
      return;
    }

    if (queue.status !== "open") {
      toast.error("This queue is not open for joining");
      return;
    }

    try {
      setJoining(true);
      const result = await joinQueue(queueId, notificationContact.trim());
      toast.success(result.message || "Successfully joined the queue!");
      navigate("/patient/my-queues");
    } catch (error) {
      console.error("Error joining queue:", error);
      toast.error(
        error.response?.data?.message || "Failed to join queue. Please try again."
      );
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-72">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading queue details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!queue) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/patient/browse")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Browse</span>
        </button>

        {/* Queue Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {queue.queue_name}
              </h1>
              {queue.created_by_name && (
                <p className="text-gray-600">
                  {queue.created_by_name}
                  {queue.created_by_role && (
                    <span className="ml-2 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">
                      {queue.created_by_role}
                    </span>
                  )}
                </p>
              )}
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                queue.status === "open"
                  ? "bg-green-100 text-green-800"
                  : queue.status === "paused"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {queue.status?.charAt(0).toUpperCase() + queue.status?.slice(1)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            {queue.max_number > 0 && (
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Max Capacity</p>
                  <p className="font-semibold text-gray-900">{queue.max_number}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Join Form or Already Joined Message */}
        {alreadyJoined ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900 mb-1">
                  Already Joined
                </h3>
                <p className="text-green-700 text-sm">
                  You have already joined this queue. Check "My Queues" to see your ticket details.
                </p>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => navigate("/patient/my-queues")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                View My Queues
              </button>
            </div>
          </div>
        ) : queue.status !== "open" ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">
                  Queue Not Available
                </h3>
                <p className="text-yellow-700 text-sm">
                  This queue is currently {queue.status}. Please check back later or browse other queues.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleJoin} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Join Queue
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Provide your contact information to receive notifications about your queue status.
              </p>
            </div>

            <div>
              <label
                htmlFor="notificationContact"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Notification Contact <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="notificationContact"
                  type="text"
                  placeholder="Email or phone number"
                  value={notificationContact}
                  onChange={(e) => setNotificationContact(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                We'll use this to notify you when it's your turn
              </p>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div className="text-sm text-indigo-800">
                  <p className="font-medium mb-1">Important Information</p>
                  <ul className="list-disc list-inside space-y-1 text-indigo-700">
                    <li>You will receive a ticket number upon joining</li>
                    <li>You can cancel your queue anytime from "My Queues"</li>
                    <li>Make sure to provide a valid contact for notifications</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/patient/browse")}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={joining || !notificationContact.trim()}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {joining ? "Joining..." : "Join Queue"}
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
