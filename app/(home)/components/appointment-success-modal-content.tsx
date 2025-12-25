import { BadgeCheck, Calendar, Clock } from "lucide-react";
import React from "react";
import { Appointment } from "@/interface";
import type { TranslationKey } from "@/lib/translation";

const InfoCard = ({
  icon: Icon,
  label,
  value,
  colorScheme = "green",
}: {
  icon: React.ComponentType<{ className: string }>;
  label: string;
  value: React.ReactNode;
  colorScheme?: "green" | "blue" | "amber";
}) => {
  const colorClasses = {
    green:
      "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-600 text-green-700 dark:text-green-400",
    blue: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-600 text-blue-700 dark:text-blue-400",
    amber:
      "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-600 text-amber-900 dark:text-amber-100",
  };

  const [bgColor, borderColor, iconColor, textColor] =
    colorClasses[colorScheme].split(" ");

  return (
    <div
      className={`flex items-start gap-3 p-4 ${bgColor} rounded-lg border ${borderColor}`}
    >
      <Icon className={`h-5 w-5 ${iconColor} mt-0.5 shrink-0`} />
      <div className="flex flex-col flex-1">
        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
          {label}
        </p>
        <p className={`text-base font-semibold ${textColor} wrap-break-word`}>
          {value}
        </p>
      </div>
    </div>
  );
};

function buildAppointmentSuccessModalContent(
  appointment: Appointment,
  t: (key: TranslationKey) => string
): [string, React.ReactNode | any] {
  const serial = appointment?.serialNumber ?? t("bookingSuccessSerialPending");

  const rawDate = appointment?.date as unknown as Date | string | undefined;
  const dateObj =
    rawDate instanceof Date
      ? rawDate
      : rawDate
      ? new Date(rawDate)
      : new Date();
  const dateText = dateObj.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const timeText = appointment?.timeSlot ?? t("bookingSuccessSerialPending");

  const successTitle = t("bookingSuccessTitle");

  const successContent = (
    <div className="space-y-5 w-full max-w-md mx-auto px-4 sm:px-0">
      <div className="space-y-3">
        <InfoCard
          icon={Calendar}
          label={t("bookingSuccessDateTime")}
          value={
            <div className="flex flex-col gap-2 text-left sm:flex-row sm:items-center sm:justify-between">
              <span className="text-base font-semibold text-emerald-700 dark:text-emerald-300">
                {dateText}
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-800 dark:text-emerald-200">
                <Clock className="h-4 w-4" />
                {timeText}
              </span>
            </div>
          }
          colorScheme="green"
        />

        <InfoCard
          icon={BadgeCheck}
          label={t("bookingSuccessMessageSerial")}
          value={
            <span className="text-xl font-bold tracking-wide">#{serial}</span>
          }
          colorScheme="blue"
        />
      </div>

      <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
        <span className="text-lg shrink-0">⏰</span>
        <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-100 font-medium">
          {t("bookingSuccessMessageNote")}
        </p>
      </div>
    </div>
  );

  return [successTitle, successContent];
}

export default buildAppointmentSuccessModalContent;
