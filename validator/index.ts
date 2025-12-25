import { z } from "zod";
import { Appointment } from "@/interface";

const bdPhoneRegex = /^01[3-9]\d{8}$/;

export const appointmentSchema = z
  .object({
    patientName: z
      .string({ required_error: "Full name is required" })
      .trim()
      .min(1, { message: "Full name is required" }),
    patientEmail: z
      .string({ required_error: "Email address is required" })
      .trim()
      .min(1, { message: "Email address is required" })
      .email({ message: "Enter a valid email address." }),
    patientPhone: z
      .string({ required_error: "Phone number is required" })
      .trim()
      .min(1, { message: "Phone number is required" })
      .refine((value) => bdPhoneRegex.test(value.replace(/[\s-]/g, "")), {
        message:
          "Please enter a valid Bangladeshi phone number (e.g., 01XXXXXXXXX)",
      }),
    date: z.preprocess((value) => {
      if (value instanceof Date) return value;
      if (typeof value === "string" || typeof value === "number") {
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? undefined : parsed;
      }
      return value;
    }, z.date({ required_error: "Appointment date is required" })),
  })
  .passthrough();

export type AppointmentFormInput = z.infer<typeof appointmentSchema>;

export const validateAppointmentForm = (formData: Appointment) => {
  const result = appointmentSchema.safeParse(formData);

  if (!result.success) {
    return result.error.issues[0]?.message ?? "Invalid appointment data";
  }

  return null;
};
