"use client";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "./shared/languageSwitch";

interface Notice {
  id: string;
  title: string;
  message: string;
  isActive: boolean;
  createdAt: string;
}

export function NoticeBoard() {
  const t = useTranslation();
  const [notices, setNotices] = useState<Notice[]>([
    {
      id: "notice-001",
      title: "Doctor Appointment Reminder",
      message: "You have an appointment with Dr. Rahman tomorrow at 10:30 AM.",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "notice-003",
      title: "New Lab Report Available",
      message:
        "Your blood test report from December 18 is now available in your patient portal.",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Bell className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">{t("importantNotices")}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {notices.map((notice, index) => (
          <Card
            key={notice.id}
            className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in slide-in-from-bottom"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{notice.title}</CardTitle>
                <Badge variant="secondary">New</Badge>
              </div>
              <CardDescription>
                {format(new Date(notice.createdAt), "PPP")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{notice.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
