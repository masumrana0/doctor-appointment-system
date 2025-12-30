"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import AppointmentList from "../../components/appointment-list";
import { useGetAllAppointmentsQuery } from "@/redux/query/appointment-query";
import { selectAppointmentQueryArgs } from "@/redux/slices/appointment-slice";
import { useAppSelector } from "@/redux/hook";
import { useMemo } from "react";
import { Appointment } from "@/app/generated/prisma/client";
import AppointmentFilter from "../../components/appointment-filter";
import { IMeta } from "@/app/(backend)/_core/interface/response";
import PaginationSwitcher from "../../components/pagination-switcher";

export default function AppointmentsClientPage() {
  const queryArgs = useAppSelector(selectAppointmentQueryArgs);
  console.log(queryArgs);

  const { data, isLoading, isFetching } = useGetAllAppointmentsQuery(queryArgs);

  const appointments = useMemo(
    () => (data?.data as Appointment[]) ?? [],
    [data]
  );

  const meta = data?.meta as IMeta;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Appointments</h1>
        <p className="text-muted-foreground">
          View and manage all patient appointments
        </p>
      </div>

      <Card>
        <CardHeader className="w-full flex justify-center  ">
          <AppointmentFilter />
        </CardHeader>
        <CardContent>
          <AppointmentList appointments={appointments} isLoading={isLoading} />
        </CardContent>

        <CardFooter className="w-full flex justify-center items-center">
          <PaginationSwitcher
            isFetching={isFetching}
            isLoading={isLoading}
            paginationMeta={meta}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
