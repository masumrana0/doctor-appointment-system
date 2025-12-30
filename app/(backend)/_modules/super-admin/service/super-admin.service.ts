import { Auth } from "@/app/(backend)/_core/error-handler/auth";
import { AppointmentStatus, UserRole } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { expirePendingAppointments } from "@/app/(backend)/_core/helper/appointment-expiry";

export type SuperAdminDashboardStats = {
  totalStaff: number;
  totalAppointments: number;
  todayAppointments: number;
  activeNotices: number;
};

export type YearlyStatisticsPoint = {
  month: string;
  appointments: number;
  cancellations: number;
};

export type WeeklyStatisticsPoint = {
  day: string;
  date: string;
  appointments: number;
  completed: number;
  cancelled: number;
};

export type SuperAdminDashboardOverview = SuperAdminDashboardStats & {
  yearly: {
    years: string[];
    defaultYear: string;
    dataByYear: Record<string, YearlyStatisticsPoint[]>;
  };
  weekly: {
    rangeLabel: string;
    data: WeeklyStatisticsPoint[];
  };
};

const getStartOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
};

const getStartOfTomorrow = () => {
  const start = getStartOfToday();
  return new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate() + 1,
    0,
    0,
    0,
    0
  );
};

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formatShortMonthDay = (d: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(d);

const formatWeekday = (d: Date) =>
  new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(d);

const formatRangeLabel = (start: Date, end: Date) => {
  const startText = formatShortMonthDay(start);
  const endText = formatShortMonthDay(end);
  return `${startText} - ${endText}, ${end.getFullYear()}`;
};

const getDashboardStats = async (): Promise<SuperAdminDashboardStats> => {
  await Auth.getInstance().requireAuth();
  await expirePendingAppointments();

  const startOfToday = getStartOfToday();
  const startOfTomorrow = getStartOfTomorrow();

  const [totalStaff, totalAppointments, todayAppointments, activeNotices] =
    await prisma.$transaction([
      prisma.user.count({
        where: {
          role: UserRole.admin,
        },
      }),
      prisma.appointment.count(),
      prisma.appointment.count({
        where: {
          status: AppointmentStatus.pending,
          date: {
            gte: startOfToday,
            lt: startOfTomorrow,
          },
        },
      }),
      prisma.notice.count({
        where: {
          isActive: true,
        },
      }),
    ]);

  return {
    totalStaff,
    totalAppointments,
    todayAppointments,
    activeNotices,
  };
};

const getDashboardOverview = async (): Promise<SuperAdminDashboardOverview> => {
  await Auth.getInstance().requireAuth();
  await expirePendingAppointments();

  const startOfToday = getStartOfToday();
  const startOfTomorrow = getStartOfTomorrow();

  const now = new Date();
  const currentYear = now.getFullYear();
  const years = Array.from({ length: 5 }, (_, i) =>
    String(currentYear - 4 + i)
  );
  const defaultYear = String(currentYear);

  const [
    totalStaff,
    totalAppointments,
    todayAppointments,
    activeNotices,
    weeklyRows,
    ...yearlyRowsByYear
  ] = await prisma.$transaction([
    prisma.user.count({ where: { role: UserRole.admin } }),
    prisma.appointment.count(),
    prisma.appointment.count({
      where: {
        status: AppointmentStatus.pending,
        date: { gte: startOfToday, lt: startOfTomorrow },
      },
    }),
    prisma.notice.count({ where: { isActive: true } }),
    prisma.$queryRaw<
      Array<{
        day: Date;
        appointments: bigint;
        completed: bigint;
        cancelled: bigint;
      }>
    >`
      SELECT
        date_trunc('day', "date"::timestamp) AS day,
        COUNT(*)::bigint AS appointments,
        SUM(CASE WHEN "status" = 'completed' THEN 1 ELSE 0 END)::bigint AS completed,
        SUM(CASE WHEN "status" = 'cancelled' THEN 1 ELSE 0 END)::bigint AS cancelled
      FROM "appointments"
      WHERE "date"::timestamp >= ${new Date(
        startOfToday.getFullYear(),
        startOfToday.getMonth(),
        startOfToday.getDate() - 6,
        0,
        0,
        0,
        0
      )}
        AND "date"::timestamp < ${startOfTomorrow}
      GROUP BY 1
      ORDER BY 1 ASC
    `,
    ...years.map((year) => {
      const y = Number(year);
      const start = new Date(y, 0, 1, 0, 0, 0, 0);
      const end = new Date(y + 1, 0, 1, 0, 0, 0, 0);

      return prisma.$queryRaw<
        Array<{ month: Date; appointments: bigint; cancellations: bigint }>
      >`
        SELECT
          date_trunc('month', "date"::timestamp) AS month,
          COUNT(*)::bigint AS appointments,
          SUM(CASE WHEN "status" = 'cancelled' THEN 1 ELSE 0 END)::bigint AS cancellations
        FROM "appointments"
        WHERE "date"::timestamp >= ${start} AND "date"::timestamp < ${end}
        GROUP BY 1
        ORDER BY 1 ASC
      `;
    }),
  ]);

  const weeklyStart = new Date(
    startOfToday.getFullYear(),
    startOfToday.getMonth(),
    startOfToday.getDate() - 6,
    0,
    0,
    0,
    0
  );
  const weeklyEnd = startOfToday;

  const weeklyMap = new Map<string, (typeof weeklyRows)[number]>();
  for (const row of weeklyRows) {
    const key = new Date(row.day).toISOString().slice(0, 10);
    weeklyMap.set(key, row);
  }

  const weeklyData: WeeklyStatisticsPoint[] = Array.from(
    { length: 7 },
    (_, i) => {
      const d = new Date(
        weeklyStart.getFullYear(),
        weeklyStart.getMonth(),
        weeklyStart.getDate() + i,
        0,
        0,
        0,
        0
      );
      const key = d.toISOString().slice(0, 10);
      const row = weeklyMap.get(key);

      return {
        day: formatWeekday(d),
        date: formatShortMonthDay(d),
        appointments: row ? Number(row.appointments) : 0,
        completed: row ? Number(row.completed) : 0,
        cancelled: row ? Number(row.cancelled) : 0,
      };
    }
  );

  const dataByYear: Record<string, YearlyStatisticsPoint[]> = {};
  years.forEach((year, index) => {
    const rows = yearlyRowsByYear[index] as Array<{
      month: Date;
      appointments: bigint;
      cancellations: bigint;
    }>;

    const monthToCounts = new Map<
      number,
      { appointments: number; cancellations: number }
    >();
    for (const row of rows) {
      const monthIndex = new Date(row.month).getMonth();
      monthToCounts.set(monthIndex, {
        appointments: Number(row.appointments),
        cancellations: Number(row.cancellations),
      });
    }

    dataByYear[year] = monthLabels.map((label, monthIndex) => {
      const v = monthToCounts.get(monthIndex);
      return {
        month: label,
        appointments: v?.appointments ?? 0,
        cancellations: v?.cancellations ?? 0,
      };
    });
  });

  return {
    totalStaff,
    totalAppointments,
    todayAppointments,
    activeNotices,
    yearly: {
      years,
      defaultYear,
      dataByYear,
    },
    weekly: {
      rangeLabel: formatRangeLabel(weeklyStart, weeklyEnd),
      data: weeklyData,
    },
  };
};

export const SuperAdminService = { getDashboardStats, getDashboardOverview };
