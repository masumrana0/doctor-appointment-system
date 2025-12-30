"use client";
import React, { useMemo, useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Notice } from "@/app/generated/prisma/client";

const DEFAULT_WORD_LIMIT = 22;

function truncateWords(text: string, wordLimit: number) {
  const trimmed = (text ?? "").trim();
  if (!trimmed) return { preview: "", isTruncated: false };

  const words = trimmed.split(/\s+/);
  if (words.length <= wordLimit) {
    return { preview: trimmed, isTruncated: false };
  }

  return {
    preview: `${words.slice(0, wordLimit).join(" ")}...`,
    isTruncated: true,
  };
}

type NoticeCardProps = {
  notice: Notice;
  index?: number;
  wordLimit?: number;
  topRight?: React.ReactNode;
  actions?: React.ReactNode;
  showNewBadge?: boolean;
};

export default function NoticeCard({
  notice,
  index = 0,
  wordLimit = DEFAULT_WORD_LIMIT,
  topRight,
  actions,
  showNewBadge = true,
}: NoticeCardProps) {
  const [open, setOpen] = useState(false);

  const createdAtLabel = useMemo(() => {
    try {
      return format(new Date(notice.createdAt), "PPP");
    } catch {
      return null;
    }
  }, [notice.createdAt]);

  const { preview, isTruncated } = useMemo(
    () => truncateWords(notice.content ?? "", wordLimit),
    [notice.content, wordLimit]
  );

  return (
    <>
      <Card
        className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in slide-in-from-bottom"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-lg">{notice.title}</CardTitle>
            {topRight ? (
              <div className="flex items-center gap-2">{topRight}</div>
            ) : showNewBadge ? (
              <Badge variant="secondary">New</Badge>
            ) : null}
          </div>
          {createdAtLabel ? (
            <CardDescription>{createdAtLabel}</CardDescription>
          ) : null}
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {preview}
            </p>

            {isTruncated ? (
              <Button
                type="button"
                variant="link"
                className="h-auto p-0"
                onClick={() => setOpen(true)}
              >
                See more
              </Button>
            ) : null}

            {actions ? <div className="pt-2">{actions}</div> : null}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[70vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{notice.title}</DialogTitle>
            {createdAtLabel ? (
              <DialogDescription>{createdAtLabel}</DialogDescription>
            ) : null}
          </DialogHeader>

          <div className="max-h-[50vh] overflow-auto rounded-md border p-4">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {notice.content ?? ""}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
