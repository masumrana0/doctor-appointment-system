"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AppointmentChecker } from "../components/appointment-checker";

export default function AppointmentCheckClient() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          <AppointmentChecker />
        </div>
      </div>
    </div>
  );
}
