export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import AppointmentSection from "../components/appointment-section";

export const metadata: Metadata = {
  title: "Book Appointment",
};

const AppointmentPage = () => {
  return <AppointmentSection />;
};

export default AppointmentPage;
