"use client";

import { Bell } from "lucide-react";
import { useTranslation } from "./shared/languageSwitch";
import NoticeCard from "@/components/shared/notice-card";
import { Notice } from "@/app/generated/prisma/client";

type NoticeBoardClientProps = {
  notices: Notice[];
};

export function NoticeBoardClient({ notices }: NoticeBoardClientProps) {
  const t = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Bell className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">{t("importantNotices")}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {notices.map((notice, index) => (
          <NoticeCard key={notice.id ?? index} notice={notice} index={index} />
        ))}
      </div>
    </div>
  );
}
