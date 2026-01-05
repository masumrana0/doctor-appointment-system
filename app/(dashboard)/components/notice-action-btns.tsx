"use client";
import { Notice } from "@/app/generated/prisma/client";
import { Button } from "@/components/ui/button";
import {
  useDeleteNoticeMutation,
  useUpdateNoticeMutation,
} from "@/redux/query/notice-query";
import React from "react";
import { toast } from "sonner";

const NoticeActionBtns = ({
  notice,
  setEditingNotice,
}: {
  notice: Notice;
  setEditingNotice: React.Dispatch<React.SetStateAction<Notice | null>>;
}) => {
  const [updateNotice, { isLoading: isUpdating }] = useUpdateNoticeMutation();
  const [deleteNotice, { isLoading: isDeleting }] = useDeleteNoticeMutation();

  const handleToggleActive = async () => {
    try {
      const res = await updateNotice({ id: notice.id, data: { isActive: !notice.isActive } }).unwrap();
      if (res.success) {
        toast.success("Notice updated", {
          description: "Notice visibility updated.",
        });
      }
    } catch (error: any) {
      const message = error?.data?.message ?? error?.message ?? "Failed to update notice";
      toast.error(message, { description: "There was an error updating the notice." });
    }
  };

  const handleTogglePinNav = async () => {
    try {
      const res = await updateNotice({
        id: notice.id,
        data: { isPinNav: !notice.isPinNav },
      }).unwrap();
      if (res.success) {
        toast.success("Notice updated", { description: "Notice pin state updated." });
      }
    } catch (error: any) {
      const message = error?.data?.message ?? error?.message ?? "Failed to update notice";
      toast.error(message, { description: "There was an error updating the notice." });
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this notice?"
    );
    if (!confirmed) return;

    try {
      const res = await deleteNotice(notice.id).unwrap();
      if (res.success) {
        toast.success("Notice deleted", { description: "The notice has been removed." });
      }
    } catch (error: any) {
      const message = error?.data?.message ?? error?.message ?? "Failed to delete notice";
      toast.error(message, { description: "There was an error deleting the notice." });
    }
  };
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setEditingNotice(notice)}
      >
        Edit
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isUpdating}
        onClick={() => handleToggleActive()}
      >
        {notice.isActive ? "Make Inactive" : "Make Active"}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isUpdating}
        onClick={() => handleTogglePinNav()}
      >
        {notice.isPinNav ? "Unpin Nav" : "Pin Nav"}
      </Button>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        disabled={isDeleting}
        onClick={() => handleDelete()}
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </Button>
    </div>
  );
};

export default NoticeActionBtns;
