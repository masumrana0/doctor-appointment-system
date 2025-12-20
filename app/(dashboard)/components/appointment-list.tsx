"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { Appointment } from "@/interface";

interface AppointmentListProps {
  limit?: number;
}

export function AppointmentList({ limit }: AppointmentListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      patientName: "John Doe",
      patientEmail: "john.doe@email.com",
      patientPhone: "123-456-7890",
      date: "2024-07-01T10:00:00Z",
      timeSlot: "10:00 AM",
      serialNumber: 1,
      status: "completed",
      notes: "Regular checkup",
      createdAt: "2024-06-25T08:00:00Z",
    },
    {
      id: "2",
      patientName: "Jane Smith",
      patientEmail: "jane.smith@email.com",
      patientPhone: "234-567-8901",
      date: "2024-07-02T11:00:00Z",
      timeSlot: "11:00 AM",
      serialNumber: 2,
      status: "pending",
      notes: "Follow-up appointment",
      createdAt: "2024-06-26T09:15:00Z",
    },
    {
      id: "3",
      patientName: "Alice Johnson",
      patientEmail: "alice.johnson@email.com",
      patientPhone: "345-678-9012",
      date: "2024-07-03T09:30:00Z",
      timeSlot: "9:30 AM",
      serialNumber: 3,
      status: "cancelled",
      notes: "Patient cancelled due to emergency",
      createdAt: "2024-06-27T14:20:00Z",
    },
    {
      id: "4",
      patientName: "Robert Brown",
      patientEmail: "robert.brown@email.com",
      patientPhone: "456-789-0123",
      date: "2024-07-04T14:15:00Z",
      timeSlot: "2:15 PM",
      serialNumber: 4,
      status: "completed",
      notes: "Blood pressure check",
      createdAt: "2024-06-28T11:30:00Z",
    },
    {
      id: "5",
      patientName: "Emma Wilson",
      patientEmail: "emma.wilson@email.com",
      patientPhone: "567-890-1234",
      date: "2024-07-05T16:45:00Z",
      timeSlot: "4:45 PM",
      serialNumber: 5,
      status: "pending",
      createdAt: "2024-06-29T13:45:00Z",
    },
    {
      id: "6",
      patientName: "Michael Davis",
      patientEmail: "michael.davis@email.com",
      patientPhone: "678-901-2345",
      date: "2024-07-08T08:30:00Z",
      timeSlot: "8:30 AM",
      serialNumber: 6,
      status: "completed",
      notes: "Routine examination",
      createdAt: "2024-07-01T10:15:00Z",
    },
    {
      id: "7",
      patientName: "Sarah Miller",
      patientEmail: "sarah.miller@email.com",
      patientPhone: "789-012-3456",
      date: "2024-07-09T13:00:00Z",
      timeSlot: "1:00 PM",
      serialNumber: 7,
      status: "pending",
      notes: "Consultation for back pain",
      createdAt: "2024-07-02T16:20:00Z",
    },
    {
      id: "8",
      patientName: "David Garcia",
      patientEmail: "david.garcia@email.com",
      patientPhone: "890-123-4567",
      date: "2024-07-10T15:30:00Z",
      timeSlot: "3:30 PM",
      serialNumber: 8,
      status: "completed",
      notes: "Diabetes follow-up",
      createdAt: "2024-07-03T12:10:00Z",
    },
    {
      id: "9",
      patientName: "Lisa Anderson",
      patientEmail: "lisa.anderson@email.com",
      patientPhone: "901-234-5678",
      date: "2024-07-11T11:15:00Z",
      timeSlot: "11:15 AM",
      serialNumber: 9,
      status: "cancelled",
      notes: "Rescheduled to next week",
      createdAt: "2024-07-04T09:25:00Z",
    },
    {
      id: "10",
      patientName: "James Taylor",
      patientEmail: "james.taylor@email.com",
      patientPhone: "012-345-6789",
      date: "2024-07-12T10:45:00Z",
      timeSlot: "10:45 AM",
      serialNumber: 10,
      status: "pending",
      notes: "Annual physical exam",
      createdAt: "2024-07-05T14:30:00Z",
    },
    {
      id: "11",
      patientName: "Maria Rodriguez",
      patientEmail: "maria.rodriguez@email.com",
      patientPhone: "123-456-7891",
      date: "2024-07-15T09:00:00Z",
      timeSlot: "9:00 AM",
      serialNumber: 11,
      status: "completed",
      notes: "Prenatal checkup",
      createdAt: "2024-07-08T11:45:00Z",
    },
    {
      id: "12",
      patientName: "Christopher Lee",
      patientEmail: "chris.lee@email.com",
      patientPhone: "234-567-8902",
      date: "2024-07-16T14:30:00Z",
      timeSlot: "2:30 PM",
      serialNumber: 12,
      status: "pending",
      notes: "Skin examination",
      createdAt: "2024-07-09T08:20:00Z",
    },
    {
      id: "13",
      patientName: "Jennifer White",
      patientEmail: "jennifer.white@email.com",
      patientPhone: "345-678-9013",
      date: "2024-07-17T12:00:00Z",
      timeSlot: "12:00 PM",
      serialNumber: 13,
      status: "completed",
      notes: "Allergy consultation",
      createdAt: "2024-07-10T15:10:00Z",
    },
    {
      id: "14",
      patientName: "Thomas Harris",
      patientEmail: "thomas.harris@email.com",
      patientPhone: "456-789-0124",
      date: "2024-07-18T16:00:00Z",
      timeSlot: "4:00 PM",
      serialNumber: 14,
      status: "pending",
      createdAt: "2024-07-11T13:25:00Z",
    },
    {
      id: "15",
      patientName: "Amanda Clark",
      patientEmail: "amanda.clark@email.com",
      patientPhone: "567-890-1235",
      date: "2024-07-19T08:15:00Z",
      timeSlot: "8:15 AM",
      serialNumber: 15,
      status: "cancelled",
      notes: "Travel conflict",
      createdAt: "2024-07-12T10:40:00Z",
    },
    {
      id: "16",
      patientName: "Daniel Martinez",
      patientEmail: "daniel.martinez@email.com",
      patientPhone: "678-901-2346",
      date: "2024-07-22T13:45:00Z",
      timeSlot: "1:45 PM",
      serialNumber: 16,
      status: "pending",
      notes: "Cardiology consultation",
      createdAt: "2024-07-15T12:15:00Z",
    },
    {
      id: "17",
      patientName: "Michelle Thompson",
      patientEmail: "michelle.thompson@email.com",
      patientPhone: "789-012-3457",
      date: "2024-07-23T11:30:00Z",
      timeSlot: "11:30 AM",
      serialNumber: 17,
      status: "completed",
      notes: "Eye examination",
      createdAt: "2024-07-16T09:30:00Z",
    },
    {
      id: "18",
      patientName: "Kevin Moore",
      patientEmail: "kevin.moore@email.com",
      patientPhone: "890-123-4568",
      date: "2024-07-24T15:15:00Z",
      timeSlot: "3:15 PM",
      serialNumber: 18,
      status: "pending",
      notes: "Physical therapy consultation",
      createdAt: "2024-07-17T14:20:00Z",
    },
    {
      id: "19",
      patientName: "Rachel Green",
      patientEmail: "rachel.green@email.com",
      patientPhone: "901-234-5679",
      date: "2024-07-25T10:30:00Z",
      timeSlot: "10:30 AM",
      serialNumber: 19,
      status: "completed",
      notes: "Vaccination appointment",
      createdAt: "2024-07-18T11:55:00Z",
    },
    {
      id: "20",
      patientName: "Steven Walker",
      patientEmail: "steven.walker@email.com",
      patientPhone: "012-345-6780",
      date: "2024-07-26T17:00:00Z",
      timeSlot: "5:00 PM",
      serialNumber: 20,
      status: "pending",
      notes: "General consultation",
      createdAt: "2024-07-19T16:10:00Z",
    },
  ]);

  if (appointments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No appointments yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className="flex items-center justify-between p-4 rounded-lg border"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">{appointment.patientName}</span>
              <Badge variant="outline">#{appointment.serialNumber}</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(appointment.date), "PP")}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {appointment.timeSlot}
              </div>
            </div>
          </div>
          <Badge
            variant={
              appointment.status === "completed" ? "secondary" : "default"
            }
          >
            {appointment.status}
          </Badge>
        </div>
      ))}
    </div>
  );
}
