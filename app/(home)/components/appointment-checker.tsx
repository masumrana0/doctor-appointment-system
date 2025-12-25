"use client";
import type React from "react";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Loader2,
  Download,
  Calendar,
  Clock,
  Hash,
  User,
  Mail,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import { Appointment } from "@/interface";

export function AppointmentChecker() {
  const [email, setEmail] = useState("");
  const [appointmentId, setAppointmentId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  const normalizedId = useMemo(
    () => appointmentId.trim().toLowerCase(),
    [appointmentId]
  );

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setSearched(false);
      setAppointments([]);

      if (!normalizedEmail && !normalizedId) {
        setError("Please enter either email or appointment ID");
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch("/api/appointments");
        if (!response.ok) throw new Error("Request failed");

        const data = await response.json();
        const fetchedAppointments: Appointment[] = data.appointments ?? [];

        const filteredAppointments = fetchedAppointments
          .filter((apt) => {
            if (normalizedId) {
              return apt.id?.toLowerCase().includes(normalizedId);
            }
            if (normalizedEmail) {
              return (
                apt.patientEmail?.toLowerCase() === normalizedEmail ||
                apt.patientEmail?.toLowerCase().includes(normalizedEmail)
              );
            }
            return false;
          })
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

        setAppointments(filteredAppointments);
        setSearched(true);

        if (filteredAppointments.length === 0) {
          setError("No appointments found with the provided information");
        }
      } catch (err) {
        setError("Failed to search appointments. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [normalizedEmail, normalizedId]
  );

  const downloadAppointmentPDF = (appointment: Appointment) => {
    const content = `
╔═══════════════════════════════════════════════════════════╗
║           APPOINTMENT CONFIRMATION                         ║
║           Dr. Sarah Johnson Medical Practice               ║
╚═══════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

APPOINTMENT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Appointment ID:     ${appointment.id}
Serial Number:      #${appointment.serialNumber}
Status:             ${appointment?.status?.toUpperCase()}

Date:               ${format(new Date(appointment.date), "PPPP")}
Time Slot:          ${appointment.timeSlot}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PATIENT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name:               ${appointment.patientName}
Email:              ${appointment.patientEmail}
Phone:              ${appointment.patientPhone}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT REMINDERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Please arrive 10 minutes before your scheduled time
• Bring your ID and insurance card
• If you need to reschedule, please call us at least 24 hours in advance
• Wear a mask if you have any respiratory symptoms

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLINIC INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dr. Sarah Johnson Medical Practice
123 Medical Center Drive
New York, NY 10001

Phone:              (555) 123-4567
Email:              info@drjohnson.com
Website:            www.drjohnson.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Booked on: ${format(new Date(appointment?.createdAt as any), "PPpp")}

Thank you for choosing Dr. Sarah Johnson Medical Practice!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `appointment-${appointment.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Check Your Appointment</CardTitle>
          <CardDescription>
            Enter your email address or appointment ID to view your appointment
            details and queue number
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (e.target.value) setAppointmentId("");
                }}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointmentId">Appointment ID</Label>
              <Input
                id="appointmentId"
                placeholder="APT-1234567890"
                value={appointmentId}
                onChange={(e) => {
                  setAppointmentId(e.target.value);
                  if (e.target.value) setEmail("");
                }}
              />
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search Appointments
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {searched && appointments.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-semibold">
              Found {appointments.length} appointment
              {appointments.length > 1 ? "s" : ""}
            </h2>
          </div>

          {appointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Appointment Details</CardTitle>
                  <Badge
                    variant={
                      appointment.status === "completed"
                        ? "secondary"
                        : appointment.status === "cancelled"
                        ? "destructive"
                        : "default"
                    }
                    className="text-base px-3 py-1"
                  >
                    {appointment.status}
                  </Badge>
                </div>
                <CardDescription>
                  Booked on {format(new Date(appointment?.createdAt as any), "PPp")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Hash className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Serial Number
                      </p>
                      <p className="text-xl font-bold">
                        #{appointment.serialNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <Calendar className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Date
                      </p>
                      <p className="text-base font-semibold">
                        {format(new Date(appointment.date), "PPP")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Time Slot
                      </p>
                      <p className="text-base font-semibold">
                        {appointment.timeSlot}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <User className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Patient Name
                      </p>
                      <p className="text-base font-semibold">
                        {appointment.patientName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Email
                      </p>
                      <p className="text-sm font-semibold break-all">
                        {appointment.patientEmail}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <Phone className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Phone
                      </p>
                      <p className="text-base font-semibold">
                        {appointment.patientPhone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-4 space-y-2">
                  <p className="font-semibold text-sm">Appointment ID:</p>
                  <p className="font-mono text-xs text-muted-foreground break-all">
                    {appointment.id}
                  </p>
                </div>

                <Button
                  onClick={() => downloadAppointmentPDF(appointment)}
                  className="w-full"
                  size="lg"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Appointment Details (PDF)
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
