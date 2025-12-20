import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AppointmentChecker } from "@/app/(home)/components/appointment-checker";

export default function AppointmentCheckPage() {
  return (
    <div className="bg-gradient-to-b from-primary/5 to-background  ">
      <div className="container mx-auto  p-5">
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
