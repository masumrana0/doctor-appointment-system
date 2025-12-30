import type { Metadata } from "next";
import AppointmentsClientPage from "./appointments.client";

export const metadata: Metadata = {
  title: "Appointments",
};

export default function AppointmentsPage() {
  return <AppointmentsClientPage />;
}
