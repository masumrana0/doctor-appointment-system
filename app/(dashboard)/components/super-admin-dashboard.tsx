"use client";
import YearlyStatisticsChart from "./yearly-statistic-chart";
import WeeklyStatisticChart from "./weeky-statistic-chart";
import type { DashboardOverview } from "@/interface";
import DashboardOverviewStatCard from "./dashboard-stat-card";
import { Bell, CalendarDays, TrendingUp, Users } from "lucide-react";

export function AdminDashboardOverview({
  overview,
}: {
  overview: DashboardOverview;
}) {
  const statsConfig = [
    {
      title: "Total Staff",
      value: overview.totalStaff,
      description: "Active staff members",
      icon: Users,
    },
    {
      title: "Total Appointments",
      value: overview.totalAppointments,
      description: "All time bookings",
      icon: CalendarDays,
    },
    {
      title: "Today's Queue",
      value: overview.todayAppointments,
      description: "Patients scheduled today",
      icon: TrendingUp,
    },
    {
      title: "Active Notices",
      value: overview.activeNotices,
      description: "Published announcements",
      icon: Bell,
    },
  ];
  console.log(overview);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Super Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage staff, appointments, and platform settings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsConfig.map((stat) => (
          <DashboardOverviewStatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2 overflow-scroll md:overflow-hidden">
        <YearlyStatisticsChart
          years={overview.yearly.years}
          defaultYear={overview.yearly.defaultYear}
          dataByYear={overview.yearly.dataByYear}
        />
        <WeeklyStatisticChart
          rangeLabel={overview.weekly.rangeLabel}
          data={overview.weekly.data}
        />
      </div>
    </div>
  );
}
