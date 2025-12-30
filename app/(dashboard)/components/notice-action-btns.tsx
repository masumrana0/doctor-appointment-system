"use client";
import { Notice } from "@/app/generated/prisma/client";
import { Button } from "@/components/ui/button";
import {
  useDeleteNoticeMutation,
  useUpdateNoticeMutation,
} from "@/redux/query/notice-query";
import React from "react";

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
    await updateNotice({ id: notice.id, data: { isActive: !notice.isActive } });
  };

  const handleTogglePinNav = async () => {
    await updateNotice({
      id: notice.id,
      data: { isPinNav: !notice.isPinNav },
    });
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this notice?"
    );
    if (!confirmed) return;

    await deleteNotice(notice.id);
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
