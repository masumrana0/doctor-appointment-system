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

import { NoticeManagement } from "@/app/(dashboard)/components/notice-management";
import NoticeCard from "@/components/shared/notice-card";
import { useGetAllNoticeQuery } from "@/redux/query/notice-query";
import Loader from "@/components/shared/loader";
import NoticeActionBtns from "../../components/notice-action-btns";
import { Notice } from "@/app/generated/prisma/client";

export default function NoticesClientPage() {
  const [editingNotice, setEditingNotice] = useState<Notice | null | any>(null);

  const { data, isLoading: isLoadingNotices } = useGetAllNoticeQuery(undefined);
  const notices = (data?.data ?? []) as Notice[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notice Management</h1>
        <p className="text-muted-foreground">
          Create and manage announcements displayed on the homepage
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <NoticeManagement
          editingNotice={editingNotice}
          onCancelEdit={() => setEditingNotice(null)}
        />

        <Card>
          <CardHeader>
            <CardTitle>Published Notices</CardTitle>
            <CardDescription>
              All notices visible to patients on the homepage
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingNotices ? (
              <Loader height="30vh" />
            ) : notices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No notices published yet</p>
              </div>
            ) : (
              <div className="space-y-4 overflow-auto max-h-125">
                {notices.map((notice, index) => (
                  <NoticeCard
                    key={notice.id ?? index}
                    notice={notice as Notice}
                    index={index as number}
                    showNewBadge={false}
                    topRight={
                      <>
                        {notice.isPinNav ? (
                          <Badge variant="outline">Nav</Badge>
                        ) : null}
                        <Badge
                          variant={notice.isActive ? "default" : "secondary"}
                        >
                          {notice.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </>
                    }
                    actions={
                      <NoticeActionBtns
                        notice={notice as Notice}
                        setEditingNotice={setEditingNotice}
                      />
                    }
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
