"use client";
import { Appointment } from "@/app/generated/prisma/client";
import AppointmentCard from "./appointment-card";
import Loader from "@/components/shared/loader";

const AppointmentList = ({
  appointments,
  isLoading,
}: {
  appointments: Appointment[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="space-y-5">
      {appointments.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          No appointments found for the selected filters.
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
