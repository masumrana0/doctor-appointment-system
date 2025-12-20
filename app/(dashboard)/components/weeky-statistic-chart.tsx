"use client";

import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";
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

const lastWeekData = [
  { day: "Mon", date: "Dec 9", appointments: 24, completed: 22, cancelled: 2 },
  { day: "Tue", date: "Dec 10", appointments: 32, completed: 28, cancelled: 4 },
  { day: "Wed", date: "Dec 11", appointments: 28, completed: 25, cancelled: 3 },
  { day: "Thu", date: "Dec 12", appointments: 35, completed: 32, cancelled: 3 },
  { day: "Fri", date: "Dec 13", appointments: 42, completed: 38, cancelled: 4 },
  { day: "Sat", date: "Dec 14", appointments: 18, completed: 16, cancelled: 2 },
  { day: "Sun", date: "Dec 15", appointments: 8, completed: 7, cancelled: 1 },
];

export default function WeeklyStatisticChart() {
  const weekTotal = lastWeekData.reduce((sum, d) => sum + d.appointments, 0);
  const weekCompleted = lastWeekData.reduce((sum, d) => sum + d.completed, 0);

  return (
    <Card className="border border-border/40 bg-background/60 shadow-xl backdrop-blur-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3">
          <div>
            <CardTitle className="text-lg font-semibold sm:text-xl">
              Last Week Overview
            </CardTitle>
            <CardDescription className="text-sm">
              Dec 9 - Dec 15, 2024
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-chart-1" />
              <span className="text-muted-foreground">Booked:</span>
              <span className="font-semibold text-foreground">{weekTotal}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-chart-2" />
              <span className="text-muted-foreground">Completed:</span>
              <span className="font-semibold text-foreground">
                {weekCompleted}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-chart-4" />
              <span className="text-muted-foreground">Rate:</span>
              <span className="font-semibold text-foreground">
                {((weekCompleted / weekTotal) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer
          config={{
            appointments: {
              label: "Booked",
              color: "oklch(0.646 0.222 41.116)",
            },
            completed: {
              label: "Completed",
              color: "oklch(0.6 0.118 184.704)",
            },
          }}
          className="h-[260px] w-full sm:h-[300px]"
        >
          <LineChart
            data={lastWeekData}
            margin={{ top: 10, right: 10, bottom: 0, left: -20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(0.5 0 0 / 0.1)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "oklch(0.556 0 0)" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "oklch(0.556 0 0)" }}
              width={35}
            />
            <ChartTooltip
              content={<ChartTooltipContent labelKey="date" />}
              cursor={{ stroke: "oklch(0.5 0 0 / 0.2)" }}
            />
            <Line
              type="monotone"
              dataKey="appointments"
              stroke="var(--color-appointments)"
              strokeWidth={2.5}
              dot={{
                fill: "var(--color-appointments)",
                r: 4,
                strokeWidth: 2,
                stroke: "white",
              }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: "white" }}
              animationDuration={800}
              animationBegin={0}
            />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="var(--color-completed)"
              strokeWidth={2.5}
              dot={{
                fill: "var(--color-completed)",
                r: 4,
                strokeWidth: 2,
                stroke: "white",
              }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: "white" }}
              animationDuration={800}
              animationBegin={200}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
