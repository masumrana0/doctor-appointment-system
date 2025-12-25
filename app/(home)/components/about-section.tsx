"use client";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { useTranslation } from "./shared/languageSwitch";

const AboutSection = () => {
  const t = useTranslation();
  return (
    <section id="about" className="w-full py-12 md:py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="animate-in slide-in-from-left duration-700">
            <img
              src="/modern-medical-clinic.png"
              alt="Medical clinic"
              className="rounded-xl shadow-lg w-full hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="space-y-6 animate-in slide-in-from-right duration-700">
            <Badge variant="secondary">{t("aboutDoctor")}</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("dedicatedTitle")}
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>{t("aboutPara1")}</p>
              <p>{t("aboutPara2")}</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>{t("boardCertified")}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>{t("treatingPatients")}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>{t("topRated")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
