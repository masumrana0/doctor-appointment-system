"use client";
import React from "react";
import { useTranslation } from "./shared/languageSwitch";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Calendar, Clock } from "lucide-react";

const WhyChooseSection = () => {
  const t = useTranslation();
  return (
    <section className="w-full py-12 md:py-20 animate-in fade-in duration-1000 delay-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            {t("whyChooseUs")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("whyChooseUsDescription")}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="flex flex-col items-center text-center p-6 space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{t("easyScheduling")}</h3>
              <p className="text-muted-foreground">{t("easySchedulingDesc")}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="flex flex-col items-center text-center p-6 space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                <Clock className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">{t("queueManagement")}</h3>
              <p className="text-muted-foreground">
                {t("queueManagementDesc")}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="flex flex-col items-center text-center p-6 space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Award className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{t("expertCare")}</h3>
              <p className="text-muted-foreground">{t("expertCareDesc")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
