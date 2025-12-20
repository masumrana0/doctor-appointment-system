"use client";
import { useRouter } from "next/navigation";
import { StaffManagement } from "@/app/(dashboard)/components/staff-management";

export default function StaffManagementPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
        <p className="text-muted-foreground">
          Create and manage admin and receptionist accounts
        </p>
      </div>

      <StaffManagement />
    </div>
  );
}
