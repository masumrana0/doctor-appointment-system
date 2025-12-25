"use client";
import { useCallback, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateAppointmentMutation } from "@/redux/query/appointment-query";
import { ReusableModal, useModal } from "@/components/ui/reusable-modal";
import { Appointment } from "@/interface";
import { useTranslation } from "./shared/languageSwitch";
import { appointmentSchema, type AppointmentFormInput } from "@/validator";
import buildAppointmentSuccessModalContent from "./appointment-success-modal-content";

type AppointmentFormValues = AppointmentFormInput;

const getTodayStart = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const normalizeAppointmentDate = (date: Date) => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12,
    0,
    0,
    0
  );
};

const buildDefaultValues = (): AppointmentFormValues => ({
  patientName: "",
  patientEmail: "",
  patientPhone: "",
  date: normalizeAppointmentDate(getTodayStart()),
});

const AppointmentBooking = () => {
  const t = useTranslation();
  const [createAppointment, { isLoading }] = useCreateAppointmentMutation();
  const { modalState, showModal, showError, hideModal } = useModal();
  const defaultValues = useMemo<AppointmentFormValues>(
    () => buildDefaultValues(),
    []
  );

  const {
    control,
    handleSubmit: formHandleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<AppointmentFormValues>({
    defaultValues,
    resolver: zodResolver(appointmentSchema),
  });

  const [serverError, setServerError] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const reopenCalendar = useCallback(() => setIsCalendarOpen(true), []);

  const disableUnavailableDates = useCallback((date: Date) => {
    const candidateNormalized = normalizeAppointmentDate(date);
    const todayNormalized = normalizeAppointmentDate(getTodayStart());
    return (
      candidateNormalized.getTime() < todayNormalized.getTime() ||
      candidateNormalized.getDay() === 0
    );
  }, []);

  const onSubmit = async (values: AppointmentFormValues) => {
    setServerError("");

    const payload: Appointment = {
      ...values,
      date: normalizeAppointmentDate(values.date),
    };

    try {
      const result = await createAppointment(payload).unwrap();
      console.log(result);

      if (result?.success) {
        const [successTitle, successContent] =
          buildAppointmentSuccessModalContent(result.data, t);

        showModal(successTitle, successContent, t("modalPrimaryOk"), {
          title: successTitle,
          message: successContent,
          type: "success",
          primaryButtonText: t("modalPrimaryOk"),
        });
      }

      reset(buildDefaultValues());
    } catch (err: any) {
      const fallbackError = t("bookingErrorMessageFallback");
      const message = err?.data?.error || err?.message || fallbackError;

      setServerError(message);
      showError(t("bookingErrorTitle"), message, t("modalPrimaryRetry"));
    }
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-300">
        <div className={`text-center mb-8 animate-in fade-in duration-700`}>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            {t("bookYourAppointment")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("bookingDescription")}
          </p>
        </div>
        <CardContent>
          <form onSubmit={formHandleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{t("fullName")} *</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  {...register("patientName")}
                />
                {errors.patientName && (
                  <p className="text-sm text-destructive">
                    {errors.patientName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t("emailAddress")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...register("patientEmail")}
                />
                {errors.patientEmail && (
                  <p className="text-sm text-destructive">
                    {errors.patientEmail.message}
                  </p>
                )}
              </div>
            </div>

            <div className="w-full grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">{t("phoneNumber")} *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+8801XXXXXXXXX"
                  {...register("patientPhone")}
                />
                {errors.patientPhone && (
                  <p className="text-sm text-destructive">
                    {errors.patientPhone.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>{t("appointmentDate")} *</Label>
                <Controller
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <Popover
                      open={isCalendarOpen}
                      onOpenChange={setIsCalendarOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          onClick={() => setIsCalendarOpen(true)}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            <span>
                              {field.value.toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (!date || disableUnavailableDates(date)) {
                              return;
                            }

                            const normalized = normalizeAppointmentDate(date);
                            field.onChange(normalized);
                            requestAnimationFrame(reopenCalendar);
                          }}
                          disabled={disableUnavailableDates}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.date && (
                  <p className="text-sm text-destructive">
                    {errors.date.message as string}
                  </p>
                )}
              </div>
            </div>
            {serverError && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive animate-in slide-in-from-top duration-300">
                {serverError}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                t("appointmentSubmit")
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <ReusableModal
        isOpen={modalState.isOpen}
        onClose={hideModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        primaryButtonText={modalState.primaryButtonText}
        secondaryButtonText={modalState.secondaryButtonText}
        onPrimaryAction={modalState.onPrimaryAction}
        onSecondaryAction={modalState.onSecondaryAction}
        showSecondaryButton={modalState.showSecondaryButton}
      />
    </>
  );
};

export default AppointmentBooking;
