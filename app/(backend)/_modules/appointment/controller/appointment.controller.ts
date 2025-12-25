import status from "http-status";
import sendResponse from "../../../_core/shared/api-response";
import catchAsync from "../../../_core/shared/catch-async";
import { AppointmentService } from "../service/appointment.service";
import { Appointment } from "@/app/generated/prisma/client";

const createAppointment = catchAsync(async (req: Request) => {
  const result = await AppointmentService.createAppointment(req);

  return sendResponse({
    statusCode: status.CREATED,
    message: "Appointment created successfully",
    data: result,
  });
});

const updateAppointment = catchAsync(async (req: Request) => {
  const result = await AppointmentService.updateStatusCompleted(req);
  return sendResponse({
    statusCode: status.OK,
    message: "Appointment updated successfully",
    data: result,
  });
});

const getAllAppointment = catchAsync(async (req: Request) => {
  const { data, meta } = await AppointmentService.getAllAppointment(req);
  const normalizedMeta = meta
    ? {
        page: meta.page ?? 1,
        limit: meta.limit ?? 0,
        total: meta.total ?? 0,
      }
    : undefined;

  return sendResponse<Appointment[]>({
    statusCode: status.OK,
    message: "Appointment updated successfully",
    data: data,
    meta: normalizedMeta,
  });
});

export const AppointmentController = {
  createAppointment,
  updateAppointment,
  getAllAppointment,
};
