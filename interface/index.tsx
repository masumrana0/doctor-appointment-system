// Core type definitions for the appointment platform

export type UserRole = "super_admin" | "admin";

export interface User {
  id?: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phone?: string;
  designation?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Appointment {
  id?: string;
  patientName: string;
  patientEmail?: string;
  patientPhone: string;
  date: Date | string;
  timeSlot?: string;
  serialNumber?: number;
  status?: "pending" | "completed" | "cancelled";
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Notice {
  id?: string;
  title: string;
  content: string;
  createdAt: string;
  isActive: boolean;
  isPinned: boolean;
  isPinNav: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export type SuperAdminDashboardStats = {
  totalStaff: number;
  totalAppointments: number;
  todayAppointments: number;
  activeNotices: number;
};

export type YearlyStatisticsPoint = {
  month: string;
  appointments: number;
  cancellations: number;
};

export type WeeklyStatisticsPoint = {
  day: string;
  date: string;
  appointments: number;
  completed: number;
  cancelled: number;
};

export type DashboardOverview = SuperAdminDashboardStats & {
  yearly: {
    years: string[];
    defaultYear: string;
    dataByYear: Record<string, YearlyStatisticsPoint[]>;
  };
  weekly: {
    rangeLabel: string;
    data: WeeklyStatisticsPoint[];
  };
};

export type IUpdateQueryType<T> = { data: Partial<T>; id: string };
export type ID = string;
