"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AppointmentList } from "../../components/appointment-list";

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Appointments</h1>
        <p className="text-muted-foreground">
          View and manage all patient appointments
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment History</CardTitle>
          <CardDescription>
            Complete list of all booked appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AppointmentList />
        </CardContent>
      </Card>
    </div>
  );
}
