"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/interface";
import { useDeleteUserMutation } from "@/redux/query/user-query";
import { Loader2, MoreVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";

type StaffMember = User & { id: string };

const StaffCard = ({ member }: { member: StaffMember }) => {
  const [deleteUser, { isLoading }] = useDeleteUserMutation();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this staff member?"
    );

    if (!confirmed) return;

    try {
      await deleteUser(member.id).unwrap();
      toast.success("Staff deleted", {
        description: `${member.name || "Staff"} has been removed.`,
      });
    } catch (error: any) {
      const message =
        error?.data?.message || error?.message || "Failed to delete";
      toast.error("Delete failed", { description: message });
    }
  };

  return (
    <div
      key={member.id}
      className="flex items-center justify-between p-4 rounded-lg border"
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold">{member.name}</h4>
          <Badge variant="secondary">{member.role}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{member.email}</p>
        {member.designation && (
          <p className="text-xs text-muted-foreground mt-1">
            {member.designation}
          </p>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="ml-3 shrink-0"
            aria-label="Staff actions"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreVertical className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={(e) => {
              e.preventDefault();
              handleDelete();
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default StaffCard;
