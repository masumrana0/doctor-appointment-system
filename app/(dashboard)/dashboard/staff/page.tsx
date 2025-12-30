import { StaffManagement } from "@/app/(dashboard)/components/staff-management";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Staff",
};

export default function StaffManagementPage() {
  return (
    <div className="space-y-6">
      <StaffManagement />
    </div>
  );
}
