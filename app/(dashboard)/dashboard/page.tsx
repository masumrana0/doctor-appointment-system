import type { Metadata } from "next";
import { AdminDashboardOverview } from "../components/super-admin-dashboard";
import { getAdminDashboardStats } from "@/lib/actions";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function SuperAdminPage() {
  const overview = await getAdminDashboardStats();
  return <AdminDashboardOverview overview={overview} />;
}
