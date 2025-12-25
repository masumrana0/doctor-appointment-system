import { AppointmentStatus } from "@/app/generated/prisma/enums";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setFilters, setPagination } from "@/redux/slices/appointment-slice";

import React from "react";
const PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;
const AppointmentFilter = () => {
  const dispatch = useAppDispatch();
  const { limit, date, patientPhone, status } = useAppSelector(
    (state) => state.appointmentQuery
  );

  return (
    <div className="grid gap-4 rounded-2xl border border-border/60 bg-card p-4 sm:grid-cols-2 lg:grid-cols-4 w-full items-center">
      <div className="flex flex-col gap-2">
        <Label htmlFor="patientPhone" className="text-sm font-semibold">
          Patient Phone
        </Label>
        <Input
          id="patientPhone"
          type="tel"
          placeholder="Search by phone"
          value={patientPhone}
          onChange={(event) =>
            dispatch(setFilters({ patientPhone: event.target.value }))
          }
          className="w-full"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="appointmentDate" className="text-sm font-semibold">
          Appointment Date
        </Label>
        <Input
          id="appointmentDate"
          type="date"
          value={date}
          onChange={(event) =>
            dispatch(setFilters({ date: event.target.value }))
          }
          className="w-full"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold">Status</Label>
        <Select
          value={status}
          onValueChange={(value: AppointmentStatus) =>
            dispatch(setFilters({ status: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold">Per Page</Label>
        <Select
          value={String(limit)}
          onValueChange={(value: string) =>
            dispatch(setPagination({ limit: Number(value) }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select limit" />
          </SelectTrigger>
          <SelectContent>
            {PER_PAGE_OPTIONS.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AppointmentFilter;
