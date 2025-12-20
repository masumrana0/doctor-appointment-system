"use client";

import { useState, useRef, useEffect } from "react";
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

type YearKey = "2020" | "2021" | "2022" | "2023" | "2024";

const yearlyMonthData: Record<
  YearKey,
  { month: string; appointments: number; cancellations: number }[]
> = {
  "2020": [
    { month: "Jan", appointments: 280, cancellations: 32 },
    { month: "Feb", appointments: 310, cancellations: 28 },
    { month: "Mar", appointments: 150, cancellations: 45 },
    { month: "Apr", appointments: 120, cancellations: 38 },
    { month: "May", appointments: 180, cancellations: 22 },
    { month: "Jun", appointments: 250, cancellations: 30 },
    { month: "Jul", appointments: 320, cancellations: 35 },
    { month: "Aug", appointments: 340, cancellations: 28 },
    { month: "Sep", appointments: 380, cancellations: 40 },
    { month: "Oct", appointments: 360, cancellations: 32 },
    { month: "Nov", appointments: 320, cancellations: 25 },
    { month: "Dec", appointments: 280, cancellations: 30 },
  ],
  "2021": [
    { month: "Jan", appointments: 350, cancellations: 38 },
    { month: "Feb", appointments: 380, cancellations: 32 },
    { month: "Mar", appointments: 420, cancellations: 45 },
    { month: "Apr", appointments: 390, cancellations: 40 },
    { month: "May", appointments: 450, cancellations: 35 },
    { month: "Jun", appointments: 480, cancellations: 42 },
    { month: "Jul", appointments: 520, cancellations: 48 },
    { month: "Aug", appointments: 490, cancellations: 38 },
    { month: "Sep", appointments: 510, cancellations: 45 },
    { month: "Oct", appointments: 480, cancellations: 40 },
    { month: "Nov", appointments: 420, cancellations: 35 },
    { month: "Dec", appointments: 380, cancellations: 42 },
  ],
  "2022": [
    { month: "Jan", appointments: 420, cancellations: 45 },
    { month: "Feb", appointments: 380, cancellations: 38 },
    { month: "Mar", appointments: 510, cancellations: 52 },
    { month: "Apr", appointments: 480, cancellations: 48 },
    { month: "May", appointments: 550, cancellations: 42 },
    { month: "Jun", appointments: 520, cancellations: 55 },
    { month: "Jul", appointments: 580, cancellations: 50 },
    { month: "Aug", appointments: 560, cancellations: 45 },
    { month: "Sep", appointments: 590, cancellations: 58 },
    { month: "Oct", appointments: 540, cancellations: 48 },
    { month: "Nov", appointments: 480, cancellations: 42 },
    { month: "Dec", appointments: 420, cancellations: 38 },
  ],
  "2023": [
    { month: "Jan", appointments: 480, cancellations: 52 },
    { month: "Feb", appointments: 420, cancellations: 45 },
    { month: "Mar", appointments: 580, cancellations: 58 },
    { month: "Apr", appointments: 550, cancellations: 52 },
    { month: "May", appointments: 620, cancellations: 48 },
    { month: "Jun", appointments: 590, cancellations: 62 },
    { month: "Jul", appointments: 650, cancellations: 55 },
    { month: "Aug", appointments: 680, cancellations: 58 },
    { month: "Sep", appointments: 720, cancellations: 65 },
    { month: "Oct", appointments: 680, cancellations: 58 },
    { month: "Nov", appointments: 620, cancellations: 52 },
    { month: "Dec", appointments: 550, cancellations: 48 },
  ],
  "2024": [
    { month: "Jan", appointments: 520, cancellations: 48 },
    { month: "Feb", appointments: 480, cancellations: 42 },
    { month: "Mar", appointments: 620, cancellations: 55 },
    { month: "Apr", appointments: 580, cancellations: 50 },
    { month: "May", appointments: 680, cancellations: 45 },
    { month: "Jun", appointments: 720, cancellations: 58 },
    { month: "Jul", appointments: 780, cancellations: 52 },
    { month: "Aug", appointments: 820, cancellations: 60 },
    { month: "Sep", appointments: 850, cancellations: 65 },
    { month: "Oct", appointments: 800, cancellations: 55 },
    { month: "Nov", appointments: 750, cancellations: 48 },
    { month: "Dec", appointments: 680, cancellations: 52 },
  ],
};

const availableYears: YearKey[] = ["2020", "2021", "2022", "2023", "2024"];

export default function YearlyStatisticsChart() {
  const [selectedYear, setSelectedYear] = useState<YearKey>("2024");
  const [isAnimating, setIsAnimating] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleYearChange = (year: YearKey) => {
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

  const totalAppointments = yearlyMonthData[selectedYear].reduce(
    (sum, m) => sum + m.appointments,
    0
  );
  const totalCancellations = yearlyMonthData[selectedYear].reduce(
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
            {availableYears.map((year) => (
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
            className="h-[260px] w-full sm:h-[300px]"
          >
            <BarChart
              data={yearlyMonthData[selectedYear]}
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
