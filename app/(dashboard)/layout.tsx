import React from "react";
import { DashboardClientLayout } from "./components/dashboard-layout";
import { requireAuth } from "../(backend)/_core/error-handler/auth";
export const    dynamic = "force-dynamic";
const layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await requireAuth();
  return (
    <>
      <DashboardClientLayout user={user}>{children}</DashboardClientLayout>
    </>
  );
};

export default layout;
