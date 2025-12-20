"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { t } from "./shared/lenguageSwitch";

const HeroSection = () => {
  return (
    <section className="w-full py-12 md:py-20 bg-gradient-to-b from-primary/5 to-background animate-in fade-in duration-1000">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-6 animate-in slide-in-from-left duration-700">
            <Badge className="w-fit" variant="secondary">
              {t("professionalCare")}
            </Badge>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-balance">
                {t("heroTitle")}
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl">
                {t("heroDescription")}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <a href="#booking">{t("bookAppointment")}</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#about">{t("learnMore")}</a>
              </Button>
            </div>
          </div>
          <div className="relative animate-in slide-in-from-right duration-700">
            <Image
              width={1000}
              height={1000}
              src="/professional-doctor-in-medical-office.jpg"
              alt="Dr. Sarah Johnson"
              className="rounded-xl shadow-2xl w-full hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
