"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bell, Loader2, Send } from "lucide-react";
import type { Notice } from "@/interface";
import {
  useCreateNoticeMutation,
  useUpdateNoticeMutation,
} from "@/redux/query/notice-query";
import { toast } from "sonner";

type NoticeManagementProps = {
  editingNotice?: Notice | null;
  onCancelEdit?: () => void;
};

export function NoticeManagement({
  editingNotice,
  onCancelEdit,
}: NoticeManagementProps) {
  const [createNotice, { isLoading: isCreating }] = useCreateNoticeMutation();
  const [updateNotice, { isLoading: isUpdating }] = useUpdateNoticeMutation();
  const isSubmitting = isCreating || isUpdating;

  const defaultFormData = { title: "", content: "", isPinNav: false };
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    if (editingNotice) {
      setFormData({
        title: editingNotice.title ?? "",
        content: editingNotice.content ?? "",
        isPinNav: Boolean(editingNotice.isPinNav),
      });
      return;
    }
    setFormData(defaultFormData);
  }, [editingNotice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNotice?.id) {
      const response = await updateNotice({
        id: editingNotice.id,
        data: {
          title: formData.title,
          content: formData.content,
          isPinNav: formData.isPinNav,
        },
      }).unwrap();

      if (response.success && onCancelEdit) {
        toast.success("Notice updated successfully", {
          description: "The notice has been updated on the homepage.",
        });
        onCancelEdit();
        return;
      }
    } else {
      const response = await createNotice({
        title: formData.title,
        content: formData.content,
        isActive: true,
        isPinned: false,
        isPinNav: Boolean(formData.isPinNav),
      }).unwrap();

      if (response.success) {
        setFormData(defaultFormData);
        toast.success("Notice created successfully", {
          description: "The notice has been posted on the homepage.",
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Create Notice</CardTitle>
            <CardDescription>
              Post announcements for patients on the homepage
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notice-title">Title</Label>
            <Input
              id="notice-title"
              placeholder="Important Announcement"
              value={formData.title}
              disabled={Boolean(isSubmitting)}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notice-content">Content</Label>
            <Textarea
              id="notice-content"
              placeholder="Enter your announcement details here..."
              rows={10}
              cols={20}
              className="h-62.5  overflow-auto"
              aria-label="Announcement content"
              value={formData.content}
              disabled={Boolean(isSubmitting)}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              required
            />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-md border p-3">
            <div className="space-y-1">
              <Label htmlFor="notice-pin-nav">Show in bottom notice nav</Label>
              <p className="text-xs text-muted-foreground">
                Pinned notices appear in the bottom scrolling bar.
              </p>
            </div>
            <input
              id="notice-pin-nav"
              type="checkbox"
              className="h-4 w-4"
              checked={Boolean(formData.isPinNav)}
              disabled={Boolean(isSubmitting)}
              onChange={(e) =>
                setFormData({ ...formData, isPinNav: e.target.checked })
              }
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={Boolean(isSubmitting)}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {isSubmitting
              ? editingNotice
                ? "Updating..."
                : "Publishing..."
              : editingNotice
              ? "Update Notice"
              : "Publish Notice"}
          </Button>

          {editingNotice && onCancelEdit ? (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={Boolean(isSubmitting)}
              onClick={onCancelEdit}
            >
              Cancel Editing
            </Button>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
