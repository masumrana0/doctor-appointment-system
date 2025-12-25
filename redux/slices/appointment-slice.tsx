import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

type StatusFilter = "pending" | "completed" | "cancelled" | "all";
export type AppointmentQueryArgs = {
  page: number;
  limit: number;
  date?: string;
  patientPhone?: string;
  status?: Exclude<StatusFilter, "all">;
};

const today = new Date().toISOString().split("T")[0];

interface AppointmentQueryState {
  page: number;
  limit: number;
  date: string;
  patientPhone: string;
  status: StatusFilter;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  firstIndex?: number;
  lastIndex?: number;
}

const initialState: AppointmentQueryState = {
  page: 1,
  limit: 10,
  date: today,
  patientPhone: "",
  status: "pending",
};

export const appointmentQueryInitialState: AppointmentQueryState = initialState;

const appointmentQuerySlice = createSlice({
  name: "appointmentQuery",
  initialState,
  reducers: {
    setFilters(
      state,
      action: PayloadAction<
        Partial<Omit<AppointmentQueryState, "page" | "limit">>
      >
    ) {
      Object.assign(state, action.payload);
      state.page = 1;
    },
    setPagination(
      state,
      action: PayloadAction<{ page?: number; limit?: number }>
    ) {
      if (action.payload.limit !== undefined) {
        state.limit = Math.max(action.payload.limit, 1);
        state.page = 1;
      }
      if (action.payload.page !== undefined) {
        state.page = Math.max(action.payload.page, 1);
      }
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const { setFilters, setPagination, resetFilters } =
  appointmentQuerySlice.actions;
export default appointmentQuerySlice.reducer;

export const selectAppointmentQuery = (state: {
  appointmentQuery?: AppointmentQueryState;
}) => state.appointmentQuery ?? appointmentQueryInitialState;

export const selectAppointmentQueryArgs = createSelector(
  selectAppointmentQuery,
  ({ page, limit, date, patientPhone, status }): AppointmentQueryArgs => {
    const args: AppointmentQueryArgs = { page, limit };

    if (date) args.date = date;
    if (patientPhone.trim()) args.patientPhone = patientPhone.trim();
    if (status !== "all") {
      args.status = status as Exclude<StatusFilter, "all">;
    }

    return args;
  }
);
