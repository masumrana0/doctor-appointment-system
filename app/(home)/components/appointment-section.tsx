"use client";

import AppointmentBooking from "./appointment-booking";
import { useTranslation } from "./shared/languageSwitch";

const AppointmentSection = () => {
  const t = useTranslation();
  return (
    <section id="booking" className="w-full py-12 md:py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* <div className={`text-center mb-8 animate-in fade-in duration-700`}>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              {t("bookYourAppointment")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("bookingDescription")}
            </p>
          </div> */}
          <div
            className={"animate-in slide-in-from-bottom duration-700 delay-200"}
          >
            <AppointmentBooking />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppointmentSection;
