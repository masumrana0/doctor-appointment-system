"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";

type Timeframe = "weekly" | "monthly" | "yearly";

const appointmentData: Record<
  Timeframe,
  { name: string; appointments: number; cancellations: number }[]
> = {
  weekly: [
    { name: "Mon", appointments: 12, cancellations: 2 },
    { name: "Tue", appointments: 19, cancellations: 1 },
    { name: "Wed", appointments: 15, cancellations: 3 },
    { name: "Thu", appointments: 22, cancellations: 0 },
    { name: "Fri", appointments: 30, cancellations: 4 },
    { name: "Sat", appointments: 10, cancellations: 1 },
    { name: "Sun", appointments: 5, cancellations: 0 },
  ],
  monthly: [
    { name: "Week 1", appointments: 85, cancellations: 10 },
    { name: "Week 2", appointments: 92, cancellations: 8 },
    { name: "Week 3", appointments: 78, cancellations: 15 },
    { name: "Week 4", appointments: 110, cancellations: 12 },
  ],
  yearly: [
    { name: "Jan", appointments: 400, cancellations: 40 },
    { name: "Feb", appointments: 350, cancellations: 30 },
    { name: "Mar", appointments: 500, cancellations: 45 },
    { name: "Apr", appointments: 450, cancellations: 50 },
    { name: "May", appointments: 520, cancellations: 38 },
    { name: "Jun", appointments: 480, cancellations: 42 },
  ],
};

const trendData: Record<
  Timeframe,
  { name: string; total: number; trend: number }[]
> = {
  weekly: [
    { name: "Mon", total: 12, trend: 12 },
    { name: "Tue", total: 19, trend: 15 },
    { name: "Wed", total: 15, trend: 15 },
    { name: "Thu", total: 22, trend: 17 },
    { name: "Fri", total: 30, trend: 20 },
    { name: "Sat", total: 10, trend: 18 },
    { name: "Sun", total: 5, trend: 16 },
  ],
  monthly: [
    { name: "Week 1", total: 85, trend: 85 },
    { name: "Week 2", total: 92, trend: 88 },
    { name: "Week 3", total: 78, trend: 85 },
    { name: "Week 4", total: 110, trend: 91 },
  ],
  yearly: [
    { name: "Jan", total: 400, trend: 400 },
    { name: "Feb", total: 350, trend: 375 },
    { name: "Mar", total: 500, trend: 417 },
    { name: "Apr", total: 450, trend: 425 },
    { name: "May", total: 520, trend: 444 },
    { name: "Jun", total: 480, trend: 450 },
  ],
};

export default function AppointmentCharts() {
  const [timeframe, setTimeframe] = useState<Timeframe>("weekly");

  return (
    <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
      {/* Chart 1: Appointment Overview */}
      <Card className="border border-border/40 bg-background/60 shadow-lg backdrop-blur-xl">
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-3">
            <div>
              <CardTitle className="text-lg font-semibold sm:text-xl">
                Appointment Overview
              </CardTitle>
              <CardDescription className="text-sm">
                Total appointments vs cancellations
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(["weekly", "monthly", "yearly"] as Timeframe[]).map((type) => (
                <Button
                  key={type}
                  onClick={() => setTimeframe(type)}
                  variant={timeframe === type ? "default" : "outline"}
                  size="sm"
                  className="h-7 px-2.5 text-xs capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <ChartContainer
            config={{
              appointments: {
                label: "Appointments",
                color: "oklch(0.646 0.222 41.116)",
              },
              cancellations: {
                label: "Cancellations",
                color: "oklch(0.577 0.245 27.325)",
              },
            }}
            className="h-[250px] w-full sm:h-[280px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={appointmentData[timeframe]}
                margin={{ top: 10, right: 10, bottom: 0, left: -15 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.5 0 0 / 0.15)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "oklch(0.556 0 0)" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "oklch(0.556 0 0)" }}
                  width={35}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="appointments"
                  fill="var(--color-appointments)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
                <Bar
                  dataKey="cancellations"
                  fill="var(--color-cancellations)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Chart 2: Appointment Trends */}
      <Card className="border border-border/40 bg-background/60 shadow-lg backdrop-blur-xl">
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-3">
            <div>
              <CardTitle className="text-lg font-semibold sm:text-xl">
                Appointment Trends
              </CardTitle>
              <CardDescription className="text-sm">
                Daily appointments with moving average
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(["weekly", "monthly", "yearly"] as Timeframe[]).map((type) => (
                <Button
                  key={type}
                  onClick={() => setTimeframe(type)}
                  variant={timeframe === type ? "default" : "outline"}
                  size="sm"
                  className="h-7 px-2.5 text-xs capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <ChartContainer
            config={{
              total: {
                label: "Total",
                color: "oklch(0.646 0.222 41.116)",
              },
              trend: {
                label: "Trend",
                color: "oklch(0.6 0.118 184.704)",
              },
            }}
            className="h-[250px] w-full sm:h-[280px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trendData[timeframe]}
                margin={{ top: 10, right: 10, bottom: 0, left: -15 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.5 0 0 / 0.15)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "oklch(0.556 0 0)" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "oklch(0.556 0 0)" }}
                  width={35}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="var(--color-total)"
                  strokeWidth={2.5}
                  dot={{ fill: "var(--color-total)", r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="trend"
                  stroke="var(--color-trend)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
