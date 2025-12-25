import { AppointmentController } from "../../_modules/appointment/controller/appointment.controller";

export const POST = AppointmentController.createAppointment;

export const GET = AppointmentController.getAllAppointment;

export const PATCH = AppointmentController.updateAppointment;
 