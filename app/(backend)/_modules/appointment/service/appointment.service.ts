import { paginationFields } from "@/app/(backend)/_core/constants/patination.constant";
import { requireAuth } from "@/app/(backend)/_core/error-handler/auth";
import { paginationHelpers } from "@/app/(backend)/_core/helper/pagination-helper";
import { IServiceResponse } from "@/app/(backend)/_core/interface/response";
import pick from "@/app/(backend)/_core/shared/pick";
import {
  Appointment,
  AppointmentStatus,
  Prisma,
} from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

// create Appointment
const createAppointment = async (req: Request) => {
  const body = await req.json();

  const { serialNumber, ...appointmentData } = body;

  const lastAppointment = await prisma.appointment.findFirst({
    where: {
      date: new Date(appointmentData.date),
    },
    orderBy: { serialNumber: "desc" },
  });

  if (!lastAppointment) {
    appointmentData.timeSlot = "03:00 PM";
  } else if (lastAppointment && lastAppointment.timeSlot) {
    const lastTime = lastAppointment.timeSlot;
    let [time, period] = lastTime.split(" ");
    let [hoursStr, minutesStr] = time.split(":").map(Number).slice(0, 2);
    let hours = Number(hoursStr);
    let minutes = Number(minutesStr);

    // Increment time by 6 minutes
    minutes += 6;
    if (minutes >= 60) {
      minutes = minutes % 60;
      hours += 1;
    }
    if (hours > 12) {
      hours = hours % 12;
      period = period === "AM" ? "PM" : "AM";
    }
    appointmentData.timeSlot = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${period}`;
  }

  appointmentData.serialNumber = lastAppointment
    ? lastAppointment.serialNumber + 1
    : 1;

  const result = await prisma.appointment.create({
    data: appointmentData,
  });

  return result;
};

// getAllAppointment for admin
const getAllAppointment = async (
  req: Request
): Promise<IServiceResponse<Appointment[]>> => {
  await requireAuth();
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Extract filters from query parameters
  const requestedDate = searchParams.get("date");

  const dateFilter =
    requestedDate && requestedDate !== "all" ? requestedDate : today;

  const patientPhone = searchParams.get("patientPhone") || undefined;

  const requestedStatus = searchParams.get("status");

  const status =
    requestedStatus === "all"
      ? null
      : (requestedStatus as AppointmentStatus | null);

  // Build filter conditions
  const filterConditions: Prisma.AppointmentWhereInput = {};
  if (status) {
    filterConditions.status = status;
  }

  if (dateFilter) {
    const startOfDay = new Date(`${dateFilter}T00:00:00.000Z`);
    const endOfDay = new Date(`${dateFilter}T23:59:59.999Z`);

    filterConditions.date = {
      gte: startOfDay,
      lte: endOfDay,
    };
  }
  if (patientPhone) {
    filterConditions.patientPhone = {
      contains: patientPhone,
      mode: "insensitive",
    };
  }

  // Get pagination parameters
  const paginationOptions = pick(
    Object.fromEntries(searchParams),
    paginationFields
  );

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  type AppointmentSortableField = "createdAt" | "date" | "serialNumber";

  // Fetch appointments with filters
  const appointments = await prisma.appointment.findMany({
    where: filterConditions,
    skip,
    take: limit,
    orderBy: {
      serialNumber: "asc",
    },
  });

  // Get total count for pagination
  const total = await prisma.appointment.count({
    where: filterConditions,
  });

  return {
    meta: {
      page: page,
      limit: limit,
      total: total,
    },
    data: appointments,
  };
};

// update appointment status to completed
const updateStatusCompleted = async (req: Request) => {
  await requireAuth();
  const body = await req.json();
  const { id } = body;

  const appointment = await prisma.appointment.update({
    where: { id },
    data: { status: "completed" },
  });

  return appointment;
};

export const AppointmentService = {
  createAppointment,
  getAllAppointment,
  updateStatusCompleted,
};
