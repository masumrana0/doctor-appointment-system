"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
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
import { cn } from "@/lib/utils";
import type { YearlyStatisticsPoint } from "@/interface";

type Props = {
  years: string[];
  defaultYear: string;
  dataByYear: Record<string, YearlyStatisticsPoint[]>;
};

export default function YearlyStatisticsChart({
  years,
  defaultYear,
  dataByYear,
}: Props) {
  const safeDefaultYear = useMemo(() => {
    if (years.includes(defaultYear)) return defaultYear;
    return years[years.length - 1] ?? defaultYear;
  }, [years, defaultYear]);

  const [selectedYear, setSelectedYear] = useState<string>(safeDefaultYear);
  const [isAnimating, setIsAnimating] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedYear(safeDefaultYear);
  }, [safeDefaultYear]);

  const handleYearChange = (year: string) => {
    setIsAnimating(true);
    setSelectedYear(year);
    setTimeout(() => setIsAnimating(false), 300);
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft =
        scrollContainerRef.current.scrollWidth;
    }
  }, []);

  const chartData = dataByYear[selectedYear] ?? [];

  const totalAppointments = chartData.reduce(
    (sum, m) => sum + m.appointments,
    0
  );
  const totalCancellations = chartData.reduce(
    (sum, m) => sum + m.cancellations,
    0
  );

  return (
    <Card className="border border-border/40 bg-background/60 shadow-xl backdrop-blur-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3">
          <div>
            <CardTitle className="text-lg font-semibold sm:text-xl">
              Yearly Statistics
            </CardTitle>
            <CardDescription className="text-sm">
              Monthly appointments breakdown by year
            </CardDescription>
          </div>
          <div
            ref={scrollContainerRef}
            className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
          >
            {years.map((year) => (
              <Button
                key={year}
                onClick={() => handleYearChange(year)}
                variant={selectedYear === year ? "default" : "outline"}
                size="sm"
                className={cn(
                  "h-8 shrink-0 px-3 text-xs font-medium transition-all duration-200",
                  selectedYear === year && "shadow-md"
                )}
              >
                {year}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-chart-1" />
              <span className="text-muted-foreground">Total:</span>
              <span className="font-semibold text-foreground">
                {totalAppointments.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
              <span className="text-muted-foreground">Cancelled:</span>
              <span className="font-semibold text-foreground">
                {totalCancellations.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div
          className={cn(
            "transition-all duration-300",
            isAnimating && "scale-[0.98] opacity-50"
          )}
        >
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
            className="h-65 w-full sm:h-75"
          >
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, bottom: 0, left: -20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.5 0 0 / 0.1)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: "oklch(0.556 0 0)" }}
                interval={0}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: "oklch(0.556 0 0)" }}
                width={40}
                tickFormatter={(value) =>
                  value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value
                }
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                cursor={{ fill: "oklch(0.5 0 0 / 0.05)" }}
              />
              <Bar
                dataKey="appointments"
                fill="var(--color-appointments)"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
                animationDuration={500}
                animationBegin={0}
              />
              <Bar
                dataKey="cancellations"
                fill="var(--color-cancellations)"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
                animationDuration={500}
                animationBegin={100}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
