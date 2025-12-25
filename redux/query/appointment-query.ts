import { Appointment } from "@/interface";
import { baseQuery } from "./base-query";

type AppointmentStatus = "pending" | "completed" | "cancelled";

type GetAppointmentsQueryArgs = {
  page?: number;
  limit?: number;
  date?: string;
  patientPhone?: string;
  status?: AppointmentStatus;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

type AppointmentCollection = {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: Appointment[];
};

const url = "/appointment";
const appointmentQuery = baseQuery.injectEndpoints({
  endpoints: (build) => ({
    createAppointment: build.mutation({
      query: (appointment: Appointment) => ({
        url: url,
        method: "POST",
        body: appointment,
      }),
      invalidatesTags: ["appointment"],
    }),

    getAllAppointments: build.query<AppointmentCollection, GetAppointmentsQueryArgs | void>({
      query: (params) => ({
        url,
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["appointment"],
    }),

    updateAppointment: build.mutation({
      query: (appointment) => ({
        url: url,
        method: "PATCH",
        body: appointment,
      }),
      invalidatesTags: ["appointment"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateAppointmentMutation,
  useGetAllAppointmentsQuery,
  useUpdateAppointmentMutation,
} = appointmentQuery;
