"use client";

import { Bell } from "lucide-react";
import { useTranslation } from "./languageSwitch";

type PinnedNoticeNavClientProps = {
  tickerText: string;
};

export default function PinnedNoticeNavClient({
  tickerText,
}: PinnedNoticeNavClientProps) {
  const t = useTranslation();

  if (!tickerText) return null;

  return (
    <nav
      className="fixed bottom-0 z-50 w-full border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
      aria-label={t("notices")}
    >
      <div className="container mx-auto flex h-10 items-center gap-3 px-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Bell className="h-4 w-4 text-primary" aria-hidden="true" />
          <span>{t("notices")}</span>
        </div>

        <div className="relative flex-1 overflow-hidden">
          <div
            className="notice-ticker-ltr whitespace-nowrap text-sm text-muted-foreground"
            role="status"
            aria-live="polite"
            title={tickerText}
          >
            {tickerText}
          </div>
        </div>
      </div>
    </nav>
  );
}
