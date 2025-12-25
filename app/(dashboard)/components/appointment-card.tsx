"use client";
import { Appointment } from "@/app/generated/prisma/client";
import { Calendar, Clock, Loader2, Phone, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import React from "react";
import { useUpdateAppointmentMutation } from "@/redux/query/appointment-query";
import { ca } from "date-fns/locale";
import { toast } from "sonner";

const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
  const [update, { isLoading }] = useUpdateAppointmentMutation();

  async function updateComplete() {
    try {
      const response = await update({
        id: appointment.id,
      }).unwrap();

      if (response?.success) {
        toast.success("Appointment marked as completed", {
          description: `Appointment for ${appointment.patientName} has been marked as completed.`,
          position: "bottom-left",
        });
      }
    } catch (error) {
      console.error("Failed to update appointment:", error);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>{appointment.patientName}</span>
          <Badge variant="outline">#{appointment.serialNumber}</Badge>
        </div>
        <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {format(new Date(appointment.date), "PP")}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {appointment.timeSlot}
          </div>
          {appointment.patientPhone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {appointment.patientPhone}
            </div>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={updateComplete}
        disabled={isLoading || appointment.status === "completed"}
        aria-busy={isLoading}
        className={`group relative inline-flex items-center transition-all duration-200 ${
          isLoading || appointment.status === "completed"
            ? "cursor-not-allowed opacity-60"
            : "hover:opacity-90 hover:scale-[1.01]"
        }`}
      >
        <span className="absolute inset-0 rounded-lg bg-linear-to-r from-emerald-500/15 via-primary/10 to-cyan-500/15 opacity-0 blur transition-opacity duration-200 group-hover:opacity-100" />
        <Badge
          variant={appointment.status === "completed" ? "secondary" : "default"}
          className="relative w-fit capitalize px-4 py-2 text-sm font-semibold shadow-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Completing...
            </>
          ) : appointment.status === "completed" ? (
            "Completed"
          ) : (
            "Mark as Complete"
          )}
        </Badge>
      </button>
    </div>
  );
};

export default AppointmentCard;
