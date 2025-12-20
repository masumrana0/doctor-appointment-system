// Core type definitions for the appointment platform

export type UserRole = "super_admin" | "admin";

export interface User {
  id: string;
  email: string;
  password: string; // In production, this would be hashed
  name: string;
  role: UserRole;
  phone?: string;
  designation?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string;
  timeSlot: string;
  serialNumber: number;
  status: "pending" | "completed" | "cancelled";
  notes?: string;
  createdAt: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
  isActive: boolean;
  isPinned: boolean;
}

export interface TimeSlot {
  id: string;
  time: string;
  isAvailable: boolean;
  maxPatients: number;
}
