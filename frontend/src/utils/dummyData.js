// Dummy data for development and testing
// This file provides mock data that matches the backend structure
import { doctors } from "@/pages/patient/Doc-data";

export const dummyClinics = [
  {
    id: 1,
    clinic_name: "City Medical Center",
    email: "citymedical@example.com",
    phone_number: "555-0101",
    created_at: "2025-01-15T10:00:00Z"
  },
  {
    id: 2,
    clinic_name: "Downtown Health Clinic",
    email: "downtown@example.com",
    phone_number: "555-0102",
    created_at: "2025-01-20T10:00:00Z"
  },
  {
    id: 3,
    clinic_name: "Community Care Hospital",
    email: "community@example.com",
    phone_number: "555-0103",
    created_at: "2025-02-01T10:00:00Z"
  }
];

export const dummyDoctors = [
  {
    id: 1,
    clinic_id: 1,
    full_name: "Dr. Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone_number: "555-0201",
    created_at: "2025-01-16T10:00:00Z"
  },
  {
    id: 2,
    clinic_id: 1,
    full_name: "Dr. Michael Chen",
    email: "michael.chen@example.com",
    phone_number: "555-0202",
    created_at: "2025-01-17T10:00:00Z"
  },
  {
    id: 3,
    clinic_id: 2,
    full_name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@example.com",
    phone_number: "555-0203",
    created_at: "2025-01-21T10:00:00Z"
  },
  {
    id: 4,
    clinic_id: 2,
    full_name: "Dr. James Wilson",
    email: "james.wilson@example.com",
    phone_number: "555-0204",
    created_at: "2025-01-22T10:00:00Z"
  },
  {
    id: 5,
    clinic_id: 3,
    full_name: "Dr. Lisa Anderson",
    email: "lisa.anderson@example.com",
    phone_number: "555-0205",
    created_at: "2025-02-02T10:00:00Z"
  }
];

export const dummyPatients = [
  {
    id: 1,
    full_name: "John Doe",
    email: "john.doe@example.com",
    phone_number: "555-0301",
    created_at: "2025-01-10T10:00:00Z"
  },
  {
    id: 2,
    full_name: "Jane Smith",
    email: "jane.smith@example.com",
    phone_number: "555-0302",
    created_at: "2025-01-11T10:00:00Z"
  },
  {
    id: 3,
    full_name: "Robert Brown",
    email: "robert.brown@example.com",
    phone_number: "555-0303",
    created_at: "2025-01-12T10:00:00Z"
  },
  {
    id: 4,
    full_name: "Maria Garcia",
    email: "maria.garcia@example.com",
    phone_number: "555-0304",
    created_at: "2025-01-13T10:00:00Z"
  },
  {
    id: 5,
    full_name: "David Lee",
    email: "david.lee@example.com",
    phone_number: "555-0305",
    created_at: "2025-01-14T10:00:00Z"
  }
];

// Generate system-wide user growth over time
export const generateUserGrowthTimeSeries = (days = 30) => {
  const data = [];
  const today = new Date();
  let baseUsers = 20;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Simulate gradual growth
    baseUsers += Math.floor(Math.random() * 3);
    
    data.push({
      date: date.toISOString().split('T')[0],
      users: baseUsers
    });
  }
  
  return data;
};

// Generate user distribution by role
export const generateUserDistributionData = () => {
  return [
    { name: "Patients", value: 20, color: "#3b82f6" },
    { name: "Doctors", value: doctors.length, color: "#10b981" },
    { name: "Clinics", value: 3, color: "#f59e0b" }
  ];
};

// Generate clinic performance data
export const generateClinicPerformanceData = () => {
  return [
    {
      clinic_name: "City Medical Center",
      total_queues: 2,
      total_tickets: 156,
      completed_tickets: 142,
      active_tickets: 14,
      avg_wait_time: 12,
      total_patients: 8
    },
    {
      clinic_name: "Downtown Health Clinic",
      total_queues: 2,
      total_tickets: 98,
      completed_tickets: 89,
      active_tickets: 9,
      avg_wait_time: 10,
      total_patients: 6
    },
    {
      clinic_name: "Community Care Hospital",
      total_queues: 2,
      total_tickets: 67,
      completed_tickets: 61,
      active_tickets: 6,
      avg_wait_time: 8,
      total_patients: 6
    }
  ];
};

// Generate system activity over time
export const generateSystemActivityTimeSeries = (days = 30) => {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      activity: Math.floor(Math.random() * 40) + 30
    });
  }
  
  return data;
};
