"use client";
import { Button } from "@/components/ui/button";
import { Calendar, Shield } from "lucide-react";
import Link from "next/link";
import { LanguageSwitch, useTranslation } from "./languageSwitch";

const Navbar = () => {
  const t = useTranslation();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-none">
              Dr. Sarah Johnson
            </h1>
            <p className="text-xs text-muted-foreground">
              Chief Medical Officer
            </p>
          </div>
        </div>
        <nav className="flex items-center gap-2 sm:gap-4">
          <LanguageSwitch />
          <Link href="/appointment-book">
            <Button size="lg" className="hidden sm:flex">
              <Calendar className="mr-2 h-4 w-4" />
              {t("bookAppointment")}
            </Button>
            <Button size="icon" className="sm:hidden">
              <Calendar className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              {t("staffLogin")}
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
