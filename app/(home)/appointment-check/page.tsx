import type { Metadata } from "next";
import AppointmentCheckClient from "./appointment-check.client";

export const metadata: Metadata = {
  title: "Check Appointment",
};

export default function AppointmentCheckPage() {
  return <AppointmentCheckClient />;
}
