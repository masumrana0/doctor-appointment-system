"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Notice } from "@/interface";
import { NoticeManagement } from "@/app/(dashboard)/components/notice-management";

export default function NoticesManagementPage() {
  const [notices, setNotices] = useState<Notice[]>([
    {
      id: "1",
      title: "New Appointment System Update",
      content:
        "We have upgraded our appointment booking system for better user experience. Please note that all appointments will now require confirmation via email.",
      createdBy: "admin@clinic.com",
      createdAt: "2024-01-15T09:00:00Z",
      isActive: true,
      isPinned: true,
    },
    {
      id: "2",
      title: "Holiday Schedule Notice",
      content:
        "Our clinic will be closed on January 26th for Republic Day. Emergency services will be available through our partner hospital.",
      createdBy: "admin@clinic.com",
      createdAt: "2024-01-10T14:30:00Z",
      isActive: true,
      isPinned: false,
    },
    {
      id: "3",
      title: "New COVID-19 Safety Protocols",
      content:
        "Updated safety measures are now in place. Please wear masks in common areas and maintain social distancing in waiting rooms.",
      createdBy: "health.officer@clinic.com",
      createdAt: "2024-01-08T11:15:00Z",
      isActive: false,
      isPinned: false,
    },
    {
      id: "4",
      title: "Telemedicine Services Available",
      content:
        "We now offer online consultations for routine check-ups and follow-up appointments. Book your virtual visit through our portal.",
      createdBy: "admin@clinic.com",
      createdAt: "2024-01-05T16:45:00Z",
      isActive: true,
      isPinned: false,
    },
  ]);
  const [isLoadingNotices, setIsLoadingNotices] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notice Management</h1>
        <p className="text-muted-foreground">
          Create and manage announcements displayed on the homepage
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <NoticeManagement />

        <Card>
          <CardHeader>
            <CardTitle>Published Notices</CardTitle>
            <CardDescription>
              All notices visible to patients on the homepage
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingNotices ? (
              <div className="text-center py-4 text-muted-foreground">
                Loading...
              </div>
            ) : notices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No notices published yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notices.map((notice) => (
                  <div
                    key={notice.id}
                    className="rounded-lg border p-4 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold">{notice.title}</h4>
                      <Badge
                        variant={notice.isActive ? "default" : "secondary"}
                      >
                        {notice.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notice.content}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Published on {format(new Date(notice.createdAt), "PPp")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
